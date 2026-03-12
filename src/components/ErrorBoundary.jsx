import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service here
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center font-body p-4 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 max-w-md w-full">
                        <div className="w-16 h-16 bg-rose-50 text-rose-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-stone-900 mb-2">Something went wrong.</h1>
                        <p className="text-stone-600 mb-6 text-sm">
                            We're sorry, but an unexpected error occurred while loading this page. Our team has been notified.
                        </p>
                        
                        {import.meta.env.DEV && (
                            <div className="mb-6 p-4 bg-red-50 text-red-900 rounded-lg text-left overflow-x-auto text-xs font-mono">
                                <p className="font-bold mb-2">{this.state.error?.toString()}</p>
                                <pre className="whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
                            </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={this.handleReload}
                                className="flex-1 bg-rose-900 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-rose-800 transition-colors"
                            >
                                Reload Page
                            </button>
                            <a 
                                href="/"
                                className="flex-1 bg-stone-100 text-stone-900 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-stone-200 transition-colors"
                            >
                                Go Home
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
