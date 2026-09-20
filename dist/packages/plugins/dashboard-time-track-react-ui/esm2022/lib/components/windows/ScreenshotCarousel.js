import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
/**
 * A dependency-free stand-in for `<swiper-container slides-per-view="3" space-between="16"
 * slides-per-group="3">`: a horizontally scrolling, scroll-snapping track showing three slides
 * per view with a 16px gap; `slideNext()` / `slidePrev()` scroll by one group (three slides),
 * which is what the prev/next arrows in the Recent Activities header call.
 */
export const ScreenshotCarousel = forwardRef(function ScreenshotCarousel({ children, slidesPerView = 3, className }, ref) {
    const scrollerRef = useRef(null);
    const scrollByGroup = useCallback((direction) => {
        const scroller = scrollerRef.current;
        if (!scroller)
            return;
        // One group = `slidesPerView` slides — measured off the first slide, so a narrow
        // canvas (where fewer, wider slides fit) still advances by whole slides.
        const slide = scroller.querySelector('.gz-rtt-carousel-slide');
        // The gap lives in ONE place — the `--gz-rtt-slide-gap` custom property in styles.ts.
        const gap = parseFloat(getComputedStyle(scroller).getPropertyValue('--gz-rtt-slide-gap')) || 16;
        const distance = slide ? (slide.offsetWidth + gap) * slidesPerView * direction : scroller.clientWidth * direction;
        scroller.scrollBy({ left: distance, behavior: 'smooth' });
    }, [slidesPerView]);
    useImperativeHandle(ref, () => ({
        slideNext: () => scrollByGroup(1),
        slidePrev: () => scrollByGroup(-1)
    }), [scrollByGroup]);
    return (_jsx("div", { ref: scrollerRef, className: `gz-rtt-carousel${className ? ` ${className}` : ''}`, style: { '--gz-rtt-slides': slidesPerView }, "data-slides-per-view": slidesPerView, children: _jsx("div", { className: "gz-rtt-carousel-track", children: children }) }));
});
//# sourceMappingURL=ScreenshotCarousel.js.map