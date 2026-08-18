import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

const PREFERS_REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLORS = ['#F4B400', '#FFD033', '#34D399', '#FFFFFF'];
const PARTICLE_COUNT = 130;

interface Particle {
  id: number;
  left: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle';
  rotate: number;
  drift: number;
  duration: number;
  delay: number;
}

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    left: Math.random() * 100,
    size: 6 + Math.random() * 6,
    color: COLORS[id % COLORS.length],
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    rotate: 360 + Math.random() * 360,
    drift: (Math.random() - 0.5) * 160,
    duration: 2.5 + Math.random() * 2,
    delay: Math.random() * 0.4,
  }));
}

interface Props {
  onDone?: () => void;
}

// One-shot, self-cleaning confetti burst that covers the full viewport.
export default function ConfettiBurst({ onDone }: Props) {
  const particles = useMemo(makeParticles, []);
  const elRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (PREFERS_REDUCED) {
      onDone?.();
      return;
    }

    const ctx = gsap.context(() => {
      particles.forEach((p, i) => {
        const el = elRefs.current[i];
        if (!el) return;
        gsap.fromTo(
          el,
          { y: '-10vh', x: 0, rotation: 0, opacity: 1 },
          {
            y: '110vh',
            x: p.drift,
            rotation: p.rotate,
            opacity: 0.9,
            duration: p.duration,
            delay: p.delay,
            ease: 'power1.in',
          },
        );
      });
    });

    const maxEnd = Math.max(...particles.map((p) => p.delay + p.duration));
    const t = setTimeout(() => onDone?.(), maxEnd * 1000 + 100);

    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  // Fire once on mount — this component is remounted fresh for each burst.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (PREFERS_REDUCED) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {particles.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => { elRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.left}vw`,
            width: p.shape === 'rect' ? p.size * 0.6 : p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : 2,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}
