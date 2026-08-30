import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";
import useDialogFocus from "../../hooks/useDialogFocus";

const CommandPalette = ({ isOpen, onClose, actions, motionEnabled = true }) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dialogRef = useRef(null);
    const inputRef = useRef(null);

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

    const safeSelectedIndex = filteredActions.length
        ? Math.min(selectedIndex, filteredActions.length - 1)
        : 0;
    const activeOptionId = filteredActions.length
        ? `command-option-${filteredActions[safeSelectedIndex].id}`
        : undefined;
    useDialogFocus({ isOpen, dialogRef, onClose, initialFocusRef: inputRef });

    const handleInputKeyDown = (event) => {
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
            const selectedAction = filteredActions[safeSelectedIndex];
            if (selectedAction) {
                event.preventDefault();
                selectedAction.onSelect();
                onClose();
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={motionEnabled ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    exit={motionEnabled ? { opacity: 0 } : undefined}
                    transition={{ duration: motionEnabled ? 0.2 : 0 }}
                    className="fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-black/75 px-4 py-4 backdrop-blur-md sm:py-8 md:py-20"
                    onClick={onClose}
                >
                    <motion.div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="command-palette-title"
                        tabIndex={-1}
                        initial={motionEnabled ? { y: 16, opacity: 0, scale: 0.98 } : false}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={motionEnabled ? { y: 12, opacity: 0, scale: 0.98 } : undefined}
                        transition={{ duration: motionEnabled ? 0.25 : 0, ease: "easeOut" }}
                        className="mx-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/95 shadow-[0_40px_120px_rgba(0,0,0,0.8)] ring-1 ring-white/5 sm:max-h-[calc(100dvh-4rem)] md:max-h-[calc(100dvh-10rem)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 id="command-palette-title" className="sr-only">Quick actions</h2>
                        <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-5 py-4">
                            <FaSearch className="text-lg text-zinc-500" aria-hidden="true" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value);
                                    setSelectedIndex(0);
                                }}
                                placeholder="What would you like to do?"
                                role="combobox"
                                aria-label="Search quick actions"
                                aria-autocomplete="list"
                                aria-expanded={isOpen}
                                aria-controls="command-palette-results"
                                aria-activedescendant={activeOptionId}
                                aria-describedby="command-palette-help"
                                autoComplete="off"
                                onKeyDown={handleInputKeyDown}
                                className="h-10 min-w-0 flex-1 rounded-md bg-transparent px-1 text-base text-white placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] sm:text-lg"
                            />
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                                aria-label="Close quick actions"
                            >
                                <FaTimes aria-hidden="true" />
                            </button>
                        </div>

                        <p className="sr-only" aria-live="polite">
                            {filteredActions.length
                                ? `${filteredActions.length} quick ${filteredActions.length === 1 ? "action" : "actions"}. Selected ${filteredActions[safeSelectedIndex].label}.`
                                : "No quick actions found."}
                        </p>
                        <div id="command-palette-results" role="listbox" aria-label="Quick actions" className="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {filteredActions.length ? (
                                <div className="space-y-1">
                                    {filteredActions.map((action, index) => {
                                        const isSelected = index === safeSelectedIndex;
                                        return (
                                            <button
                                                key={action.id}
                                                id={`command-option-${action.id}`}
                                                type="button"
                                                role="option"
                                                aria-selected={isSelected}
                                                tabIndex={-1}
                                                onClick={() => {
                                                    action.onSelect();
                                                    onClose();
                                                }}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                className={`relative flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-200 ${isSelected
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
                                                    <span className="block truncate text-xs text-zinc-400">
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
                                                        className="absolute inset-y-2 left-0 w-1 rounded-r bg-primary opacity-80"
                                                        aria-hidden="true"
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

                        <div id="command-palette-help" className="flex shrink-0 items-center justify-between border-t border-white/5 bg-white/[0.02] px-5 py-3 text-[11px] text-zinc-400">
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
