import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Megaphone, Palette, Newspaper, Music, Headphones, Radio } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Division registry ─────────────────────────────────────────────────────

export type DivisionKey =
  | 'Announcer'
  | 'Marketing'
  | 'Creative'
  | 'Reporter'
  | 'Music Lister'
  | 'Operator';

const DIVISION_META: Record<DivisionKey, { icon: LucideIcon }> = {
  Announcer:    { icon: Mic        },
  Marketing:    { icon: Megaphone  },
  Creative:     { icon: Palette    },
  Reporter:     { icon: Newspaper  },
  'Music Lister': { icon: Music    },
  Operator:     { icon: Headphones },
};

// ── Container geometry (vertical tarot cards) ─────────────────────────────
// BASE_* are the reference design dimensions (desktop at scale = 1).
// All actual positions/sizes are derived from these and a responsive scale.

const BASE_W = 580;
const BASE_H = 440;
const CARD_W = 130;
const CARD_H = 190;
const GAP_X  = 22;
const GAP_Y  = 26;

type Pos = { x: number; y: number };

// Slot positions as RATIOS (0–1) of BASE_W / BASE_H so they can be
// multiplied by the actual stage dimensions at any screen size.
const SLOTS_RATIO: Pos[] = (() => {
  const totalW = 3 * CARD_W + 2 * GAP_X;
  const totalH = 2 * CARD_H + GAP_Y;
  const ox = (BASE_W - totalW) / 2 + CARD_W / 2;
  const oy = (BASE_H - totalH) / 2 + CARD_H / 2;
  return [
    { x: ox / BASE_W,                            y: oy / BASE_H                        },
    { x: (ox + CARD_W + GAP_X) / BASE_W,         y: oy / BASE_H                        },
    { x: (ox + 2 * (CARD_W + GAP_X)) / BASE_W,   y: oy / BASE_H                        },
    { x: ox / BASE_W,                            y: (oy + CARD_H + GAP_Y) / BASE_H     },
    { x: (ox + CARD_W + GAP_X) / BASE_W,         y: (oy + CARD_H + GAP_Y) / BASE_H     },
    { x: (ox + 2 * (CARD_W + GAP_X)) / BASE_W,   y: (oy + CARD_H + GAP_Y) / BASE_H     },
  ];
})();

const CENTER_RATIO: Pos = { x: 0.5, y: 0.5 };

// ── Card state ────────────────────────────────────────────────────────────

interface Card {
  id: number;
  pos: Pos;
  opacity: number;
  scale: number;
  rot: number;
  zIndex: number;
  isSelected: boolean;
  isFlipped: boolean;
  tdur: string;
}

function initCards(): Card[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id:         i,
    pos:        { ...SLOTS_RATIO[i] },
    opacity:    0,
    scale:      1,
    rot:        0,
    zIndex:     i + 1,
    isSelected: false,
    isFlipped:  false,
    tdur:       '0.5s',
  }));
}

function makeShuffleRounds(n = 5): number[][] {
  const rounds: number[][] = [];
  let cur = [0, 1, 2, 3, 4, 5];
  for (let r = 0; r < n; r++) {
    const next = [...cur];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    rounds.push(next);
    cur = next;
  }
  return rounds;
}

// ── Props ─────────────────────────────────────────────────────────────────

interface Props {
  division: DivisionKey;
}

// ── Main component ────────────────────────────────────────────────────────

export default function CardRevealSequence({ division }: Props) {
  const [cards, setCards] = useState<Card[]>(initCards);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      const w = containerRef.current?.clientWidth ?? BASE_W;
      setScale(Math.min(1, (w - 32) / BASE_W));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const upd = useCallback((fn: (prev: Card[]) => Card[]) => setCards(fn), []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const shuffleRounds = makeShuffleRounds(5);

    // Phase 1 – fade cards in one by one with a slight settle
    for (let i = 0; i < 6; i++) {
      at(i * 150, () =>
        upd(prev => prev.map(c => c.id === i ? { ...c, opacity: 1, tdur: '0.5s' } : c)),
      );
    }

    // Phase 2 – shuffle rounds (with a gentle tilt for a tarot-riffle feel)
    shuffleRounds.forEach((round, ri) => {
      at(1150 + ri * 800, () =>
        upd(prev =>
          prev.map((c) => ({
            ...c,
            pos:    { ...SLOTS_RATIO[round[c.id]] },
            rot:    (Math.round(Math.random() * 6) - 3),
            zIndex: round[c.id] < 3 ? c.id + 1 : c.id + 7,
            tdur:   '0.68s',
          })),
        ),
      );
    });

    const afterShuffle = 1150 + shuffleRounds.length * 800;

    // Phase 3 – gather the non-selected cards slightly inward & dim them
    at(afterShuffle + 250, () =>
      upd(prev =>
        prev.map(c => ({
          ...c,
          rot: 0,
          tdur: '0.45s',
        })),
      ),
    );

    // Phase 4 – select one card, lift it to center & scale up
    at(afterShuffle + 400, () =>
      upd(prev =>
        prev.map(c => ({
          ...c,
          isSelected: c.id === 1,
          pos:    c.id === 1 ? { ...CENTER_RATIO } : { ...c.pos },
          opacity: c.id === 1 ? 1 : 0.12,
          scale:  c.id === 1 ? 1.7 : 0.8,
          zIndex: c.id === 1 ? 20  : c.zIndex,
          tdur:   '0.7s',
        })),
      ),
    );

    // Phase 5 – flip the selected card
    at(afterShuffle + 1250, () =>
      upd(prev => prev.map(c => c.id === 1 ? { ...c, isFlipped: true, tdur: '0.9s' } : c)),
    );

    return () => timers.forEach(clearTimeout);
  // Run once on mount; division is stable in this flow
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meta = DIVISION_META[division] ?? DIVISION_META['Marketing'];
  const Icon = meta.icon;

  const stageW = BASE_W * scale;
  const stageH = BASE_H * scale;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Card stage */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: stageH + 8, position: 'relative' }}
      >
        <div
          style={{
            width: stageW,
            height: stageH,
            position: 'relative',
            margin: '0 auto',
          }}
        >
          {cards.map(card => (
            <FlipCard
              key={card.id}
              card={card}
              division={division}
              divisionIcon={Icon}
              scale={scale}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Individual flip card ──────────────────────────────────────────────────

interface FlipCardProps {
  card: Card;
  division: DivisionKey;
  divisionIcon: LucideIcon;
  scale: number;
}

function FlipCard({ card, division, divisionIcon: Icon, scale }: FlipCardProps) {
  // Actual card dimensions at the current responsive scale
  const cardW = CARD_W * scale;
  const cardH = CARD_H * scale;
  // Positions are stored as ratios (0–1); convert to real pixels
  const left = card.pos.x * (BASE_W * scale) - cardW / 2;
  const top  = card.pos.y * (BASE_H * scale) - cardH / 2;

  const borderColor = card.isSelected
    ? '#F4B400'
    : 'rgba(244,180,0,0.32)';
  const shadow = card.isSelected
    ? '0 0 40px rgba(244,180,0,0.35)'
    : '0 6px 22px rgba(0,0,0,0.55)';

  return (
    <div
      style={{
        position:   'absolute',
        width:      cardW,
        height:     cardH,
        left,
        top,
        opacity:    card.opacity,
        transform:  `scale(${card.scale}) rotate(${card.rot}deg)`,
        zIndex:     card.zIndex,
        transition: [
          `left ${card.tdur} cubic-bezier(0.4,0,0.2,1)`,
          `top ${card.tdur} cubic-bezier(0.4,0,0.2,1)`,
          `opacity ${card.tdur} ease`,
          `transform ${card.tdur} cubic-bezier(0.34,1.56,0.64,1)`,
        ].join(', '),
      }}
    >
      {/* Content wrapper — renders card art at base size then scales it
          down so all internal proportions (icons, text, borders) match
          the desktop design at every screen size. */}
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          perspective: 900,
          position: 'relative',
        }}
      >
        {/* flip container */}
        <div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.9s cubic-bezier(0.4,0,0.2,1)',
            transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'relative',
          }}
        >
          {/* Front – tarot card back */}
          <div
            style={{
              ...faceStyle,
              borderRadius: 14,
              backgroundColor: '#161616',
              border: `2px solid ${borderColor}`,
              boxShadow: shadow,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              flexDirection: 'column',
              padding: '10px 8px',
            }}
          >
            {/* inner frame */}
            <div
              style={{
                position: 'absolute',
                inset: 6,
                border: '1px solid rgba(244,180,0,0.22)',
                borderRadius: 9,
                pointerEvents: 'none',
              }}
            />
            {/* top label */}
            <span style={tarotLabelStyle}>BVOICE</span>

            {/* center emblem */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(244,180,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Radio size={22} style={{ color: '#F4B400', opacity: 0.85 }} strokeWidth={1.5} />
              </div>
              <div style={{ width: 26, height: 1, backgroundColor: 'rgba(244,180,0,0.4)' }} />
            </div>

            {/* bottom label */}
            <span style={tarotLabelStyle}>RADIO</span>
          </div>

          {/* Back – revealed division result */}
          <div
            style={{
              ...faceStyle,
              borderRadius: 14,
              backgroundColor: '#1A1A1A',
              border: '2px solid #F4B400',
              boxShadow: '0 0 40px rgba(244,180,0,0.35)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              flexDirection: 'column',
              padding: '12px 10px',
              gap: 5,
            }}
          >
            {/* inner frame */}
            <div
              style={{
                position: 'absolute',
                inset: 6,
                border: '1px solid rgba(244,180,0,0.28)',
                borderRadius: 9,
                pointerEvents: 'none',
              }}
            />
            {card.isFlipped && (
              <>
                <span style={{ ...tarotLabelStyle, marginBottom: 2 }}>BVOICE RADIO</span>

                <div
                  style={{
                    backgroundColor: '#F4B400',
                    borderRadius: 10,
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} className="text-black" strokeWidth={2.5} />
                </div>

                <span
                  style={{
                    color: '#F4B400',
                    fontWeight: 800,
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textAlign: 'center',
                    lineHeight: 1.25,
                  }}
                >
                  {division.toUpperCase()}
                </span>

                <div style={{ width: 24, height: 1, backgroundColor: 'rgba(244,180,0,0.4)', margin: '2px 0' }} />

                <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 10, textAlign: 'center' }}>
                  Congratulations!
                </span>
                <span style={{ color: '#9CA3AF', fontSize: 8.5, textAlign: 'center', lineHeight: 1.35 }}>
                  You have successfully passed the interview.
                </span>
                <span style={{ color: '#9CA3AF', fontSize: 8.5, textAlign: 'center', lineHeight: 1.35 }}>
                  Welcome to the{' '}
                  <span style={{ color: '#F4B400', fontWeight: 700 }}>
                    {division} Division
                  </span>
                  .
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const faceStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const tarotLabelStyle: React.CSSProperties = {
  color: 'rgba(244,180,0,0.7)',
  fontWeight: 700,
  fontSize: 8,
  letterSpacing: '0.22em',
  textAlign: 'center',
};
