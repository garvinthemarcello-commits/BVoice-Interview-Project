import { useState } from 'react';
import { Search } from 'lucide-react';
import { getCandidateByNim } from '@/lib/api';

export default function CheckResultCard() {
  const [nim, setNim]             = useState('');
  const [hovered, setHovered]     = useState(false);
  const [error, setError]         = useState('');
  const [checking, setChecking]   = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nim.trim()) {
      setError('Please enter your NIM first.');
      return;
    }

    setChecking(true);

    try {
      const candidate = await getCandidateByNim(nim.trim());

      if (!candidate) {
        setChecking(false);
        setError('No result found for that NIM. Please check and try again.');
        return;
      }

      const encodedName = encodeURIComponent(candidate.name ?? '');

      if (candidate.status === 'passed' && candidate.division) {
        window.location.hash = `results/${encodeURIComponent(candidate.division.name)}/${encodedName}`;
      } else {
        window.location.hash = `result-fail/${encodedName}`;
      }
      window.scrollTo({ top: 0 });
    } catch {
      setChecking(false);
      setError('Something went wrong while checking your result. Please try again.');
    }
  };

  return (
    <div
      className="w-full max-w-sm rounded-2xl p-8 shadow-2xl"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#F4B400' }}
        >
          <Search className="w-4 h-4 text-black" strokeWidth={2.5} />
        </div>
        <h2 className="text-white font-bold text-lg">Check Your Result</h2>
      </div>

      <form onSubmit={handleCheck} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
            Input Your NIM
          </label>
          <input
            type="text"
            value={nim}
            onChange={(e) => {
              setNim(e.target.value);
              setError('');
            }}
            placeholder="e.g. 123"
            className="w-full bg-white rounded-xl px-4 py-3 text-gray-800 text-sm font-medium placeholder-gray-400 outline-none transition-all duration-200"
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.35)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
          />
        </div>

        {error && (
          <p className="text-sm leading-relaxed" style={{ color: '#F87171' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={checking}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="w-full py-3.5 rounded-xl font-bold text-black text-sm tracking-wide transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            backgroundColor: hovered ? '#FFD033' : '#F4B400',
            transform: hovered && !checking ? 'translateY(-3px)' : 'translateY(0)',
            boxShadow: hovered
              ? '0 8px 24px rgba(244,180,0,0.45)'
              : '0 4px 12px rgba(244,180,0,0.25)',
          }}
        >
          {checking ? 'Checking...' : 'Check Result'}
        </button>
      </form>

      <p className="mt-5 text-center text-gray-600 text-xs leading-relaxed">
        Enter your NIM to find your interview result.
      </p>
    </div>
  );
}
