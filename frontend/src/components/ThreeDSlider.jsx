import React, { useEffect, useCallback, useRef } from 'react';

/**
 * @typedef {{ title: string, num: string, imageUrl: string, data?: any }} SliderItemData
 */

// ─── SliderItem ────────────────────────────────────────────────────────────────
const SliderItem = React.forwardRef(({ item, onClick }, ref) => (
    <div
        ref={ref}
        onClick={onClick}
        className="absolute top-1/2 left-1/2 cursor-pointer select-none rounded-2xl shadow-2xl bg-black overflow-hidden pointer-events-auto"
        style={{
            width: 'clamp(150px, 22vw, 280px)',
            height: 'clamp(200px, 32vw, 400px)',
            marginTop: 'calc(clamp(200px, 32vw, 400px) / -2)',
            marginLeft: 'calc(clamp(150px, 22vw, 280px) / -2)',
            willChange: 'transform',
        }}
    >
        <div className="slider-item-content absolute inset-0 z-10" style={{ willChange: 'opacity' }}>
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent via-50% to-black/60" />
            <div
                className="absolute z-20 text-white top-4 left-5 font-bold leading-none select-none"
                style={{ fontSize: 'clamp(36px, 8vw, 80px)' }}
            >
                {item.num}
            </div>
            <div
                className="absolute z-20 text-white bottom-5 left-5 font-semibold drop-shadow-lg select-none"
                style={{ fontSize: 'clamp(16px, 2.5vw, 28px)' }}
            >
                {item.title}
            </div>
            <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
                decoding="async"
            />
        </div>
    </div>
));
SliderItem.displayName = 'SliderItem';

// ─── ThreeDSlider ──────────────────────────────────────────────────────────────
const ThreeDSlider = ({
    items = [],
    speedWheel = 0.05,
    speedDrag = -0.15,
    containerStyle = {},
    onItemClick,
}) => {
    // The outer sentinel div just occupies the scroll space in the document flow.
    // The panel div is position:fixed, only shown while the sentinel is in the viewport.
    const sentinelRef  = useRef(null);
    const panelRef     = useRef(null);
    const itemRefs     = useRef([]);
    const cacheRef     = useRef({});

    // We cache the sentinel's top/height once after mount (layout is stable by then)
    const sectionTopRef    = useRef(0);
    const sectionHeightRef = useRef(0);

    const progressRef       = useRef(0);
    const targetProgressRef = useRef(0);
    const rafRef            = useRef(null);
    const isVisibleRef      = useRef(false);

    // drag state
    const isDownRef  = useRef(false);
    const startXRef  = useRef(0);

    const numItems = items.length;

    // ── rAF animation loop ──────────────────────────────────────────────────
    const update = useCallback(() => {
        if (!numItems) return;
        progressRef.current += (targetProgressRef.current - progressRef.current) * 0.1;

        const clamped     = Math.max(0, Math.min(progressRef.current, 100));
        const activeFloat = (clamped / 100) * (numItems - 1);
        const denom       = numItems > 1 ? numItems - 1 : 1;

        itemRefs.current.forEach((el, i) => {
            if (!el) return;
            const ratio   = (i - activeFloat) / denom;
            const tx      = ratio * 800;
            const ty      = ratio * 200;
            const rot     = ratio * 120;
            const dist    = Math.abs(i - activeFloat);
            const z       = numItems - dist;
            const opacity = Math.max(0, Math.min(1, (z / numItems) * 3 - 2));

            const newT = `translate3d(${tx}%, ${ty}%, 0) rotate(${rot}deg)`;
            const newZ = Math.round(z * 10).toString();
            const newO = opacity.toFixed(4);

            if (!cacheRef.current[i]) cacheRef.current[i] = { t: '', z: '', o: '' };
            const c = cacheRef.current[i];

            if (c.t !== newT) { el.style.transform = newT; c.t = newT; }
            if (c.z !== newZ) { el.style.zIndex    = newZ; c.z = newZ; }

            const inner = el.querySelector('.slider-item-content');
            if (inner && c.o !== newO) { inner.style.opacity = newO; c.o = newO; }
        });
    }, [numItems]);

    useEffect(() => {
        let active = true;
        const loop = () => { if (active) { update(); rafRef.current = requestAnimationFrame(loop); } };
        rafRef.current = requestAnimationFrame(loop);
        return () => { active = false; cancelAnimationFrame(rafRef.current); };
    }, [update]);

    // ── measure sentinel position once, after layout ────────────────────────
    const measureSentinel = useCallback(() => {
        const el = sentinelRef.current;
        if (!el) return;
        // getBoundingClientRect + scrollY gives absolute document position
        const rect = el.getBoundingClientRect();
        sectionTopRef.current    = rect.top + window.scrollY;
        sectionHeightRef.current = el.offsetHeight;
    }, []);

    // ── scroll handler: purely based on absolute positions ──────────────────
    const handleScroll = useCallback(() => {
        if (!isVisibleRef.current) return;

        const scrollY  = window.scrollY;
        const top      = sectionTopRef.current;
        const height   = sectionHeightRef.current;
        const total    = height - window.innerHeight;  // scrollable distance
        if (total <= 0) return;

        const scrolled = scrollY - top;            // 0 when section reaches top
        const p = Math.max(0, Math.min(100, (scrolled / total) * 100));
        targetProgressRef.current = p;
    }, []);

    // ── IntersectionObserver: show/hide the fixed panel ─────────────────────
    useEffect(() => {
        const sentinel = sentinelRef.current;
        const panel    = panelRef.current;
        if (!sentinel || !panel) return;

        // Measure once on mount
        measureSentinel();
        // Re-measure if window resizes
        window.addEventListener('resize', measureSentinel, { passive: true });

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                panel.style.display = entry.isIntersecting ? 'block' : 'none';
                if (entry.isIntersecting) {
                    // Recalculate position in case layout shifted
                    measureSentinel();
                    handleScroll();
                }
            },
            { threshold: 0 }  // fire as soon as 1px is visible
        );
        observer.observe(sentinel);

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', measureSentinel);
        };
    }, [handleScroll, measureSentinel]);

    // ── wheel (for direct interaction while hovering) ────────────────────────
    const handleWheel = useCallback((e) => {
        const next = targetProgressRef.current + e.deltaY * speedWheel;
        if ((next < 0 && e.deltaY < 0) || (next > 100 && e.deltaY > 0)) return;
        e.preventDefault();
        targetProgressRef.current = Math.max(0, Math.min(100, next));
    }, [speedWheel]);

    // ── drag / touch ────────────────────────────────────────────────────────
    const getX = (e) => e.touches ? e.touches[0]?.clientX : e.clientX;

    const handleDown = useCallback((e) => {
        isDownRef.current = true;
        startXRef.current = getX(e) ?? 0;
    }, []);

    const handleMove = useCallback((e) => {
        if (!isDownRef.current) return;
        const x = getX(e); if (x == null) return;
        const diff = (x - startXRef.current) * speedDrag;
        targetProgressRef.current = Math.max(0, Math.min(100, targetProgressRef.current + diff));
        startXRef.current = x;
    }, [speedDrag]);

    const handleUp = useCallback(() => { isDownRef.current = false; }, []);

    // ── click to jump ────────────────────────────────────────────────────────
    const handleClick = useCallback((item, index) => {
        const denom = numItems > 1 ? numItems - 1 : 1;
        targetProgressRef.current = (index / denom) * 100;
        onItemClick?.(item, index);
    }, [numItems, onItemClick]);

    // ── mount listeners on the fixed panel ──────────────────────────────────
    useEffect(() => {
        const el = panelRef.current;
        if (!el) return;
        el.addEventListener('wheel',      handleWheel, { passive: false });
        el.addEventListener('mousedown',  handleDown);
        el.addEventListener('touchstart', handleDown,  { passive: true });
        window.addEventListener('mousemove',  handleMove);
        window.addEventListener('mouseup',    handleUp);
        window.addEventListener('touchmove',  handleMove, { passive: true });
        window.addEventListener('touchend',   handleUp);
        return () => {
            el.removeEventListener('wheel',      handleWheel);
            el.removeEventListener('mousedown',  handleDown);
            el.removeEventListener('touchstart', handleDown);
            window.removeEventListener('mousemove',  handleMove);
            window.removeEventListener('mouseup',    handleUp);
            window.removeEventListener('touchmove',  handleMove);
            window.removeEventListener('touchend',   handleUp);
        };
    }, [handleWheel, handleDown, handleMove, handleUp]);

    if (!numItems) return null;

    return (
        <>
            {/*
             * SENTINEL: a plain div in the document flow.
             * Its height = the scroll space we want (passed via containerStyle).
             * No overflow, no position:sticky — just a spacer.
             */}
            <div
                ref={sentinelRef}
                className="relative w-full"
                style={{ background: '#000', ...containerStyle }}
            />

            {/*
             * FIXED PANEL: overlays the full viewport while sentinel is visible.
             * Initially hidden (display:none). IntersectionObserver toggles it.
             * z-index:40 keeps it above page content but below any modals.
             */}
            <div
                ref={panelRef}
                className="fixed inset-0 w-full h-screen"
                style={{
                    background: '#000',
                    zIndex: 40,
                    display: 'none',
                    overflow: 'hidden',
                }}
            >
                {/* Card stage */}
                <div
                    className="relative h-full w-full"
                    style={{ transform: 'scale(0.78)', transformOrigin: '50% 50%' }}
                >
                    {items.map((item, i) => (
                        <SliderItem
                            key={i}
                            ref={(el) => { itemRefs.current[i] = el; }}
                            item={item}
                            onClick={() => handleClick(item, i)}
                        />
                    ))}
                </div>

                {/* Left decorative rule */}
                <div
                    className="absolute top-0 left-[72px] w-px h-full pointer-events-none"
                    style={{ background: 'rgba(255,255,255,0.12)' }}
                />

                {/* Vertical label */}
                <div
                    className="absolute bottom-10 left-7 text-white/30 text-[9px] uppercase tracking-widest pointer-events-none select-none"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                    AdventureNexus · Curated Experiences
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-10 right-10 flex flex-col items-center gap-2 text-white/35 pointer-events-none animate-bounce select-none">
                    <span className="text-[10px] uppercase tracking-widest font-light">Scroll</span>
                    <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
                        <rect x="0.75" y="0.75" width="12.5" height="20.5" rx="6.25" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="7" cy="6.5" r="2" fill="currentColor"/>
                    </svg>
                </div>
            </div>
        </>
    );
};

export default ThreeDSlider;
