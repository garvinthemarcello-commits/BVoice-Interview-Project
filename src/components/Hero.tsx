import CheckResultCard from './CheckResultCard';
import { useScrollReveal } from '@/lib/useScrollReveal';

export default function Hero() {
  const headingRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7, start: 'top 90%' });
  const cardRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.15, start: 'top 90%' });

  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-screen flex items-center pt-20"
      style={{ background: 'linear-gradient(180deg, #7EC8E3 0%, #BFE1D9 45%, #F2D9A8 100%)' }}
    >
      {/* Decorative shapes — reserve visual space here for a mascot illustration later */}
      <DecorativeShapes />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Heading */}
          <div
            ref={headingRef}
            className="flex-1"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6" style={{ color: '#1B3A5C' }}>
              WELCOME{' '}
              <span style={{ color: '#FF6B4A' }}>CREW</span>
              <br />
              CANDIDATES!
            </h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-md" style={{ color: '#2F4D63' }}>
              This is your platform, your stage.<br />
              Find out where you belong in BVoice Radio.<br />
              Check your interview results below and take<br />
              the next step in your journey with us.
            </p>

            {/* Decorative accent line */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-1.5 w-12 rounded-full" style={{ backgroundColor: '#FF6B4A' }} />
              <div className="h-1.5 w-6 rounded-full" style={{ backgroundColor: '#2E7D5B' }} />
              <div className="h-1.5 w-3 rounded-full" style={{ backgroundColor: '#1B3A5C', opacity: 0.25 }} />
            </div>
          </div>

          {/* Right: Check Result Card */}
          <div
            ref={cardRef}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <CheckResultCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function DecorativeShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Sun, top-right */}
      <div
        className="absolute -top-10 right-10 w-40 h-40 rounded-full opacity-70"
        style={{ background: 'radial-gradient(circle, #FFE9A8 0%, #FFD778 60%, transparent 100%)' }}
      />

      {/* Drifting clouds */}
      <div className="absolute top-16 left-10 flex items-center gap-2 opacity-80">
        <div className="w-14 h-6 rounded-full bg-white" />
        <div className="w-9 h-9 rounded-full bg-white -ml-6" />
        <div className="w-16 h-7 rounded-full bg-white -ml-4" />
      </div>
      <div className="absolute top-40 right-32 flex items-center gap-2 opacity-60">
        <div className="w-10 h-5 rounded-full bg-white" />
        <div className="w-7 h-7 rounded-full bg-white -ml-4" />
      </div>

      {/* Palm-leaf silhouette, bottom-left — reserved corner for a future mascot/illustration asset */}
      <svg
        className="absolute -bottom-6 -left-10 w-56 h-56 opacity-90"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 95 C50 70 48 55 50 40"
          stroke="#2E7D5B"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M50 45 C35 35 20 38 10 30 C22 28 38 30 50 40 Z" fill="#2E7D5B" />
        <path d="M50 40 C40 25 28 20 18 10 C32 12 45 20 52 35 Z" fill="#2E7D5B" />
        <path d="M50 38 C55 22 65 15 72 6 C68 20 60 30 51 42 Z" fill="#2E7D5B" />
        <path d="M50 42 C62 34 76 34 88 28 C78 38 64 42 51 46 Z" fill="#2E7D5B" />
      </svg>

      {/* Coral/shell accent, bottom-right */}
      <div
        className="absolute bottom-10 right-8 w-16 h-16 rounded-full opacity-80"
        style={{ backgroundColor: '#FF6B4A' }}
      />
      <div
        className="absolute bottom-24 right-24 w-8 h-8 rounded-full opacity-60"
        style={{ backgroundColor: '#FF6B4A' }}
      />

      {/* Wave divider at the base of the section */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ height: 60 }}
      >
        <path
          d="M0,40 C240,80 480,0 720,20 C960,40 1200,80 1440,30 L1440,80 L0,80 Z"
          fill="#F2D9A8"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
