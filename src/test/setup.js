import { afterEach, vi } from "vitest";

afterEach(() => {
    if (typeof window !== "undefined") {
        document.body.replaceChildren();
        window.history.replaceState(null, "", "/");
    }
});

if (typeof window !== "undefined") {
    Element.prototype.scrollIntoView = vi.fn();
}
