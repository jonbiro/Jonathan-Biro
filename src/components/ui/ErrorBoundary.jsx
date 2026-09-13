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
                <div role="alert" className="error-fallback">
                    <div className="error-card">
                        <p className="error-eyebrow">Unexpected application error</p>
                        <h1 ref={this.fallbackHeadingRef} tabIndex={-1} className="error-title">Something went wrong</h1>
                        <p className="error-copy">
                            An unexpected error occurred. Refresh the page to try again, or email Jonathan if the problem continues.
                        </p>
                        <div className="error-actions">
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="error-primary"
                            >
                                Refresh page
                            </button>
                            <a
                                href={`mailto:${SITE_CONFIG.email}`}
                                className="error-secondary"
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
