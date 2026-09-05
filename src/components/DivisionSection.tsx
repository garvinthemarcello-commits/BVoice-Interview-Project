import { useState } from 'react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import { DIVISIONS, DIVISION_ICONS } from '@/lib/divisions';

export default function DivisionSection() {
  return (
    <section
      id="division"
      className="py-24 px-6 sand-texture"
      style={{ background: 'linear-gradient(180deg, #F2D9A8 0%, #E7C083 100%)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#2E7D5B' }}>
            Our Teams
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight" style={{ color: '#1B3A5C' }}>
            DIVISION
          </h2>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-1.5 w-10 rounded-full" style={{ backgroundColor: '#FF6B4A' }} />
            <div className="h-1.5 w-2 rounded-full" style={{ backgroundColor: '#1B3A5C', opacity: 0.2 }} />
          </div>
        </div>

        <DivisionGrid />
      </div>
    </section>
  );
}

function DivisionGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const gridRef = useScrollReveal<HTMLDivElement>({
    staggerSelector: '[data-division-card]',
    stagger: 0.12,
    y: 30,
    duration: 0.6,
  });

  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {DIVISIONS.map((div, idx) => {
        const Icon = DIVISION_ICONS[div.key];
        const isHovered = hoveredIdx === idx;
        return (
          <div
            key={div.key}
            data-division-card
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="rounded-2xl p-7 transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: '#FFFFFF',
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
              boxShadow: isHovered
                ? '0 16px 36px rgba(27,58,92,0.18)'
                : '0 6px 18px rgba(27,58,92,0.1)',
              border: `2px solid ${isHovered ? '#FF6B4A' : '#F2D9A8'}`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
              style={{
                backgroundColor: isHovered ? '#FF6B4A' : '#2E7D5B',
              }}
            >
              <Icon
                className="w-6 h-6"
                style={{ color: '#FFFFFF' }}
                strokeWidth={2}
              />
            </div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: '#1B3A5C' }}
            >
              {div.key}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#5C7A8A' }}>
              {div.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
