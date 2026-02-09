const Toast = ({ message }) => {
    if (!message) {
        return null;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 right-4 z-[110] rounded-lg border border-white/15 bg-zinc-950/95 px-3 py-2 text-xs text-zinc-200 shadow-xl animate-fade-in"
        >
            {message}
        </div>
    );
};

export default Toast;
