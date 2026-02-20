import { Component, lazy, ReactNode, Suspense, useEffect, useRef, useState } from 'react';

// ─── Lazy-load the Spline React component ─────────────────────────────────────
const Spline = lazy(() => import('@splinetool/react-spline'));

// ─── Scene URL (AiData Model Interaction community file) ───────────────────────
const SCENE_URL =
    'https://prod.spline.design/3e113b41-28ce-49be-99f4-7410c591f750/scene.splinecode';

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  Error Boundary — catches any WebGL / Spline crash so the page stays alive  ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
interface EBState { hasError: boolean }
class SplineErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, EBState> {
    state: EBState = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        return this.state.hasError ? this.props.fallback : this.props.children;
    }
}

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  Canvas Fallback — shows when Spline fails to load                          ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
function CanvasFallback() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const frameRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resize();
        window.addEventListener('resize', resize);

        const onMouseMove = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
        };
        canvas.addEventListener('mousemove', onMouseMove);

        const COLORS = ['#22d3ee', '#a78bfa', '#fb923c', '#34d399', '#f472b6'];
        const rC = () => COLORS[Math.floor(Math.random() * COLORS.length)];

        const particles = Array.from({ length: 100 }, () => ({
            x: Math.random(), y: Math.random(), z: Math.random(),
            vx: (Math.random() - 0.5) * 0.0003,
            vy: (Math.random() - 0.5) * 0.0003 - 0.0001,
            size: Math.random() * 2.5 + 0.5,
            opacity: Math.random() * 0.7 + 0.2,
            color: rC(),
        }));

        const shapes = Array.from({ length: 14 }, () => ({
            x: Math.random(), y: Math.random(), z: Math.random() * 0.8 + 0.2,
            rotZ: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.008,
            size: Math.random() * 22 + 8,
            type: Math.floor(Math.random() * 3) as 0 | 1 | 2,
            color: rC(),
        }));

        let t = 0;
        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            t += 0.01;
            const w = canvas.width, h = canvas.height;
            const mx = mouseRef.current.x, my = mouseRef.current.y;

            // Background
            const bg = ctx.createLinearGradient(0, 0, w, h);
            bg.addColorStop(0, '#050b18'); bg.addColorStop(0.5, '#0b1629'); bg.addColorStop(1, '#0f0820');
            ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

            // Ambient glow
            const gx = w * 0.3 + mx * w * 0.4, gy = h * 0.3 + my * h * 0.2;
            const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, w * 0.5);
            rg.addColorStop(0, 'rgba(34,211,238,0.07)');
            rg.addColorStop(0.5, 'rgba(167,139,250,0.04)');
            rg.addColorStop(1, 'transparent');
            ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);

            // Perspective grid
            const horizon = h * 0.55 + my * 30;
            const vanishX = w * 0.5 + (mx - 0.5) * 120;
            ctx.save(); ctx.globalAlpha = 0.18; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 0.8;
            for (let i = 0; i <= 14; i++) {
                const bx = (i / 14) * w;
                ctx.beginPath(); ctx.moveTo(vanishX + (bx - vanishX) * 0.01, horizon); ctx.lineTo(bx, h); ctx.stroke();
            }
            for (let j = 0; j <= 10; j++) {
                const e = Math.pow(j / 10, 2), y = horizon + e * (h - horizon), sp = e * w * 0.5;
                ctx.beginPath(); ctx.moveTo(vanishX - sp, y); ctx.lineTo(vanishX + sp, y); ctx.stroke();
            }
            ctx.restore();

            // Horizon glow
            const hg = ctx.createLinearGradient(0, horizon - 60, 0, horizon + 60);
            hg.addColorStop(0, 'rgba(34,211,238,0)'); hg.addColorStop(0.5, 'rgba(34,211,238,0.18)'); hg.addColorStop(1, 'rgba(167,139,250,0)');
            ctx.fillStyle = hg; ctx.fillRect(0, horizon - 60, w, 120);

            // Particles
            particles.forEach(p => {
                const px = (p.x + p.z * (mx - 0.5) * 0.08) * w;
                const py = (p.y + p.z * (my - 0.5) * 0.04) * h;
                const pulse = 0.6 + 0.4 * Math.sin(t * 1.5 + p.x * 10);
                ctx.beginPath(); ctx.arc(px, py, p.size * pulse, 0, Math.PI * 2);
                ctx.fillStyle = p.color + Math.round(p.opacity * pulse * 220).toString(16).padStart(2, '0');
                ctx.fill();
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
                if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
            });

            // Shapes
            shapes.forEach(s => {
                const sx = (s.x + s.z * (mx - 0.5) * 0.12) * w;
                const sy = (s.y + s.z * (my - 0.5) * 0.06) * h;
                const alpha = 0.25 + s.z * 0.3;
                const hex = Math.round(alpha * 255).toString(16).padStart(2, '0');
                s.rotZ += s.rotSpeed;
                ctx.save(); ctx.translate(sx, sy); ctx.rotate(s.rotZ);
                ctx.strokeStyle = s.color + hex; ctx.lineWidth = 1.5;
                const sz = s.size * s.z;
                if (s.type === 0) { ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(sz * 0.866, sz * 0.5); ctx.lineTo(-sz * 0.866, sz * 0.5); ctx.closePath(); ctx.stroke(); }
                else if (s.type === 1) { ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(sz * 0.6, 0); ctx.lineTo(0, sz); ctx.lineTo(-sz * 0.6, 0); ctx.closePath(); ctx.stroke(); }
                else { ctx.beginPath(); ctx.moveTo(-sz, 0); ctx.lineTo(sz, 0); ctx.moveTo(0, -sz); ctx.lineTo(0, sz); ctx.stroke(); }
                ctx.restore();
            });

            // Glowing title
            const cx = w / 2 + (mx - 0.5) * -20, cy = h * 0.38 + (my - 0.5) * -15;
            ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            const fs = Math.min(w * 0.075, 72);
            ctx.font = `700 ${fs}px "Outfit", sans-serif`;
            ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 32 + 12 * Math.sin(t);
            const tg = ctx.createLinearGradient(cx - 200, 0, cx + 200, 0);
            tg.addColorStop(0, '#22d3ee'); tg.addColorStop(0.5, '#a78bfa'); tg.addColorStop(1, '#22d3ee');
            ctx.fillStyle = tg; ctx.fillText('AdventureNexus', cx, cy);
            ctx.shadowBlur = 0;
            ctx.font = `400 ${Math.min(w * 0.022, 18)}px "Outfit", sans-serif`;
            ctx.fillStyle = 'rgba(148,163,184,0.85)';
            ctx.fillText('AI-powered travel planning · Explore the world', cx, cy + fs * 0.85);
            ctx.restore();
        };

        animate();
        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }} />;
}

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  Skeleton shown while Spline JS chunk downloads + scene initialises         ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
function SplineSkeleton() {
    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#050b18,#0b1629,#0f0820)' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,211,238,0.15)', filter: 'blur(20px)', animation: 'pulse 2s ease-in-out infinite' }} />
                <div style={{ width: 160, height: 12, borderRadius: 8, background: 'rgba(34,211,238,0.2)', animation: 'pulse 2s ease-in-out infinite' }} />
                <div style={{ width: 100, height: 8, borderRadius: 8, background: 'rgba(167,139,250,0.2)', animation: 'pulse 2s ease-in-out 0.3s infinite' }} />
            </div>
        </div>
    );
}

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  SplineScene — lazy + IntersectionObserver + Error Boundary                 ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
function SplineScene() {
    const [mounted, setMounted] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Only mount the heavy Spline canvas when footer scrolls into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setMounted(true); observer.disconnect(); } },
            { threshold: 0.05 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Skeleton while loading */}
            {!loaded && <SplineSkeleton />}

            {mounted && (
                <SplineErrorBoundary fallback={<CanvasFallback />}>
                    <Suspense fallback={null}>
                        <Spline
                            scene={SCENE_URL}
                            onLoad={() => setLoaded(true)}
                            style={{
                                width: '100%',
                                height: '100%',
                                opacity: loaded ? 1 : 0,
                                transition: 'opacity 0.9s ease',
                            }}
                        />
                    </Suspense>
                </SplineErrorBoundary>
            )}
        </div>
    );
}

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  Default export                                                              ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
export default function FooterScene() {
    return <SplineScene />;
}
