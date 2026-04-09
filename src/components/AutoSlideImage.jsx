import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getOptimizedImageUrl } from '../utils/imageUtils';

const AutoSlideImage = ({ product, className = '' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);
    const timerRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Collect all images
    const allImages = useMemo(() => {
        const imgs = [];
        if (product.images && product.images.length > 0) {
            imgs.push(...product.images.filter(Boolean));
        } else if (product.image) {
            imgs.push(product.image);
        }
        return imgs;
    }, [product.images, product.image]);

    const hasMultiple = allImages.length > 1;

    // IntersectionObserver for auto-advance when visible on screen
    useEffect(() => {
        if (!hasMultiple || !containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.5 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [hasMultiple]);

    // Auto-advance timer
    useEffect(() => {
        if (!hasMultiple) return;
        if (isHovering || isVisible) {
            timerRef.current = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % allImages.length);
            }, isHovering ? 1500 : 2500);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isHovering, isVisible, hasMultiple, allImages.length]);

    // Touch swipe
    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
    const onTouchEnd = () => {
        if (!hasMultiple) return;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 40) {
            setCurrentIndex(prev =>
                diff > 0
                    ? (prev + 1) % allImages.length
                    : (prev - 1 + allImages.length) % allImages.length
            );
        }
    };

    return (
        <div
            ref={containerRef}
            className={className}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => { setIsHovering(false); setCurrentIndex(0); }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {allImages.map((img, idx) => (
                <img
                    key={idx}
                    src={getOptimizedImageUrl(img, { width: 400, quality: 80 })}
                    alt={`${product.name} ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{
                        transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 1200ms cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: idx === currentIndex ? 1 : 0,
                        transform: idx === currentIndex ? 'scale(1)' : 'scale(1.06)',
                        zIndex: idx === currentIndex ? 2 : 1,
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ))}

            {/* Dot indicators */}
            {hasMultiple && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                    {allImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); }}
                            className={`rounded-full transition-all duration-300 ${
                                idx === currentIndex
                                    ? 'w-4 h-1.5 bg-white shadow-md'
                                    : 'w-1.5 h-1.5 bg-white/50'
                            }`}
                            aria-label={`Image ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutoSlideImage;
