import { useScrollReveal } from '@/lib/useScrollReveal';

export default function Footer() {
  const year = new Date().getFullYear();
  const ref = useScrollReveal<HTMLElement>({ y: 25, duration: 0.6 });

  return (
    <footer ref={ref} style={{ backgroundColor: '#222222' }} className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Logo */}
          <div className="md:w-1/3 flex items-center">
            <img
              src="/cropped-Logo-BVoice-2-1.png"
              alt="BVoice Radio Logo"
              className="h-20 md:h-24 w-auto object-contain"
            />
          </div>

          {/* Address */}
          <div className="md:w-2/3 flex flex-col justify-center">
            <h3 className="text-white font-bold text-base mb-3">
              Media Informasi Audio Universitas Bina Nusantara - BVoice Radio
            </h3>
            <address className="text-gray-400 text-sm leading-relaxed not-italic max-w-xl">
              First Floor, Binus University Kampus Anggrek<br />
              Jl. Kebon Jeruk Raya No, 27, Kemanggisan,<br />
              Jakarta Barat 15130
            </address>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-12 text-center text-gray-400 text-xs">
          Copyright {year}. Made with ♥️ by IT &amp; Web Development
        </p>
      </div>
    </footer>
  );
}
