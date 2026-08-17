import { useScrollReveal } from '@/lib/useScrollReveal';

export default function Footer() {
  const year = new Date().getFullYear();
  const ref = useScrollReveal<HTMLElement>({ y: 25, duration: 0.6 });

  return (
    <footer ref={ref} style={{ backgroundColor: '#0A0A0A' }} className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 pb-8 border-b border-white/10">
          {/* Logo */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/cropped-Logo-BVoice-2-1.png"
                alt="BVoice Radio Logo"
                className="h-12 w-auto object-contain"
              />
              <span className="font-bold text-white text-lg tracking-wide">
                BVoice<span style={{ color: '#F4B400' }}>Radio</span>
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="md:w-2/3">
            <h3 className="text-white font-bold text-base mb-3">
              Media Informasi Audio Universitas Bina Nusantara — BVoice Radio
            </h3>
            <address className="text-gray-400 text-sm leading-relaxed not-italic max-w-xl">
              First Floor, Binus University Kampus Anggrek<br />
              Jl. Kebon Jeruk Raya No, 27, Kemanggisan,<br />
              Jakarta Barat 15130
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © {year} BVoice Radio. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Made with passion for the crew candidates.
          </p>
        </div>
      </div>
    </footer>
  );
}
