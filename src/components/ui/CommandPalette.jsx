import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CommandPalette = ({ isOpen, onClose, actions, motionEnabled = true }) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredActions = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return actions;
        }

        return actions.filter((action) => {
            const searchableText = [
                action.label,
                action.description,
                ...(action.keywords || []),
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedQuery);
        });
    }, [actions, query]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelectedIndex((currentIndex) =>
                    filteredActions.length ? (currentIndex + 1) % filteredActions.length : 0
                );
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelectedIndex((currentIndex) =>
                    filteredActions.length
                        ? (currentIndex - 1 + filteredActions.length) % filteredActions.length
                        : 0
                );
                return;
            }

            if (event.key === "Enter") {
                const safeIndex = filteredActions.length
                    ? Math.min(selectedIndex, filteredActions.length - 1)
                    : 0;
                const selectedAction = filteredActions[safeIndex];
                if (selectedAction) {
                    event.preventDefault();
                    selectedAction.onSelect();
                    onClose();
                }
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [filteredActions, isOpen, onClose, selectedIndex]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={motionEnabled ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    exit={motionEnabled ? { opacity: 0 } : undefined}
                    transition={{ duration: motionEnabled ? 0.15 : 0 }}
                    className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm px-4 py-10"
                    onClick={onClose}
                >
                    <motion.div
                        initial={motionEnabled ? { y: -12, opacity: 0 } : false}
                        animate={{ y: 0, opacity: 1 }}
                        exit={motionEnabled ? { y: -8, opacity: 0 } : undefined}
                        transition={{ duration: motionEnabled ? 0.2 : 0, ease: "easeOut" }}
                        className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950/95 shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-white/10 px-4 py-3">
                            <input
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value);
                                    setSelectedIndex(0);
                                }}
                                autoFocus
                                placeholder="Search actions..."
                                className="w-full bg-transparent text-base text-white placeholder:text-zinc-500 outline-none"
                            />
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {filteredActions.length ? (
                                filteredActions.map((action, index) => (
                                    <button
                                        key={action.id}
                                        onClick={() => {
                                            action.onSelect();
                                            onClose();
                                        }}
                                        className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${index === Math.min(selectedIndex, filteredActions.length - 1) ? "bg-white/10" : "hover:bg-white/5"}`}
                                    >
                                        <span className="mt-0.5 text-sm text-primary">{action.icon}</span>
                                        <span className="flex-1">
                                            <span className="block text-sm font-semibold text-white">{action.label}</span>
                                            <span className="block text-xs text-zinc-400">{action.description}</span>
                                        </span>
                                        {action.shortcut && (
                                            <span className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] text-zinc-300">
                                                {action.shortcut}
                                            </span>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-6 text-sm text-zinc-400">
                                    No actions match your search.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
