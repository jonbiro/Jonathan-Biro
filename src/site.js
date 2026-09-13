const EMAIL = "jonathan@biro.dev";

const isPlainPrimaryClick = (event) => (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
);

export const initializePortfolio = ({
    document: page = document,
    window: view = window,
    navigator: browserNavigator = navigator,
} = {}) => {
    const removers = [];
    const listen = (element, eventName, handler) => {
        element.addEventListener(eventName, handler);
        removers.push(() => element.removeEventListener(eventName, handler));
    };

    for (const link of page.querySelectorAll("[data-section-link]")) {
        listen(link, "click", (event) => {
            if (!isPlainPrimaryClick(event)) return;
            const section = page.getElementById(link.dataset.sectionLink);
            if (!section) return;
            event.preventDefault();
            section.scrollIntoView({ block: "start", behavior: "auto" });
            section.focus({ preventScroll: true });
            view.history.replaceState(null, "", `#${section.id}`);
        });
    }

    const copyButton = page.querySelector("[data-copy-email]");
    const copyStatus = page.querySelector("[data-copy-status]");
    if (copyButton && copyStatus) {
        copyButton.hidden = false;
        listen(copyButton, "click", async () => {
            try {
                await browserNavigator.clipboard.writeText(EMAIL);
                copyStatus.textContent = "Email copied.";
            } catch {
                copyStatus.textContent = "Copy unavailable. Use the email link or select the address below.";
            }
        });
    }

    const year = String(new Date().getFullYear());
    for (const yearElement of page.querySelectorAll("[data-current-year]")) {
        yearElement.textContent = year;
    }

    return () => removers.forEach((remove) => remove());
};
