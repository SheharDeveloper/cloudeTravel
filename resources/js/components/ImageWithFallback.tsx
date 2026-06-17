import React, { useState } from 'react';

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    fallbackSrc?: string;
    style?: React.CSSProperties;
    className?: string;
    [key: string]: any;
}

export default function ImageWithFallback({
    src,
    alt,
    fallbackSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e0e0e0" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="12" fill="%23999" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E',
    style = {},
    className = '',
    ...props
}: ImageWithFallbackProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        if (!imageError) {
            setImageError(true);
            setImageSrc(fallbackSrc);
        }
    };

    return (
        <img
            src={imageSrc}
            alt={alt}
            onError={handleImageError}
            style={style}
            className={className}
            {...props}
        />
    );
}
