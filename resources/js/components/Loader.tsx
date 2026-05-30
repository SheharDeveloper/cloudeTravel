export default function Loader() {
    return (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
            <div className="text-center">
                {/* Spinner */}
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>

                {/* Loading Text */}
                <h5 className="text-primary fw-semibold mb-2">Loading</h5>
                <p className="text-muted small">Please wait while we prepare your data...</p>

                {/* Animated Dots */}
                <style>
                    {`
                        @keyframes dots {
                            0%, 20% { content: ''; }
                            40% { content: '.'; }
                            60% { content: '..'; }
                            80%, 100% { content: '...'; }
                        }

                        .loading-dots::after {
                            content: '';
                            animation: dots 1.5s infinite;
                        }
                    `}
                </style>
                <p className="text-muted small">
                    <span className="loading-dots"></span>
                </p>
            </div>
        </div>
    );
}
