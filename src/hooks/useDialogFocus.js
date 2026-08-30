import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
].join(",");

const getFocusableElements = (dialogElement) =>
    Array.from(dialogElement.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (element) =>
            element.tabIndex >= 0 &&
            !element.hasAttribute("hidden") &&
            element.getAttribute("aria-hidden") !== "true"
    );

const useDialogFocus = ({ isOpen, dialogRef, onClose, initialFocusRef }) => {
    const returnFocusRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !dialogRef.current) {
            return undefined;
        }

        const dialogElement = dialogRef.current;
        returnFocusRef.current = document.activeElement;

        const focusFrame = window.requestAnimationFrame(() => {
            const focusTarget = initialFocusRef?.current || getFocusableElements(dialogElement)[0] || dialogElement;
            focusTarget.focus();
        });

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                onClose();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusableElements = getFocusableElements(dialogElement);
            if (!focusableElements.length) {
                event.preventDefault();
                dialogElement.focus();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        dialogElement.addEventListener("keydown", handleKeyDown);

        return () => {
            window.cancelAnimationFrame(focusFrame);
            dialogElement.removeEventListener("keydown", handleKeyDown);
            if (returnFocusRef.current instanceof HTMLElement) {
                returnFocusRef.current.focus();
            }
        };
    }, [dialogRef, initialFocusRef, isOpen, onClose]);
};

export default useDialogFocus;
