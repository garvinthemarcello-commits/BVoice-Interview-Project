import { useState, useEffect } from 'react';
import CardRevealSequence from '@/components/CardRevealSequence';
import ConfettiBurst from '@/components/ConfettiBurst';
import type { DivisionKey } from '@/lib/divisions';
import DivisionSection from '@/components/DivisionSection';

// Total animation runtime before the division grid fades in (matches the
// reveal sequence: fade-in + 5 shuffle rounds + settle + select + flip).
const REVEAL_DURATION_MS = 7300;

interface Props {
  division: DivisionKey;
  candidateName: string;
}

export default function ResultsPage({ division, candidateName }: Props) {
  const [showDivisions, setShowDivisions] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowDivisions(true), REVEAL_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: 'linear-gradient(180deg, #7EC8E3 0%, #BFE1D9 30%, #F2D9A8 100%)', minHeight: '100vh' }}>
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

      {/* Header + card reveal */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#2E7D5B' }}
          >
            Interview Outcome
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight" style={{ color: '#1B3A5C' }}>
            RESULTS
          </h1>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-1.5 w-12 rounded-full" style={{ backgroundColor: '#FF6B4A' }} />
            <div className="h-1.5 w-3 rounded-full" style={{ backgroundColor: '#1B3A5C', opacity: 0.2 }} />
          </div>

          {candidateName && (
            <p className="mt-8 text-2xl sm:text-3xl font-extrabold tracking-wide" style={{ color: '#2E7D5B' }}>
              SELAMAT {candidateName.toUpperCase()}!
            </p>
          )}

          <p className="mt-4 text-lg sm:text-xl font-medium leading-relaxed" style={{ color: '#1B3A5C' }}>
            Kamu{' '}
            <span style={{ color: '#2E7D5B' }} className="font-extrabold tracking-wide">
              LOLOS
            </span>{' '}
            Interview sebagai...
          </p>
        </div>

        {/* Card reveal animation */}
        <div
          className="max-w-5xl mx-auto mt-10"
          style={{ animation: 'fadeInUp 0.7s ease both' }}
        >
          <CardRevealSequence
            division={division}
            onRevealComplete={() => setShowConfetti(true)}
          />
        </div>
      </section>

      {/* Division information grid — fades in after the reveal completes */}
      <div
        style={{
          opacity: showDivisions ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        {showDivisions && <DivisionSection />}
      </div>
    </div>
  );
}
