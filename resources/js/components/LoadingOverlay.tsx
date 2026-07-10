import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function LoadingOverlay() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleFinish = () => setIsLoading(false);

        router.on('start', handleStart);
        router.on('finish', handleFinish);

        return () => {
            router.off('start', handleStart);
            router.off('finish', handleFinish);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
            }}
        >
            <video
                autoPlay
                loop
                muted
                style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'contain',
                }}
            >
                <source src="/images/loader.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
