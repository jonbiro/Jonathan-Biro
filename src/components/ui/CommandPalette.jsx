import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

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
                    transition={{ duration: motionEnabled ? 0.2 : 0 }}
                    className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-md px-4 py-12 md:py-20"
                    onClick={onClose}
                >
                    <motion.div
                        initial={motionEnabled ? { y: 16, opacity: 0, scale: 0.98 } : false}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={motionEnabled ? { y: 12, opacity: 0, scale: 0.98 } : undefined}
                        transition={{ duration: motionEnabled ? 0.25 : 0, ease: "easeOut" }}
                        className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/95 shadow-[0_40px_120px_rgba(0,0,0,0.8)] ring-1 ring-white/5"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                            <FaSearch className="text-lg text-zinc-500" />
                            <input
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value);
                                    setSelectedIndex(0);
                                }}
                                autoFocus
                                placeholder="What would you like to do?"
                                className="h-6 flex-1 bg-transparent text-lg text-white placeholder:text-zinc-500 focus:outline-none"
                            />
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {filteredActions.length ? (
                                <div className="space-y-1">
                                    {filteredActions.map((action, index) => {
                                        const isSelected = index === Math.min(selectedIndex, filteredActions.length - 1);
                                        return (
                                            <button
                                                key={action.id}
                                                onClick={() => {
                                                    action.onSelect();
                                                    onClose();
                                                }}
                                                className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-200 ${isSelected
                                                        ? "bg-white/[0.08] shadow-sm"
                                                        : "hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200"
                                                    }`}
                                            >
                                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${isSelected ? "border-primary/30 bg-primary/10 text-primary" : "border-white/10 bg-white/5 text-zinc-500"
                                                    }`}>
                                                    {action.icon}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <span className={`block text-sm font-medium transition-colors ${isSelected ? "text-white" : "text-zinc-300"}`}>
                                                        {action.label}
                                                    </span>
                                                    <span className="block truncate text-xs text-zinc-500">
                                                        {action.description}
                                                    </span>
                                                </div>
                                                {action.shortcut && (
                                                    <span className="shrink-0 rounded bg-white/10 px-2 py-1 text-[10px] font-medium text-zinc-400">
                                                        {action.shortcut}
                                                    </span>
                                                )}
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="activeCommand"
                                                        className="absolute left-0 h-8 w-1 h-full rounded-r bg-primary opacity-80"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.8 }}
                                                        transition={{ duration: 0.15 }}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-3 rounded-full bg-white/5 p-4 text-zinc-500">
                                        <FaSearch className="text-xl" />
                                    </div>
                                    <p className="text-sm text-zinc-400">
                                        No results found for "<span className="text-white">{query}</span>"
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white/[0.02] border-t border-white/5 px-5 py-3 text-[11px] text-zinc-500 flex justify-between items-center">
                            <span>
                                <kbd className="font-sans bg-white/10 rounded px-1.5 py-0.5 text-zinc-300 mr-1">↑</kbd>
                                <kbd className="font-sans bg-white/10 rounded px-1.5 py-0.5 text-zinc-300 mr-1">↓</kbd>
                                to navigate
                            </span>
                            <span>
                                <kbd className="font-sans bg-white/10 rounded px-1.5 py-0.5 text-zinc-300 mr-1">↵</kbd>
                                to select
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
