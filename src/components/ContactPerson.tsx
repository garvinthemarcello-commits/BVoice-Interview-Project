import { User, Instagram, MessageCircle } from 'lucide-react';
import { useScrollReveal } from '@/lib/useScrollReveal';

type ContactRow = {
  label: string;
  value: string;
  icon: typeof User;
};

const contacts: ContactRow[] = [
  { label: 'Name', value: 'Putri Andini', icon: User },
  { label: 'Instagram', value: '@putri.radio', icon: Instagram },
  { label: 'LINE', value: 'putri_radio', icon: MessageCircle },
];

export default function ContactPerson() {
  const ref = useScrollReveal<HTMLElement>({ y: 30, duration: 0.65 });
  return (
    <section
      ref={ref}
      id="contact"
      className="py-24 px-6"
      style={{ backgroundColor: '#111111' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#F4B400' }}>
            Get In Touch
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            CONTACT PERSON
          </h2>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-1 w-10 rounded-full" style={{ backgroundColor: '#F4B400' }} />
            <div className="h-1 w-2 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Contact Card */}
        <div
          className="rounded-2xl p-8 sm:p-10 transition-transform duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: '#1A1A1A',
            border: '2px solid #F4B400',
            boxShadow: '0 8px 32px rgba(244,180,0,0.12)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: '#F4B400',
                boxShadow: '0 4px 16px rgba(244,180,0,0.3)',
              }}
            >
              <User className="w-10 h-10 text-black" strokeWidth={2} />
            </div>

            {/* Contact details */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
              {contacts.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.label}
                    className="flex flex-col items-center sm:items-start gap-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: '#F4B400' }} strokeWidth={2} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {c.label}
                      </span>
                    </div>
                    <span className="text-white font-medium text-sm">{c.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-8 text-center text-gray-400 text-sm leading-relaxed">
            Have questions about your interview result? <br />
            Feel free to reach out — we're here to help.
          </p>
        </div>
      </div>
    </section>
  );
}
