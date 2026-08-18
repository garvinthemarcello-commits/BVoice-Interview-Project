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
    <div style={{ backgroundColor: '#111111', minHeight: '100vh' }}>
      {/* Header */}
      <section className="pt-28 pb-10 px-6" style={{ backgroundColor: '#111111' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#F4B400' }}
          >
            Interview Outcome
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            HASIL
          </h1>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-1 w-12 rounded-full" style={{ backgroundColor: '#F4B400' }} />
            <div className="h-1 w-3 rounded-full bg-white/20" />
          </div>

          {candidateName && (
            <p className="mt-8 text-2xl sm:text-3xl font-extrabold tracking-wide text-white">
              {candidateName.toUpperCase()}
            </p>
          )}

          <p className="mt-4 text-lg sm:text-xl text-white font-medium leading-relaxed">
            Terima kasih telah mengikuti proses interview.
          </p>
          <p className="mt-3 text-base sm:text-lg text-gray-300 leading-relaxed">
            Maaf, kamu{' '}
            <span style={{ color: '#F4B400' }} className="font-bold">
              belum lolos
            </span>{' '}
            pada tahap rekrutmen ini.
          </p>
          <p className="mt-5 text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
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
            backgroundColor: '#1A1A1A',
            border: '2px solid #F4B400',
            boxShadow: '0 8px 36px rgba(244,180,0,0.15)',
            animation: 'fadeInUp 0.7s ease both',
          }}
        >
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: 'rgba(244,180,0,0.12)',
              border: '1.5px solid rgba(244,180,0,0.35)',
            }}
          >
            <MailOpen
              className="w-10 h-10"
              style={{ color: '#F4B400' }}
              strokeWidth={1.5}
            />
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Better Luck Next Time
          </h2>

          {/* Body */}
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            Although you were not selected this time, we truly appreciate your
            interest in joining our team.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            Every interview is valuable experience, and we encourage you to
            continue developing your skills.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Thank you for being part of this recruitment process.
          </p>

          {/* Return Home button */}
          <button
            onClick={goHome}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-black text-sm tracking-wide transition-all duration-200"
            style={{
              backgroundColor: hovered ? '#FFD033' : '#F4B400',
              transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
              boxShadow: hovered
                ? '0 8px 24px rgba(244,180,0,0.45)'
                : '0 4px 12px rgba(244,180,0,0.25)',
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
              style={{ color: '#F4B400' }}
            >
              Keep Going
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Keep Improving
            </h3>
            <div className="mt-5 flex items-center justify-center gap-2">
              <div className="h-1 w-10 rounded-full" style={{ backgroundColor: '#F4B400' }} />
              <div className="h-1 w-2 rounded-full bg-white/20" />
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
                    backgroundColor: '#1A1A1A',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    animation: `fadeInUp 0.6s ease both`,
                    animationDelay: `${idx * 140 + 200}ms`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(244,180,0,0.35)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(244,180,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(244,180,0,0.15)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#F4B400' }} strokeWidth={2} />
                  </div>
                  <h4 className="text-base font-bold mb-1.5" style={{ color: '#F4B400' }}>
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
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
