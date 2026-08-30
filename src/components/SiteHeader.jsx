import { useEffect, useRef, useState } from "react";
import { FaBars, FaBug, FaTerminal, FaTimes } from "react-icons/fa";

const NAV_LINKS = [
    { id: "work", label: "Work", href: "#work" },
    { id: "approach", label: "Approach", href: "#approach" },
    { id: "about", label: "About", href: "#about" },
    { id: "contact", label: "Contact", href: "#contact" },
];

const shouldInterceptInPageNavigation = (event) =>
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey;

const SiteHeader = ({
    activeSection = "top",
    onOpenCommandPalette,
    onLaunchChallenge,
    onNavigate,
    onPrepareCommandPalette,
    onPrepareChallenge,
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuToggleRef = useRef(null);

    useEffect(() => {
        if (!isMobileMenuOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsMobileMenuOpen(false);
                mobileMenuToggleRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleViewportChange = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        handleViewportChange();
        window.addEventListener("resize", handleViewportChange);
        return () => window.removeEventListener("resize", handleViewportChange);
    }, []);

    const closeMobileMenu = ({ restoreFocus = false } = {}) => {
        setIsMobileMenuOpen(false);

        if (restoreFocus) {
            mobileMenuToggleRef.current?.focus();
        }
    };

    const openCommandPalette = () => {
        closeMobileMenu();
        onOpenCommandPalette();
    };

    const launchChallenge = () => {
        if (isMobileMenuOpen) {
            mobileMenuToggleRef.current?.focus();
        }
        closeMobileMenu();
        onLaunchChallenge();
    };

    const navigateToSection = (event, sectionId) => {
        closeMobileMenu();
        if (onNavigate && shouldInterceptInPageNavigation(event)) {
            event.preventDefault();
            onNavigate(sectionId);
        }
    };

    const toggleMobileMenu = () => {
        if (isMobileMenuOpen) {
            closeMobileMenu({ restoreFocus: true });
            return;
        }

        setIsMobileMenuOpen(true);
    };

    return (
        <header className="fixed inset-x-0 top-0 z-[70] px-3 pt-3 sm:px-5 sm:pt-4">
            <nav
                aria-label="Primary navigation"
                className="mx-auto flex max-w-6xl flex-wrap items-center justify-between rounded-2xl border border-white/10 bg-[#07090d]/90 px-3 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-4"
            >
                <a
                    href="#top"
                    onClick={(event) => navigateToSection(event, "top")}
                    className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl text-sm font-black tracking-tight transition-all hover:scale-105 ${activeSection === "top" ? "bg-primary text-dark shadow-lg shadow-primary/20" : "bg-white text-dark"}`}
                    aria-label="Jonathan Biro, back to top"
                    aria-current={activeSection === "top" ? "location" : undefined}
                >
                    JB
                </a>

                <div className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(event) => navigateToSection(event, link.id)}
                            aria-current={activeSection === link.id ? "location" : undefined}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeSection === link.id ? "bg-primary/10 text-primary" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={launchChallenge}
                        onMouseEnter={onPrepareChallenge}
                        onFocus={onPrepareChallenge}
                        onTouchStart={onPrepareChallenge}
                        className="hidden min-h-11 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm font-medium text-zinc-300 transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary sm:inline-flex"
                        aria-label="Launch QA challenge"
                    >
                        <FaBug aria-hidden="true" />
                        <span className="hidden lg:inline">QA challenge</span>
                    </button>
                    <button
                        type="button"
                        onClick={openCommandPalette}
                        onMouseEnter={onPrepareCommandPalette}
                        onFocus={onPrepareCommandPalette}
                        onTouchStart={onPrepareCommandPalette}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                        aria-label="Open quick actions"
                        title="Quick actions (Cmd or Ctrl + K)"
                    >
                        <FaTerminal aria-hidden="true" />
                        <span className="hidden sm:inline">Quick actions</span>
                        <kbd className="hidden rounded border border-white/10 bg-black/20 px-1.5 py-0.5 font-sans text-[10px] text-zinc-400 lg:inline">
                            Ctrl/⌘ K
                        </kbd>
                    </button>
                    <button
                        type="button"
                        ref={mobileMenuToggleRef}
                        onClick={toggleMobileMenu}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white md:hidden"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-navigation"
                        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    >
                        {isMobileMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div id="mobile-navigation" className="mt-2 w-full border-t border-white/10 pt-2 md:hidden">
                        <div className="grid grid-cols-2 gap-1">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(event) => navigateToSection(event, link.id)}
                                    aria-current={activeSection === link.id ? "location" : undefined}
                                    className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold transition-colors ${activeSection === link.id ? "bg-primary/10 text-primary" : "text-zinc-200 hover:bg-white/10 hover:text-white"}`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={launchChallenge}
                            onMouseEnter={onPrepareChallenge}
                            onFocus={onPrepareChallenge}
                            onTouchStart={onPrepareChallenge}
                            className="mt-1 flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                            aria-label="Launch QA challenge"
                        >
                            <FaBug aria-hidden="true" /> Try the QA challenge
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default SiteHeader;
