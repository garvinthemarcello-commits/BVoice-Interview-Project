import { useState } from 'react';
import {
  Mic,
  Megaphone,
  Palette,
  Newspaper,
  Music,
  Headphones,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useScrollReveal } from '@/lib/useScrollReveal';

type Division = {
  name: string;
  description: string;
  icon: LucideIcon;
};

const divisions: Division[] = [
  {
    name: 'Announcer',
    description: 'The voice behind the mic — bringing energy and stories to every broadcast.',
    icon: Mic,
  },
  {
    name: 'Marketing',
    description: 'Building the brand, reaching audiences, and driving creative campaigns.',
    icon: Megaphone,
  },
  {
    name: 'Creative',
    description: 'Designing visuals, concepts, and the look that defines our identity.',
    icon: Palette,
  },
  {
    name: 'Reporter',
    description: 'Covering events and crafting the stories that keep our community informed.',
    icon: Newspaper,
  },
  {
    name: 'Music Lister',
    description: 'Curating playlists and discovering fresh tracks for every show.',
    icon: Music,
  },
  {
    name: 'Operator',
    description: 'Managing the technical backbone that keeps every transmission running smooth.',
    icon: Headphones,
  },
];

export default function DivisionSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const gridRef = useScrollReveal<HTMLDivElement>({
    staggerSelector: '[data-division-card]',
    stagger: 0.12,
    y: 30,
    duration: 0.6,
  });

  return (
    <section
      id="division"
      className="py-24 px-6"
      style={{ backgroundColor: '#111111' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#F4B400' }}>
            Our Teams
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            DIVISION
          </h2>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-1 w-10 rounded-full" style={{ backgroundColor: '#F4B400' }} />
            <div className="h-1 w-2 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisions.map((div, idx) => {
            const Icon = div.icon;
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={div.name}
                data-division-card
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="rounded-2xl p-7 transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: isHovered ? '#222' : '#1A1A1A',
                  transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: isHovered
                    ? '0 12px 40px rgba(244,180,0,0.15)'
                    : '0 4px 16px rgba(0,0,0,0.3)',
                  border: `1px solid ${isHovered ? 'rgba(244,180,0,0.35)' : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300"
                  style={{
                    backgroundColor: isHovered ? '#F4B400' : 'rgba(244,180,0,0.15)',
                  }}
                >
                  <Icon
                    className="w-6 h-6 transition-colors duration-300"
                    style={{ color: isHovered ? '#000' : '#F4B400' }}
                    strokeWidth={2}
                  />
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: '#F4B400' }}
                >
                  {div.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {div.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
