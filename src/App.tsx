import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/pages/LandingPage';
import ResultsPage from '@/pages/ResultsPage';
import FailResultsPage from '@/pages/FailResultsPage';
import type { DivisionKey } from '@/lib/divisions';

const VALID_DIVISIONS: DivisionKey[] = [
  'Announcer',
  'Marketing',
  'Creative',
  'Reporter',
  'Music Lister',
  'Operator',
];

type Route =
  | { name: 'home' }
  | { name: 'results'; division: DivisionKey }
  | { name: 'result-fail' };

function routeFromHash(): Route {
  const h = window.location.hash.replace('#', '');

  if (h.startsWith('results/')) {
    const div = decodeURIComponent(h.slice('results/'.length));
    const match = VALID_DIVISIONS.find(
      (d) => d.toLowerCase() === div.toLowerCase(),
    );
    if (match) return { name: 'results', division: match };
  }

  if (h === 'result-fail') return { name: 'result-fail' };

  return { name: 'home' };
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [route, setRoute] = useState<Route>({ name: 'home' });

  useEffect(() => {
    const sync = () => {
      setRoute(routeFromHash());
      window.scrollTo({ top: 0 });
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`min-h-screen transition-opacity duration-700 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: '#111111',
      }}
    >
      <Navbar />
      {route.name === 'home'        && <LandingPage />}
      {route.name === 'results'     && <ResultsPage division={route.division} />}
      {route.name === 'result-fail' && <FailResultsPage />}
      <Footer />
    </div>
  );
}
