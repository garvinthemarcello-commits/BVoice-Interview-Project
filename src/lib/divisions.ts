/**
 * Client-side division metadata that has no backend equivalent (icons).
 * Names/descriptions come from the API (GET /api/divisions) — this module
 * only maps a division name to the icon shown for it, so that mapping lives
 * in exactly one place instead of being duplicated per component.
 */
import { Mic, Megaphone, Palette, Newspaper, Music, Headphones, Radio } from 'lucide-react';
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

/** Fallback icon for a division name the client doesn't recognize. */
export const DEFAULT_DIVISION_ICON: LucideIcon = Radio;

export function iconForDivision(name: string): LucideIcon {
  return DIVISION_ICONS[name as DivisionKey] ?? DEFAULT_DIVISION_ICON;
}
