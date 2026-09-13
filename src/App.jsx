import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaBriefcase,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMagic,
  FaMoon,
  FaRoute,
  FaUser,
} from "react-icons/fa";
import Hero from "./components/Hero";
import SiteHeader from "./components/SiteHeader";
import Work from "./components/Work";
import Approach from "./components/Approach";
import About from "./components/About";
import Contact from "./components/Contact";
import QALab from "./components/QALab";
import Experience from "./components/Experience";

import ErrorBoundary from "./components/ui/ErrorBoundary";

import Toast from "./components/ui/Toast";
import SITE_CONFIG from "./config/site";
import useUiPreferences from "./hooks/useUiPreferences";

const SECTION_IDS = ["top", "work", "approach", "lab", "experience", "about", "contact"];
const loadCommandPalette = () => import("./components/ui/CommandPalette");
const loadChallenge = () => import("./components/ui/QAChallengeModal");
const CommandPalette = lazy(loadCommandPalette);
const QAChallengeModal = lazy(loadChallenge);

const ModalLoadingFallback = ({ label }) => (
  <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 px-4 backdrop-blur-md">
    <div role="status" aria-live="polite" className="rounded-2xl border border-white/10 bg-[#080b10] px-5 py-4 text-sm font-semibold text-zinc-200 shadow-2xl">
      {label}
    </div>
  </div>
);

function App() {
  const { motionEnabled, motionPreference, pointerEffectsEnabled, setMotionPreference } = useUiPreferences();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandPaletteSession, setCommandPaletteSession] = useState(0);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [challengeSession, setChallengeSession] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [activeSection, setActiveSection] = useState("top");
  const initialHashHandledRef = useRef(false);

  const openCommandPalette = useCallback(() => {
    setIsChallengeOpen(false);
    setCommandPaletteSession((currentSession) => currentSession + 1);
    setIsCommandPaletteOpen(true);
  }, []);

  const openChallenge = useCallback(() => {
    setIsCommandPaletteOpen(false);
    setChallengeSession((currentSession) => currentSession + 1);
    setIsChallengeOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);
  const closeChallenge = useCallback(() => setIsChallengeOpen(false), []);

  const scrollToSection = useCallback(
    (sectionId) => {
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) {
        return;
      }

      sectionElement.scrollIntoView({ behavior: motionEnabled ? "smooth" : "auto", block: "start" });
      sectionElement.focus({ preventScroll: true });
      setActiveSection(sectionId);
      window.history.replaceState(null, "", `#${sectionId}`);
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
        id: "lab",
        label: "Try the QA Lab",
        description: "Reproduce and diagnose a scheduling defect.",
        icon: <FaMagic />,
        keywords: ["investigation", "exercise", "timezone", "lab"],
        onSelect: () => scrollToSection("lab"),
      },
      {
        id: "experience",
        label: "View Experience and Project Résumé",
        description: "Explore independent work and download a project summary.",
        icon: <FaBriefcase />,
        keywords: ["resume", "cv", "experience"],
        onSelect: () => scrollToSection("experience"),
      },
      {
        id: "work",
        label: "Jump to Selected Work",
        description: "See public projects and quality engineering details.",
        icon: <FaBriefcase />,
        keywords: ["section", "projects", "portfolio", "work"],
        onSelect: () => scrollToSection("work"),
      },
      {
        id: "approach",
        label: "Jump to Approach",
        description: "See how Jonathan thinks about reliable automation.",
        icon: <FaRoute />,
        keywords: ["section", "process", "method", "testing"],
        onSelect: () => scrollToSection("approach"),
      },
      {
        id: "about",
        label: "Jump to About",
        description: "Scroll to the About section.",
        icon: <FaUser />,
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
        id: "toggle-motion",
        label: motionEnabled ? "Disable Motion Effects" : "Enable Motion Effects",
        description: "Override motion preference for this device.",
        icon: <FaMoon />,
        keywords: ["animation", "motion", "performance"],
        onSelect: toggleMotionPreference,
      },
      {
        id: "open-challenge",
        label: "Launch Squash the Bugs Game",
        description: "Play a 25-second bug hunt mini-game.",
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
    if (initialHashHandledRef.current) {
      return undefined;
    }
    const initialSectionId = window.location.hash.slice(1);
    if (!SECTION_IDS.includes(initialSectionId)) {
      return undefined;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      initialHashHandledRef.current = true;
      scrollToSection(initialSectionId);
    });
    return () => window.cancelAnimationFrame(focusFrame);
  }, [scrollToSection]);

  useEffect(() => {
    if (typeof window.IntersectionObserver !== "function") {
      return undefined;
    }

    const sections = SECTION_IDS.map((sectionId) => document.getElementById(sectionId)).filter(Boolean);
    const observer = new window.IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              Math.abs(firstEntry.boundingClientRect.top) - Math.abs(secondEntry.boundingClientRect.top)
          )[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-25% 0px -65%", threshold: [0, 0.1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTypingInField =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT");

      if (isChallengeOpen) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        } else {
          openCommandPalette();
        }
        return;
      }

      if (!isTypingInField && !isCommandPaletteOpen && event.key === "/") {
        event.preventDefault();
        openCommandPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChallengeOpen, isCommandPaletteOpen, openCommandPalette]);

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "on" : "off";
    return () => delete document.documentElement.dataset.motion;
  }, [motionEnabled]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    if (!isCommandPaletteOpen && !isChallengeOpen) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [isCommandPaletteOpen, isChallengeOpen]);

  const hasOpenModal = isCommandPaletteOpen || isChallengeOpen;

  return (
    <ErrorBoundary>
      <div inert={hasOpenModal ? true : undefined}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <SiteHeader
          activeSection={activeSection}
          onOpenCommandPalette={openCommandPalette}
          onLaunchChallenge={openChallenge}
          onNavigate={scrollToSection}
          onPrepareCommandPalette={loadCommandPalette}
          onPrepareChallenge={loadChallenge}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="relative min-h-screen w-full overflow-x-hidden bg-dark text-white selection:bg-primary selection:text-dark"
        >
          <Hero
            motionEnabled={motionEnabled}
            pointerEffectsEnabled={pointerEffectsEnabled}
            onNavigate={scrollToSection}
          />
          <Work motionEnabled={motionEnabled} />
          <Approach motionEnabled={motionEnabled} />
          <QALab onLaunchChallenge={openChallenge} />
          <Experience />
          <About motionEnabled={motionEnabled} pointerEffectsEnabled={pointerEffectsEnabled} />
          <Contact
            motionEnabled={motionEnabled}
            onCopyEmail={copyEmail}
            onScrollTop={() => scrollToSection("top")}
          />
        </main>
      </div>

      {hasOpenModal && (
        <Suspense
          fallback={
            <ModalLoadingFallback
              label={isChallengeOpen ? "Loading QA challenge…" : "Loading quick actions…"}
            />
          }
        >
          {isCommandPaletteOpen && (
            <CommandPalette
              key={commandPaletteSession}
              isOpen={isCommandPaletteOpen}
              onClose={closeCommandPalette}
              actions={commandActions}
              motionEnabled={motionEnabled}
            />
          )}
          {isChallengeOpen && (
            <QAChallengeModal
              key={challengeSession}
              isOpen={isChallengeOpen}
              onClose={closeChallenge}
              motionEnabled={motionEnabled}
            />
          )}
        </Suspense>
      )}

      <Toast message={toastMessage} />
    </ErrorBoundary>
  );
}

export default App;
