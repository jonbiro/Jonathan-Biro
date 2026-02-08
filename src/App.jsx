import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import {
  FaEnvelope,
  FaFileAlt,
  FaGithub,
  FaLinkedin,
  FaMagic,
  FaMoon,
  FaRegClock,
} from "react-icons/fa";
import Hero from "./components/Hero";
import SITE_CONFIG from "./config/site";
import useUiPreferences from "./hooks/useUiPreferences";

const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const CommandPalette = lazy(() => import("./components/ui/CommandPalette"));
const QAChallengeModal = lazy(() => import("./components/ui/QAChallengeModal"));
const CustomCursor = lazy(() => import("./components/ui/CustomCursor"));
const ParticlesBackground = lazy(() => import("./components/ui/ParticlesBackground"));
const ScrollProgress = lazy(() => import("./components/ui/ScrollProgress"));

function App() {
  const { motionEnabled, motionPreference, pointerEffectsEnabled, setMotionPreference } = useUiPreferences();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandPaletteSession, setCommandPaletteSession] = useState(0);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [challengeSession, setChallengeSession] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const showCustomCursor = pointerEffectsEnabled && !isCommandPaletteOpen && !isChallengeOpen;

  const openCommandPalette = useCallback(() => {
    setCommandPaletteSession((currentSession) => currentSession + 1);
    setIsCommandPaletteOpen(true);
  }, []);

  const openChallenge = useCallback(() => {
    setChallengeSession((currentSession) => currentSession + 1);
    setIsChallengeOpen(true);
  }, []);

  const scrollToSection = useCallback(
    (sectionId) => {
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) {
        return;
      }

      sectionElement.scrollIntoView({ behavior: motionEnabled ? "smooth" : "auto", block: "start" });
    },
    [motionEnabled]
  );

  const openExternalLink = useCallback((url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await window.navigator.clipboard.writeText(SITE_CONFIG.email);
      setToastMessage("Email copied to clipboard.");
    } catch {
      setToastMessage("Could not copy email automatically.");
    }
  }, []);

  const toggleMotionPreference = useCallback(() => {
    setMotionPreference(motionEnabled ? "off" : "on");
    setToastMessage(motionEnabled ? "Motion effects disabled." : "Motion effects enabled.");
  }, [motionEnabled, setMotionPreference]);

  const commandActions = useMemo(() => {
    const actions = [
      {
        id: "about",
        label: "Jump to About",
        description: "Scroll to the About section.",
        icon: <FaRegClock />,
        keywords: ["section", "bio", "about"],
        onSelect: () => scrollToSection("about"),
      },
      {
        id: "contact",
        label: "Jump to Contact",
        description: "Scroll directly to contact options.",
        icon: <FaEnvelope />,
        keywords: ["section", "email", "contact"],
        onSelect: () => scrollToSection("contact"),
      },
      {
        id: "copy-email",
        label: "Copy Email",
        description: "Copy Jonathan's email to clipboard.",
        icon: <FaEnvelope />,
        keywords: ["mail", "copy", "clipboard"],
        onSelect: copyEmail,
      },
      {
        id: "open-github",
        label: "Open GitHub",
        description: "Open GitHub profile in a new tab.",
        icon: <FaGithub />,
        keywords: ["source", "repositories", "github"],
        onSelect: () => openExternalLink(SITE_CONFIG.githubUrl),
      },
      {
        id: "open-linkedin",
        label: "Open LinkedIn",
        description: "Open LinkedIn profile in a new tab.",
        icon: <FaLinkedin />,
        keywords: ["linkedin", "network", "profile"],
        onSelect: () => openExternalLink(SITE_CONFIG.linkedinUrl),
      },
      {
        id: "open-resume",
        label: "Open Resume",
        description: "Open resume page in a new tab.",
        icon: <FaFileAlt />,
        keywords: ["resume", "cv"],
        onSelect: () => openExternalLink(SITE_CONFIG.resumeUrl),
      },
      {
        id: "toggle-motion",
        label: motionEnabled ? "Disable Motion Effects" : "Enable Motion Effects",
        description: "Override motion preference for this device.",
        icon: <FaMoon />,
        keywords: ["animation", "motion", "performance"],
        onSelect: toggleMotionPreference,
      },
      {
        id: "open-challenge",
        label: "Launch QA Challenge",
        description: "Play a 20-second bug hunt mini-game.",
        icon: <FaMagic />,
        keywords: ["game", "challenge", "fun", "qa"],
        onSelect: openChallenge,
      },
    ];

    if (motionPreference !== "auto") {
      actions.push({
        id: "reset-motion",
        label: "Use System Motion Preference",
        description: "Clear manual override and follow OS settings.",
        icon: <FaMoon />,
        keywords: ["auto", "system", "motion"],
        onSelect: () => {
          setMotionPreference("auto");
          setToastMessage("Using system motion preference.");
        },
      });
    }

    return actions;
  }, [
    copyEmail,
    motionEnabled,
    motionPreference,
    openExternalLink,
    openChallenge,
    scrollToSection,
    setMotionPreference,
    toggleMotionPreference,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTypingInField =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT");

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        } else {
          openCommandPalette();
        }
        return;
      }

      if (!isTypingInField && event.key === "/") {
        event.preventDefault();
        openCommandPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, openCommandPalette]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  return (
    <main
      className={`bg-dark text-white min-h-screen selection:bg-primary selection:text-white relative ${showCustomCursor ? "cursor-none" : ""}`}
    >
      <Suspense fallback={null}>
        {showCustomCursor && <CustomCursor />}
        {motionEnabled && <ParticlesBackground />}
        {motionEnabled && <ScrollProgress />}
      </Suspense>
      <Hero
        motionEnabled={motionEnabled}
        pointerEffectsEnabled={pointerEffectsEnabled}
        onOpenCommandPalette={openCommandPalette}
        onLaunchChallenge={openChallenge}
      />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary">Loading content...</div>}>
        <About motionEnabled={motionEnabled} pointerEffectsEnabled={pointerEffectsEnabled} />
        <Contact motionEnabled={motionEnabled} />
      </Suspense>



      {(isCommandPaletteOpen || isChallengeOpen) && (
        <Suspense fallback={null}>
          {isCommandPaletteOpen && (
            <CommandPalette
              key={commandPaletteSession}
              isOpen={isCommandPaletteOpen}
              onClose={() => setIsCommandPaletteOpen(false)}
              actions={commandActions}
              motionEnabled={motionEnabled}
            />
          )}
          {isChallengeOpen && (
            <QAChallengeModal
              key={challengeSession}
              isOpen={isChallengeOpen}
              onClose={() => setIsChallengeOpen(false)}
              motionEnabled={motionEnabled}
            />
          )}
        </Suspense>
      )}

      {toastMessage && (
        <div className="fixed bottom-5 right-4 z-[110] rounded-lg border border-white/15 bg-zinc-950/95 px-3 py-2 text-xs text-zinc-200 shadow-xl">
          {toastMessage}
        </div>
      )}
    </main>
  );
}

export default App;
