/**
 * Client-side division metadata for the landing page grid.
 * Static on purpose: this list rarely changes, and fetching it from
 * GET /api/divisions on every page load added a serverless+DB round trip
 * just to render 6 fixed cards. The database (see db/seed.js) remains the
 * source of truth for candidate lookups — this is only the display copy.
 * If you edit division names/descriptions in the DB, mirror the change here.
 */
import { Mic, Megaphone, Palette, Newspaper, Music, Headphones } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type DivisionKey =
  | 'Announcer'
  | 'Marketing'
  | 'Creative'
  | 'Reporter'
  | 'Music Lister'
  | 'Operator';

export const DIVISION_ICONS: Record<DivisionKey, LucideIcon> = {
  Announcer: Mic,
  Marketing: Megaphone,
  Creative: Palette,
  Reporter: Newspaper,
  'Music Lister': Music,
  Operator: Headphones,
};

export interface DivisionInfo {
  key: DivisionKey;
  description: string;
}

export const DIVISIONS: DivisionInfo[] = [
  { key: 'Announcer', description: 'The voice behind the mic — bringing energy and stories to every broadcast.' },
  { key: 'Marketing', description: 'Building the brand, reaching audiences, and driving creative campaigns.' },
  { key: 'Creative', description: 'Designing visuals, concepts, and the look that defines our identity.' },
  { key: 'Reporter', description: 'Covering events and crafting the stories that keep our community informed.' },
  { key: 'Music Lister', description: 'Curating playlists and discovering fresh tracks for every show.' },
  { key: 'Operator', description: 'Managing the technical backbone that keeps every transmission running smooth.' },
];
