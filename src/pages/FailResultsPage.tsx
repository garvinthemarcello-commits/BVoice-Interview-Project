import { useState } from 'react';
import { MailOpen, BookOpen, Lightbulb, Rocket, ArrowLeft } from 'lucide-react';

const encouragement = [
  {
    title: 'Continue Learning',
    description: 'Every experience helps build new skills.',
    icon: BookOpen,
  },
  {
    title: 'Stay Curious',
    description: 'Keep creating and exploring new opportunities.',
    icon: Lightbulb,
  },
  {
    title: 'Try Again',
    description: 'We hope to see you in future recruitment events.',
    icon: Rocket,
  },
];

interface Props {
  candidateName: string;
}

export default function FailResultsPage({ candidateName }: Props) {
  const [hovered, setHovered] = useState(false);

  const goHome = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #7EC8E3 0%, #BFE1D9 25%, #F2D9A8 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <section className="pt-28 pb-10 px-6">
        <div className="max-w-2xl mx-auto text-center">
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
            <p className="mt-8 text-2xl sm:text-3xl font-extrabold tracking-wide" style={{ color: '#1B3A5C' }}>
              {candidateName.toUpperCase()}
            </p>
          )}

          <p className="mt-4 text-lg sm:text-xl font-medium leading-relaxed" style={{ color: '#1B3A5C' }}>
            Terima kasih telah mengikuti proses interview.
          </p>
          <p className="mt-3 text-base sm:text-lg leading-relaxed" style={{ color: '#2F4D63' }}>
            Maaf, kamu{' '}
            <span style={{ color: '#FF6B4A' }} className="font-bold">
              belum lolos
            </span>{' '}
            pada tahap rekrutmen ini.
          </p>
          <p className="mt-5 text-sm leading-relaxed max-w-md mx-auto" style={{ color: '#5C7A8A' }}>
            Kami sangat menghargai waktu dan usaha yang telah kamu berikan.
            <br />
            Kami berharap bisa bertemu lagi di kesempatan rekrutmen berikutnya.
          </p>
        </div>
      </section>

      {/* Main illustration card */}
      <section className="px-6 pb-16">
        <div
          className="max-w-md mx-auto rounded-2xl p-10 text-center"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #FF6B4A',
            boxShadow: '0 10px 36px rgba(27,58,92,0.18)',
            animation: 'fadeInUp 0.7s ease both',
          }}
        >
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: '#F2D9A8',
              border: '1.5px solid rgba(255,107,74,0.4)',
            }}
          >
            <MailOpen
              className="w-10 h-10"
              style={{ color: '#FF6B4A' }}
              strokeWidth={1.5}
            />
          </div>

          {/* Heading */}
          <h2 className="font-display text-2xl sm:text-3xl mb-4" style={{ color: '#1B3A5C' }}>
            Better Luck Next Time
          </h2>

          {/* Body */}
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#5C7A8A' }}>
            Although you were not selected this time, we truly appreciate your
            interest in joining our team.
          </p>
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#5C7A8A' }}>
            Every interview is valuable experience, and we encourage you to
            continue developing your skills.
          </p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#5C7A8A' }}>
            Thank you for being part of this recruitment process.
          </p>

          {/* Return Home button */}
          <button
            onClick={goHome}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm tracking-wide transition-all duration-200"
            style={{
              backgroundColor: hovered ? '#E85A3B' : '#FF6B4A',
              transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
              boxShadow: hovered
                ? '0 8px 24px rgba(255,107,74,0.45)'
                : '0 4px 12px rgba(255,107,74,0.3)',
            }}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Return Home
          </button>
        </div>
      </section>

      {/* Encouragement section */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#2E7D5B' }}
            >
              Keep Going
            </p>
            <h3 className="font-display text-2xl sm:text-3xl tracking-tight" style={{ color: '#1B3A5C' }}>
              Keep Improving
            </h3>
            <div className="mt-5 flex items-center justify-center gap-2">
              <div className="h-1.5 w-10 rounded-full" style={{ backgroundColor: '#FF6B4A' }} />
              <div className="h-1.5 w-2 rounded-full" style={{ backgroundColor: '#1B3A5C', opacity: 0.2 }} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {encouragement.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #F2D9A8',
                    boxShadow: '0 6px 18px rgba(27,58,92,0.1)',
                    animation: `fadeInUp 0.6s ease both`,
                    animationDelay: `${idx * 140 + 200}ms`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF6B4A';
                    e.currentTarget.style.boxShadow = '0 14px 36px rgba(27,58,92,0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#F2D9A8';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(27,58,92,0.1)';
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#2E7D5B' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#FFFFFF' }} strokeWidth={2} />
                  </div>
                  <h4 className="text-base font-bold mb-1.5" style={{ color: '#1B3A5C' }}>
                    {item.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#5C7A8A' }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
