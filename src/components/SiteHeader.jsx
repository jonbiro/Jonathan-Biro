import { useEffect, useRef, useState } from "react";
import { FaBars, FaBug, FaTerminal, FaTimes } from "react-icons/fa";

const NAV_LINKS = [
    { id: "work", label: "Work", href: "#work" },
    { id: "lab", label: "QA lab", href: "#lab" },
    { id: "experience", label: "Experience", href: "#experience" },
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
        <header className="fixed inset-x-0 top-0 z-[70] border-b border-slate-200 bg-white/95 backdrop-blur-lg">
            <nav
                aria-label="Primary navigation"
                className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3"
            >
                <a
                    href="#top"
                    onClick={(event) => navigateToSection(event, "top")}
                    className="flex min-h-11 items-center text-base font-semibold tracking-tight text-slate-900"
                    aria-label="Jonathan Biro, back to top"
                    aria-current={activeSection === "top" ? "location" : undefined}
                >
                    Jonathan Biro<span className="ml-3 hidden border-l border-slate-200/20 pl-3 text-sm font-normal text-slate-600 xl:inline">Quality engineering</span>
                </a>

                <div className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(event) => navigateToSection(event, link.id)}
                            aria-current={activeSection === link.id ? "location" : undefined}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeSection === link.id ? "bg-primary/10 text-sky-700" : "text-slate-700 hover:bg-sky-50 hover:text-slate-900"}`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={openCommandPalette}
                        onMouseEnter={onPrepareCommandPalette}
                        onFocus={onPrepareCommandPalette}
                        onTouchStart={onPrepareCommandPalette}
                        className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-900"
                        aria-label="Open quick actions"
                        title="Quick actions (Cmd or Ctrl + K)"
                    >
                        <FaTerminal aria-hidden="true" />
                        <span className="sr-only">Quick actions</span>
                    </button>
                    <button
                        type="button"
                        ref={mobileMenuToggleRef}
                        onClick={toggleMobileMenu}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-sky-50 text-slate-800 transition-colors hover:border-slate-200/20 hover:bg-sky-100 hover:text-slate-900 md:hidden"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-navigation"
                        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    >
                        {isMobileMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div id="mobile-navigation" className="mt-2 w-full border-t border-slate-200 pt-2 md:hidden">
                        <div className="grid grid-cols-2 gap-1">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(event) => navigateToSection(event, link.id)}
                                    aria-current={activeSection === link.id ? "location" : undefined}
                                    className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold transition-colors ${activeSection === link.id ? "bg-primary/10 text-sky-700" : "text-slate-800 hover:bg-sky-100 hover:text-slate-900"}`}
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
                            className="mt-1 flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-semibold text-sky-700 transition-colors hover:bg-primary/10"
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
