import CheckResultCard from './CheckResultCard';
import { useScrollReveal } from '@/lib/useScrollReveal';

export default function Hero() {
  const headingRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7, start: 'top 90%' });
  const cardRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.15, start: 'top 90%' });

  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-screen flex items-center pt-20"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Decorative shapes */}
      <DecorativeShapes />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Heading */}
          <div
            ref={headingRef}
            className="flex-1"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
              WELCOME{' '}
              <span style={{ color: '#F4B400' }}>CREW</span>
              <br />
              CANDIDATES!
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-md">
              This is your platform, your stage.<br />
              Find out where you belong in BVoice Radio.<br />
              Check your interview results below and take<br />
              the next step in your journey with us.
            </p>

            {/* Decorative accent line */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-1 w-12 rounded-full" style={{ backgroundColor: '#F4B400' }} />
              <div className="h-1 w-6 rounded-full bg-gray-200" />
              <div className="h-1 w-3 rounded-full bg-gray-200" />
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
      {/* Top-left vertical bars */}
      <div className="absolute top-24 left-6 flex gap-2">
        {[80, 50, 65, 40, 70].map((h, i) => (
          <div
            key={i}
            className="w-2.5 rounded-full opacity-60"
            style={{ height: `${h}px`, backgroundColor: '#F4B400' }}
          />
        ))}
      </div>

      {/* Large circle bottom-left */}
      <div
        className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full opacity-20"
        style={{ backgroundColor: '#F4B400' }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full border-4 opacity-30"
        style={{ borderColor: '#F4B400' }}
      />

      {/* Small circle top-right */}
      <div
        className="absolute top-28 right-12 w-20 h-20 rounded-full border-4 opacity-20"
        style={{ borderColor: '#F4B400' }}
      />
      <div
        className="absolute top-36 right-20 w-10 h-10 rounded-full opacity-15"
        style={{ backgroundColor: '#F4B400' }}
      />

      {/* Music notes — bottom right */}
      <div
        className="absolute bottom-20 right-8 text-5xl opacity-10 font-bold select-none"
        style={{ color: '#F4B400' }}
      >
        ♪ ♫
      </div>

      {/* Top-right accent bars */}
      <div className="absolute top-8 right-44 flex flex-col gap-2">
        {[30, 50, 20, 40].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded-full opacity-25"
            style={{ width: `${w}px`, backgroundColor: '#F4B400' }}
          />
        ))}
      </div>
    </div>
  );
}
