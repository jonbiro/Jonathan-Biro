import { Component, createRef } from "react";
import SITE_CONFIG from "../../config/site";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
        this.fallbackHeadingRef = createRef();
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidUpdate(previousProps, previousState) {
        if (!previousState.hasError && this.state.hasError) {
            this.fallbackHeadingRef.current?.focus();
        }
    }

    componentDidCatch() {
        this.fallbackHeadingRef.current?.focus();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div role="alert" className="min-h-screen flex items-center justify-center bg-dark text-white px-6">
                    <div className="text-center max-w-md">
                        <h1 ref={this.fallbackHeadingRef} tabIndex={-1} className="text-3xl font-bold mb-4">Something went wrong</h1>
                        <p className="text-gray-400 mb-6">
                            An unexpected error occurred. Refresh the page to try again, or email Jonathan if the problem continues.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 rounded-full bg-primary text-dark font-bold hover:bg-white transition-colors"
                            >
                                Refresh page
                            </button>
                            <a
                                href={`mailto:${SITE_CONFIG.email}`}
                                className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
                            >
                                Email Jonathan
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
