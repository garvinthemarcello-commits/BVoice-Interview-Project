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
  | { name: 'results'; division: DivisionKey; candidateName: string }
  | { name: 'result-fail'; candidateName: string };

function routeFromHash(): Route {
  const h = window.location.hash.replace('#', '');

  if (h.startsWith('results/')) {
    const [rawDiv, rawName] = h.slice('results/'.length).split('/');
    const div = decodeURIComponent(rawDiv ?? '');
    const match = VALID_DIVISIONS.find(
      (d) => d.toLowerCase() === div.toLowerCase(),
    );
    if (match) {
      return {
        name: 'results',
        division: match,
        candidateName: rawName ? decodeURIComponent(rawName) : '',
      };
    }
  }

  if (h === 'result-fail' || h.startsWith('result-fail/')) {
    const rawName = h.startsWith('result-fail/') ? h.slice('result-fail/'.length) : '';
    return { name: 'result-fail', candidateName: rawName ? decodeURIComponent(rawName) : '' };
  }

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
      {route.name === 'results'     && <ResultsPage division={route.division} candidateName={route.candidateName} />}
      {route.name === 'result-fail' && <FailResultsPage candidateName={route.candidateName} />}
      <Footer />
    </div>
  );
}
