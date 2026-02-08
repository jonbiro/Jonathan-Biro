import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    FaBolt,
    FaBug,
    FaCrosshairs,
    FaMobileAlt,
    FaRedo,
    FaTrophy,
    FaVolumeMute,
    FaVolumeUp,
} from "react-icons/fa";

const GAME_DURATION_SECONDS = 25;
const BASE_BUG_COUNT_DESKTOP = 12;
const BASE_BUG_COUNT_MOBILE = 9;
const TICK_RATE_MS = 33;
const COMBO_WINDOW_MS = 900;
const MISS_TIME_PENALTY = 1.2;
const MAX_TIME_CAP = 35;

const BEST_SCORE_STORAGE_KEY = "qa-bug-hunt-best-score";
const SOUND_STORAGE_KEY = "qa-bug-hunt-sound";
const HAPTIC_STORAGE_KEY = "qa-bug-hunt-haptics";

const BUG_VARIANTS = {
    scout: {
        id: "scout",
        name: "Scout",
        points: 10,
        bonusTime: 0,
        sizeRange: [28, 36],
        speedRange: [0.11, 0.21],
        className:
            "border-cyan-300/45 bg-cyan-400/20 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.35)]",
    },
    tank: {
        id: "tank",
        name: "Tank",
        points: 16,
        bonusTime: 0,
        sizeRange: [35, 46],
        speedRange: [0.08, 0.16],
        className:
            "border-rose-300/45 bg-rose-400/20 text-rose-200 shadow-[0_0_24px_rgba(251,113,133,0.35)]",
    },
    glitch: {
        id: "glitch",
        name: "Glitch",
        points: 22,
        bonusTime: 0,
        sizeRange: [24, 31],
        speedRange: [0.17, 0.28],
        className:
            "border-violet-300/45 bg-violet-400/20 text-violet-200 shadow-[0_0_24px_rgba(196,181,253,0.35)]",
    },
    gold: {
        id: "gold",
        name: "Gold",
        points: 34,
        bonusTime: 1.7,
        sizeRange: [20, 28],
        speedRange: [0.2, 0.32],
        className:
            "border-amber-300/60 bg-amber-300/25 text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.45)]",
    },
};

const randomBetween = (min, max) => Math.random() * (max - min) + min;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const pickBugVariant = () => {
    const roll = Math.random();
    if (roll < 0.12) return BUG_VARIANTS.gold;
    if (roll < 0.3) return BUG_VARIANTS.glitch;
    if (roll < 0.57) return BUG_VARIANTS.tank;
    return BUG_VARIANTS.scout;
};

const isMobileLikeDevice = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }
    return window.matchMedia("(max-width: 767px), (hover: none), (pointer: coarse)").matches;
};

const supportsHaptics = () =>
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

const isPrimaryPointerEvent = (event) => {
    if (!event.isPrimary) {
        return false;
    }
    if (event.pointerType === "mouse") {
        return event.button === 0;
    }
    return true;
};

const readBooleanPreference = (key, fallback) => {
    if (typeof window === "undefined") {
        return fallback;
    }

    try {
        const storedValue = window.localStorage.getItem(key);
        if (storedValue === "true") return true;
        if (storedValue === "false") return false;
    } catch {
        return fallback;
    }

    return fallback;
};

const persistBooleanPreference = (key, value) => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(key, String(value));
    } catch {
        // Ignore persistence failures and continue gameplay.
    }
};

const createBug = (wave, mobileLikeMode) => {
    const variant = pickBugVariant();
    const speedBoost = 1 + Math.min(0.72, (wave - 1) * 0.08);
    const [minSize, maxSize] = variant.sizeRange;
    const [minSpeed, maxSpeed] = variant.speedRange;

    const sizeBoost = mobileLikeMode ? 6 : 0;
    const speedScale = mobileLikeMode ? 0.84 : 1;
    const speed = randomBetween(minSpeed, maxSpeed) * speedBoost * speedScale;
    const angle = randomBetween(0, Math.PI * 2);

    return {
        id: `bug-${Math.random().toString(36).slice(2, 10)}`,
        x: randomBetween(8, 92),
        y: randomBetween(12, 88),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.round(randomBetween(minSize + sizeBoost, maxSize + sizeBoost)),
        points: variant.points,
        bonusTime: variant.bonusTime,
        variantId: variant.id,
        variantName: variant.name,
        squashed: false,
    };
};

const spawnBugs = (count, wave, mobileLikeMode) =>
    Array.from({ length: count }, () => createBug(wave, mobileLikeMode));

const readBestScore = () => {
    if (typeof window === "undefined") {
        return 0;
    }

    try {
        const rawScore = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
        const parsedScore = Number(rawScore);
        return Number.isFinite(parsedScore) && parsedScore > 0 ? parsedScore : 0;
    } catch {
        return 0;
    }
};

const persistBestScore = (score) => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
    } catch {
        // Ignore storage errors and keep gameplay uninterrupted.
    }
};

const getResultLabel = (score, accuracy, waveReached) => {
    if (score >= 450 && accuracy >= 85) return "Legendary QA Commander";
    if (score >= 320 && accuracy >= 75) return "Automation Ace";
    if (score >= 220) return "High-Impact Bug Hunter";
    if (score >= 140) return "Reliable QA Specialist";
    return `Warmed up through wave ${waveReached}`;
};

const launchCelebration = async (score) => {
    try {
        const { default: confetti } = await import("canvas-confetti");
        const particleCount = Math.min(220, 90 + Math.floor(score / 4));

        confetti({
            particleCount,
            spread: 80,
            origin: { y: 0.6 },
        });
    } catch {
        // Keep results screen smooth if optional effect fails.
    }
};

const QAChallengeModal = ({ isOpen, onClose, motionEnabled = true }) => {
    const [phase, setPhase] = useState("idle");
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
    const [bugs, setBugs] = useState([]);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [hits, setHits] = useState(0);
    const [misses, setMisses] = useState(0);
    const [wave, setWave] = useState(1);
    const [flashMessage, setFlashMessage] = useState("");
    const [isArenaShaking, setIsArenaShaking] = useState(false);
    const [bestScore, setBestScore] = useState(readBestScore);
    const [mobileLikeMode, setMobileLikeMode] = useState(() => isMobileLikeDevice());
    const [soundEnabled, setSoundEnabled] = useState(() =>
        readBooleanPreference(SOUND_STORAGE_KEY, true)
    );
    const [hapticsEnabled, setHapticsEnabled] = useState(() =>
        readBooleanPreference(HAPTIC_STORAGE_KEY, true)
    );

    const scoreRef = useRef(0);
    const comboRef = useRef(0);
    const waveRef = useRef(1);
    const bestScoreRef = useRef(bestScore);
    const lastHitAtRef = useRef(0);
    const shakeTimeoutRef = useRef(0);
    const waveSpawnQueuedRef = useRef(false);
    const audioContextRef = useRef(null);

    const activeBugs = useMemo(() => bugs.filter((bug) => !bug.squashed), [bugs]);
    const accuracy = useMemo(() => {
        const attempts = hits + misses;
        return attempts ? Math.round((hits / attempts) * 100) : 100;
    }, [hits, misses]);
    const progressPercent = useMemo(
        () => clamp((timeLeft / GAME_DURATION_SECONDS) * 100, 0, 100),
        [timeLeft]
    );
    const resultLabel = useMemo(
        () => getResultLabel(score, accuracy, wave),
        [accuracy, score, wave]
    );

    const getAudioContext = useCallback(() => {
        if (typeof window === "undefined") {
            return null;
        }

        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) {
            return null;
        }

        if (!audioContextRef.current) {
            audioContextRef.current = new Context();
        }

        return audioContextRef.current;
    }, []);

    const playTone = useCallback(
        (
            frequency,
            duration = 0.08,
            { type = "triangle", volume = 0.045, glideTo = null } = {}
        ) => {
            if (!soundEnabled) {
                return;
            }

            const context = getAudioContext();
            if (!context) {
                return;
            }

            if (context.state === "suspended") {
                void context.resume();
            }

            const now = context.currentTime;
            const oscillator = context.createOscillator();
            const gain = context.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, now);
            if (glideTo) {
                oscillator.frequency.exponentialRampToValueAtTime(glideTo, now + duration);
            }

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start(now);
            oscillator.stop(now + duration + 0.03);
        },
        [getAudioContext, soundEnabled]
    );

    const triggerHaptic = useCallback(
        (pattern) => {
            if (!hapticsEnabled || !supportsHaptics()) {
                return;
            }
            navigator.vibrate(pattern);
        },
        [hapticsEnabled]
    );

    const playStartFeedback = useCallback(() => {
        playTone(440, 0.08, { type: "sine", volume: 0.045 });
        window.setTimeout(() => playTone(680, 0.1, { type: "triangle", volume: 0.04 }), 70);
        triggerHaptic([12]);
    }, [playTone, triggerHaptic]);

    const playWaveFeedback = useCallback(() => {
        playTone(620, 0.08, { type: "triangle", volume: 0.045 });
        window.setTimeout(() => playTone(780, 0.09, { type: "triangle", volume: 0.038 }), 65);
        triggerHaptic([10, 26, 10]);
    }, [playTone, triggerHaptic]);

    const playMissFeedback = useCallback(() => {
        playTone(180, 0.14, { type: "sawtooth", volume: 0.034, glideTo: 120 });
        triggerHaptic(24);
    }, [playTone, triggerHaptic]);

    const playHitFeedback = useCallback(
        (variantId, comboCount) => {
            const baseFrequencyByVariant = {
                scout: 520,
                tank: 360,
                glitch: 760,
                gold: 960,
            };

            const baseFrequency = baseFrequencyByVariant[variantId] || 480;
            const comboBoost = Math.min(170, comboCount * 18);
            const isTank = variantId === "tank";
            const isGlitch = variantId === "glitch";
            const isGold = variantId === "gold";

            playTone(baseFrequency + comboBoost, 0.075, {
                type: isTank ? "square" : "triangle",
                volume: 0.04,
            });

            if (isGlitch) {
                window.setTimeout(
                    () =>
                        playTone(baseFrequency + comboBoost + 120, 0.06, {
                            type: "sine",
                            volume: 0.028,
                        }),
                    35
                );
            }

            if (isGold) {
                window.setTimeout(
                    () =>
                        playTone(baseFrequency + comboBoost + 240, 0.1, {
                            type: "triangle",
                            volume: 0.05,
                        }),
                    45
                );
                triggerHaptic([14, 28, 14]);
                return;
            }

            triggerHaptic(comboCount >= 4 ? [10, 18, 10] : 10);
        },
        [playTone, triggerHaptic]
    );

    const playEndFeedback = useCallback(
        (finalScore) => {
            if (finalScore >= 260) {
                playTone(520, 0.09, { type: "sine", volume: 0.045 });
                window.setTimeout(
                    () => playTone(700, 0.11, { type: "sine", volume: 0.038 }),
                    85
                );
                window.setTimeout(
                    () => playTone(860, 0.13, { type: "triangle", volume: 0.04 }),
                    175
                );
                triggerHaptic([16, 34, 24]);
                return;
            }

            playTone(260, 0.16, { type: "sine", volume: 0.032, glideTo: 160 });
            triggerHaptic(30);
        },
        [playTone, triggerHaptic]
    );

    const endGame = useCallback(
        (finalScore) => {
            setPhase((currentPhase) => {
                if (currentPhase !== "running") {
                    return currentPhase;
                }
                return "finished";
            });

            playEndFeedback(finalScore);

            if (finalScore > bestScoreRef.current) {
                bestScoreRef.current = finalScore;
                setBestScore(finalScore);
                persistBestScore(finalScore);
                setFlashMessage("New high score unlocked");
            }

            if (motionEnabled && finalScore >= 260) {
                void launchCelebration(finalScore);
            }
        },
        [motionEnabled, playEndFeedback]
    );

    const startGame = useCallback(() => {
        const mobileLike = isMobileLikeDevice();
        const initialBugCount = mobileLike ? BASE_BUG_COUNT_MOBILE : BASE_BUG_COUNT_DESKTOP;

        scoreRef.current = 0;
        comboRef.current = 0;
        waveRef.current = 1;
        lastHitAtRef.current = 0;
        waveSpawnQueuedRef.current = false;

        setMobileLikeMode(mobileLike);
        setPhase("running");
        setTimeLeft(GAME_DURATION_SECONDS);
        setScore(0);
        setCombo(0);
        setHits(0);
        setMisses(0);
        setWave(1);
        setFlashMessage("Hunt started");
        setBugs(spawnBugs(initialBugCount, 1, mobileLike));
        playStartFeedback();
    }, [playStartFeedback]);

    const toggleSound = useCallback(() => {
        setSoundEnabled((currentState) => {
            const nextState = !currentState;
            persistBooleanPreference(SOUND_STORAGE_KEY, nextState);
            return nextState;
        });
    }, []);

    const toggleHaptics = useCallback(() => {
        setHapticsEnabled((currentState) => {
            const nextState = !currentState;
            persistBooleanPreference(HAPTIC_STORAGE_KEY, nextState);
            return nextState;
        });
    }, []);

    const handleBugHit = useCallback(
        (bugId) => {
            if (phase !== "running") {
                return;
            }

            const targetBug = bugs.find((bug) => bug.id === bugId && !bug.squashed);
            if (!targetBug) {
                return;
            }

            setBugs((currentBugs) =>
                currentBugs.map((bug) =>
                    bug.id === bugId ? { ...bug, squashed: true } : bug
                )
            );

            const now = Date.now();
            const withinComboWindow = now - lastHitAtRef.current <= COMBO_WINDOW_MS;
            lastHitAtRef.current = now;

            const nextCombo = withinComboWindow ? comboRef.current + 1 : 1;
            comboRef.current = nextCombo;
            setCombo(nextCombo);

            const multiplier = 1 + Math.min(1.5, (nextCombo - 1) * 0.18);
            const gainedScore = Math.round(targetBug.points * multiplier);
            scoreRef.current += gainedScore;

            setScore((currentScore) => currentScore + gainedScore);
            setHits((currentHits) => currentHits + 1);
            playHitFeedback(targetBug.variantId, nextCombo);

            if (targetBug.bonusTime > 0) {
                setTimeLeft((currentTime) =>
                    Math.min(MAX_TIME_CAP, Number((currentTime + targetBug.bonusTime).toFixed(2)))
                );
                setFlashMessage(`+${targetBug.bonusTime.toFixed(1)}s bonus bug`);
            } else if (nextCombo > 1) {
                setFlashMessage(`Combo x${nextCombo}`);
            }
        },
        [bugs, phase, playHitFeedback]
    );

    const handleArenaMiss = useCallback(
        (event) => {
            if (event.target !== event.currentTarget || phase !== "running") {
                return;
            }
            if (!isPrimaryPointerEvent(event)) {
                return;
            }

            comboRef.current = 0;
            setCombo(0);
            setMisses((currentMisses) => currentMisses + 1);
            setFlashMessage(`Miss! -${MISS_TIME_PENALTY.toFixed(1)}s`);
            playMissFeedback();

            if (shakeTimeoutRef.current) {
                window.clearTimeout(shakeTimeoutRef.current);
            }
            setIsArenaShaking(true);
            shakeTimeoutRef.current = window.setTimeout(() => {
                setIsArenaShaking(false);
                shakeTimeoutRef.current = 0;
            }, 200);

            setTimeLeft((currentTime) => {
                const nextTime = Math.max(
                    0,
                    Number((currentTime - MISS_TIME_PENALTY).toFixed(2))
                );
                if (nextTime <= 0) {
                    endGame(scoreRef.current);
                }
                return nextTime;
            });
        },
        [endGame, phase, playMissFeedback]
    );

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if ((event.key === "Enter" || event.key === " ") && phase !== "running") {
                event.preventDefault();
                startGame();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, phase, startGame]);

    useEffect(() => {
        if (phase !== "running") {
            return undefined;
        }

        const timerId = window.setInterval(() => {
            setTimeLeft((currentTime) => {
                const nextTime = Math.max(
                    0,
                    Number((currentTime - TICK_RATE_MS / 1000).toFixed(2))
                );
                if (nextTime <= 0) {
                    endGame(scoreRef.current);
                }
                return nextTime;
            });
        }, TICK_RATE_MS);

        return () => window.clearInterval(timerId);
    }, [endGame, phase]);

    useEffect(() => {
        if (phase !== "running") {
            return undefined;
        }

        const movementId = window.setInterval(() => {
            setBugs((currentBugs) =>
                currentBugs.map((bug) => {
                    if (bug.squashed) {
                        return bug;
                    }

                    let nextX = bug.x + bug.vx;
                    let nextY = bug.y + bug.vy;
                    let nextVx = bug.vx;
                    let nextVy = bug.vy;

                    if (nextX <= 5 || nextX >= 95) {
                        nextVx = -nextVx;
                        nextX = clamp(nextX, 5, 95);
                    }
                    if (nextY <= 8 || nextY >= 92) {
                        nextVy = -nextVy;
                        nextY = clamp(nextY, 8, 92);
                    }

                    return {
                        ...bug,
                        x: nextX,
                        y: nextY,
                        vx: nextVx,
                        vy: nextVy,
                    };
                })
            );
        }, TICK_RATE_MS);

        return () => window.clearInterval(movementId);
    }, [phase]);

    useEffect(() => {
        if (phase !== "running") {
            waveSpawnQueuedRef.current = false;
            return undefined;
        }

        if (activeBugs.length > 3 || waveSpawnQueuedRef.current) {
            return undefined;
        }

        waveSpawnQueuedRef.current = true;

        const spawnTimeoutId = window.setTimeout(() => {
            waveSpawnQueuedRef.current = false;
            const nextWave = waveRef.current + 1;
            waveRef.current = nextWave;
            setWave(nextWave);
            setFlashMessage(`Wave ${nextWave}`);
            playWaveFeedback();

            const extraBugs = mobileLikeMode
                ? 3 + Math.min(2, Math.floor(nextWave / 2))
                : 4 + Math.min(3, Math.floor(nextWave / 2));
            setBugs((currentBugs) => [
                ...currentBugs,
                ...spawnBugs(extraBugs, nextWave, mobileLikeMode),
            ]);
        }, 75);

        return () => window.clearTimeout(spawnTimeoutId);
    }, [activeBugs.length, mobileLikeMode, phase, playWaveFeedback]);

    useEffect(() => {
        if (phase !== "running" || combo === 0) {
            return undefined;
        }

        const comboTimeoutId = window.setTimeout(() => {
            const idleDuration = Date.now() - lastHitAtRef.current;
            if (idleDuration >= COMBO_WINDOW_MS) {
                comboRef.current = 0;
                setCombo(0);
            }
        }, COMBO_WINDOW_MS + 50);

        return () => window.clearTimeout(comboTimeoutId);
    }, [combo, phase, timeLeft]);

    useEffect(() => {
        bestScoreRef.current = bestScore;
    }, [bestScore]);

    useEffect(() => {
        if (!flashMessage) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setFlashMessage("");
        }, 900);

        return () => window.clearTimeout(timeoutId);
    }, [flashMessage]);

    useEffect(
        () => () => {
            if (shakeTimeoutRef.current) {
                window.clearTimeout(shakeTimeoutRef.current);
            }
        },
        []
    );

    const hapticsAvailable = supportsHaptics();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={motionEnabled ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    exit={motionEnabled ? { opacity: 0 } : undefined}
                    transition={{ duration: motionEnabled ? 0.18 : 0 }}
                    className="fixed inset-0 z-[100] bg-black/75 px-0 py-0 sm:px-4 sm:py-6 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={motionEnabled ? { opacity: 0, y: 18 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={motionEnabled ? { opacity: 0, y: 12 } : undefined}
                        transition={{ duration: motionEnabled ? 0.24 : 0, ease: "easeOut" }}
                        className="mx-auto flex h-full w-full max-w-5xl flex-col rounded-none border border-white/10 bg-[#04070d]/95 p-3 shadow-[0_30px_90px_rgba(2,6,23,0.75)] sm:rounded-3xl sm:p-5"
                        style={{
                            paddingTop: "max(0.75rem, env(safe-area-inset-top))",
                            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-400">
                                    Mini Challenge
                                </p>
                                <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">
                                    Bug Smasher Arena
                                </h3>
                                <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
                                    Smash moving bugs, chain combos, and survive escalating waves.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="min-h-[44px] rounded-lg border border-white/20 px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-white/10"
                            >
                                Close
                            </button>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: motionEnabled ? 0.12 : 0 }}
                            />
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-sm sm:grid-cols-6 sm:gap-3">
                            <StatPill label="Time" value={`${timeLeft.toFixed(1)}s`} />
                            <StatPill label="Score" value={score} highlight />
                            <StatPill label="Combo" value={`x${combo}`} />
                            <StatPill label="Wave" value={wave} />
                            <StatPill label="Accuracy" value={`${accuracy}%`} />
                            <StatPill label="Best" value={bestScore} icon={<FaTrophy />} />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                                onClick={toggleSound}
                                className="min-h-[38px] rounded-lg border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-white/10"
                            >
                                {soundEnabled ? <FaVolumeUp className="mr-1 inline-block" /> : <FaVolumeMute className="mr-1 inline-block" />}
                                {soundEnabled ? "Sound On" : "Sound Off"}
                            </button>
                            {hapticsAvailable && (
                                <button
                                    onClick={toggleHaptics}
                                    className="min-h-[38px] rounded-lg border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-white/10"
                                >
                                    <FaMobileAlt className="mr-1 inline-block" />
                                    {hapticsEnabled ? "Haptics On" : "Haptics Off"}
                                </button>
                            )}
                        </div>

                        <motion.div
                            className="relative mt-3 flex min-h-[360px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#02050c] sm:min-h-[430px]"
                            animate={isArenaShaking ? { x: [0, -8, 7, -5, 0] } : { x: 0 }}
                            transition={{ duration: 0.22 }}
                            onPointerDown={handleArenaMiss}
                            style={{ touchAction: "manipulation", cursor: "crosshair" }}
                        >
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1e293b_0%,#020617_62%)]" />
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(236,72,153,0.14),transparent_42%)]" />
                            <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:34px_34px]" />

                            {phase === "idle" && (
                                <div className="relative z-10 m-auto max-w-xl px-4 text-center sm:px-6">
                                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">
                                        Ready to play?
                                    </p>
                                    <h4 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                                        Hunt Every Last Bug
                                    </h4>
                                    <p className="mt-3 text-xs text-zinc-300 sm:text-sm">
                                        Hit bugs for points, stack combos for multipliers, and avoid
                                        misses or you lose time. Gold bugs award bonus seconds.
                                    </p>
                                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                        <button
                                            onClick={startGame}
                                            className="min-h-[48px] rounded-full bg-primary px-6 py-3 text-sm font-semibold text-dark transition-colors hover:bg-white"
                                        >
                                            Start Smashing
                                        </button>
                                        <div className="rounded-full border border-white/20 px-4 py-2 text-xs text-zinc-300">
                                            <FaCrosshairs className="mr-2 inline-block" />
                                            Tap bugs, avoid misses
                                        </div>
                                    </div>
                                </div>
                            )}

                            {phase === "running" && (
                                <>
                                    {bugs.map((bug) => {
                                        const variant = BUG_VARIANTS[bug.variantId];
                                        const bugSize = mobileLikeMode
                                            ? Math.max(bug.size, 44)
                                            : bug.size;

                                        return (
                                            <motion.button
                                                key={bug.id}
                                                onPointerDown={(event) => {
                                                    if (!isPrimaryPointerEvent(event)) {
                                                        return;
                                                    }
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    handleBugHit(bug.id);
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === " ") {
                                                        event.preventDefault();
                                                        handleBugHit(bug.id);
                                                    }
                                                }}
                                                disabled={bug.squashed}
                                                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-[0.75rem] font-bold uppercase tracking-wider transition ${variant.className} ${bug.squashed ? "pointer-events-none" : ""}`}
                                                style={{
                                                    left: `${bug.x}%`,
                                                    top: `${bug.y}%`,
                                                    width: `${bugSize}px`,
                                                    height: `${bugSize}px`,
                                                    touchAction: "manipulation",
                                                    cursor: "pointer",
                                                }}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={
                                                    bug.squashed
                                                        ? { opacity: 0, scale: 0.2, rotate: 220 }
                                                        : {
                                                              opacity: 1,
                                                              scale: 1,
                                                              rotate:
                                                                  bug.variantId === "glitch"
                                                                      ? [0, 14, -8, 8, 0]
                                                                      : 0,
                                                          }
                                                }
                                                transition={
                                                    bug.squashed
                                                        ? { duration: 0.16 }
                                                        : {
                                                              duration:
                                                                  bug.variantId === "glitch"
                                                                      ? 0.45
                                                                      : 0.2,
                                                              repeat:
                                                                  bug.variantId === "glitch"
                                                                      ? Infinity
                                                                      : 0,
                                                          }
                                                }
                                                whileHover={{ scale: 1.16 }}
                                                whileTap={{ scale: 0.9 }}
                                                aria-label={`Smash ${bug.variantName} bug`}
                                                title={`${bug.variantName}: ${bug.points} pts`}
                                            >
                                                {bug.variantId === "gold" ? <FaBolt /> : <FaBug />}
                                            </motion.button>
                                        );
                                    })}
                                    <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs text-zinc-300 backdrop-blur-sm">
                                        Active Bugs: {activeBugs.length}
                                    </div>
                                </>
                            )}

                            {phase === "finished" && (
                                <div className="relative z-10 m-auto max-w-2xl px-4 text-center sm:px-6">
                                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                                        Final Result
                                    </p>
                                    <h4 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                                        {score} points
                                    </h4>
                                    <p className="mt-2 text-sm text-zinc-300">{resultLabel}</p>

                                    <div className="mt-5 grid grid-cols-2 gap-2 text-sm sm:gap-3 md:grid-cols-4">
                                        <ResultPill label="Hits" value={hits} />
                                        <ResultPill label="Misses" value={misses} />
                                        <ResultPill label="Accuracy" value={`${accuracy}%`} />
                                        <ResultPill label="Waves" value={wave} />
                                    </div>

                                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                        <button
                                            onClick={startGame}
                                            className="min-h-[48px] rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-white"
                                        >
                                            <FaRedo className="mr-2 inline-block" />
                                            Play Again
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="min-h-[48px] rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/10"
                                        >
                                            Back to Site
                                        </button>
                                    </div>
                                </div>
                            )}

                            {flashMessage && (
                                <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                                    {flashMessage}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const StatPill = ({ label, value, icon = null, highlight = false }) => (
    <div
        className={`rounded-xl border px-2 py-1.5 sm:px-3 sm:py-2 ${highlight ? "border-primary/45 bg-primary/10" : "border-white/10 bg-white/[0.03]"}`}
    >
        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 sm:text-[10px]">
            {label}
        </p>
        <p className="mt-1 text-xs font-semibold text-white sm:text-sm">
            {icon ? <span className="mr-1 inline-block">{icon}</span> : null}
            {value}
        </p>
    </div>
);

const ResultPill = ({ label, value }) => (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1.5 sm:px-3 sm:py-2">
        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 sm:text-[10px]">
            {label}
        </p>
        <p className="mt-1 text-xs font-semibold text-white sm:text-sm">{value}</p>
    </div>
);

export default QAChallengeModal;
