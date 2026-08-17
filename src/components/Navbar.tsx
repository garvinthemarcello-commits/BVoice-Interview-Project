import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

type NavAction =
  | { type: 'home' }
  | { type: 'contact' }
  | { type: 'external'; url: string };

const navActions: { label: string; action: NavAction }[] = [
  { label: 'Home',            action: { type: 'home' } },
  { label: 'Contact Person',  action: { type: 'contact' } },
  { label: 'Official Website', action: { type: 'external', url: 'https://bvoiceradio.com/' } },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAction = (action: NavAction) => {
    setMenuOpen(false);

    if (action.type === 'external') {
      window.open(action.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // For in-page links we must first ensure we're on the landing page.
    const isOnLanding = window.location.hash === '' || window.location.hash === '#home';
    if (!isOnLanding) {
      window.location.hash = '';
      // wait for the route swap before scrolling
      setTimeout(() => {
        if (action.type === 'contact') {
          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 120);
      return;
    }

    if (action.type === 'contact') {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg shadow-black/40' : ''
      }`}
      style={{ backgroundColor: '#111111' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleAction({ type: 'home' })}
          className="flex items-center gap-2 group"
          aria-label="Go home"
        >
          <img
            src="/cropped-Logo-BVoice-2-1.png"
            alt="BVoice Radio"
            className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-bold text-white text-lg tracking-wide hidden sm:block">
            BVoice<span style={{ color: '#F4B400' }}>Radio</span>
          </span>
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navActions.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleAction(item.action)}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: '#F4B400' }}
                />
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-lg transition-colors hover:bg-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ backgroundColor: '#1A1A1A' }}
      >
        <ul className="px-6 pb-4 flex flex-col gap-1">
          {navActions.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleAction(item.action)}
                className="block w-full text-left py-3 text-gray-300 hover:text-white text-sm font-medium border-b border-white/10 transition-colors duration-200"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
