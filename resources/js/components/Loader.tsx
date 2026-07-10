export default function Loader() {
    return (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
            <div className="text-center">
                {/* Video Loader */}
                <video
                    autoPlay
                    loop
                    muted
                    style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'contain',
                        marginBottom: '20px',
                    }}
                >
                    <source src="/images/loader.mp4" type="video/mp4" />
                </video>

                {/* Loading Text */}
                <h5 className="text-primary fw-semibold mb-2">Loading</h5>
                <p className="text-muted small">Please wait while we prepare your data...</p>
            </div>
        </div>
    );
}
