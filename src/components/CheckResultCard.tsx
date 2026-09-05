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
      className="w-full max-w-sm rounded-2xl p-8"
      style={{
        backgroundColor: '#F2D9A8',
        border: '2px solid #FF6B4A',
        boxShadow: '0 14px 32px rgba(27,58,92,0.18)',
      }}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#FF6B4A' }}
        >
          <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="font-bold text-lg" style={{ color: '#1B3A5C' }}>Check Your Result</h2>
      </div>

      <form onSubmit={handleCheck} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#5C7A8A' }}>
            Input Your NIM
          </label>
          <input
            type="text"
            value={nim}
            onChange={(e) => {
              setNim(e.target.value);
              setError('');
            }}
            placeholder="NIM"
            className="w-full bg-white rounded-xl px-4 py-3 text-sm font-medium placeholder-gray-400 outline-none transition-all duration-200"
            style={{ color: '#1B3A5C' }}
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 3px rgba(46,125,91,0.35)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
          />
        </div>

        {error && (
          <p className="text-sm leading-relaxed" style={{ color: '#C0392B' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={checking}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="w-full py-3.5 rounded-xl font-bold text-white text-sm tracking-wide transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            backgroundColor: hovered ? '#E85A3B' : '#FF6B4A',
            transform: hovered && !checking ? 'translateY(-3px)' : 'translateY(0)',
            boxShadow: hovered
              ? '0 8px 24px rgba(255,107,74,0.45)'
              : '0 4px 12px rgba(255,107,74,0.3)',
          }}
        >
          {checking ? 'Checking...' : 'Check Result'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs leading-relaxed" style={{ color: '#5C7A8A' }}>
        Enter your NIM to find your interview result.
      </p>
    </div>
  );
}
