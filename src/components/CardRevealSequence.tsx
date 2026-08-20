import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { LucideIcon } from 'lucide-react';
import { DIVISION_ICONS } from '@/lib/divisions';
import type { DivisionKey } from '@/lib/divisions';

// ── Container geometry (vertical tarot cards) ─────────────────────────────
// BASE_* are the reference design dimensions (desktop at scale = 1). The
// whole stage is scaled down as one unit for smaller screens (see render),
// so every animated position below is computed in this fixed BASE space.

const BASE_W = 580;
const BASE_H = 440;
const CARD_W = 130;
const CARD_H = 190;
const GAP_X  = 22;
const GAP_Y  = 26;

// The card that always ends up "drawn" at the end of the shuffle.
const SELECTED_ID = 1;

type Pos = { x: number; y: number };

// Slot positions as RATIOS (0–1) of BASE_W / BASE_H so they can be
// multiplied by the stage dimensions at any screen size.
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

// Convert a slot ratio into the pixel offset (in BASE space) a card's
// top-left corner needs so the card is centered on that slot.
function slotPx(ratio: Pos): Pos {
  return { x: ratio.x * BASE_W - CARD_W / 2, y: ratio.y * BASE_H - CARD_H / 2 };
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

const PREFERS_REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Props ─────────────────────────────────────────────────────────────────

interface Props {
  division: DivisionKey;
  onRevealComplete?: () => void;
}

// ── Main component ────────────────────────────────────────────────────────

export default function CardRevealSequence({ division, onRevealComplete }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scale, setScale] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const w = stageRef.current?.clientWidth ?? BASE_W;
      setScale(Math.min(1, (w - 32) / BASE_W));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useLayoutEffect(() => {
    const refs = cardRefs.current as HTMLDivElement[];
    const flips = flipRefs.current as HTMLDivElement[];

    // Reduced motion: skip straight to the final revealed state.
    if (PREFERS_REDUCED) {
      const centerPx = slotPx(CENTER_RATIO);
      gsap.set(refs, { opacity: (i: number) => (i === SELECTED_ID ? 1 : 0) });
      gsap.set(refs[SELECTED_ID], { x: centerPx.x, y: centerPx.y, scale: 1.7, zIndex: 20 });
      gsap.set(flips[SELECTED_ID], { rotationY: 180 });
      setSelectedId(SELECTED_ID);
      onRevealComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      const shuffleRounds = makeShuffleRounds(5);
      const tl = gsap.timeline();
      const centerPx = slotPx(CENTER_RATIO);

      // Starting state: cards sit in a fanned stack at center, hidden.
      gsap.set(refs, {
        x:      (i: number) => centerPx.x + (i - 2.5) * 3,
        y:      (i: number) => centerPx.y + (i - 2.5) * -2,
        rotation: (i: number) => (i - 2.5) * 2.2,
        scale:  1,
        opacity: 0,
        zIndex: (i: number) => i + 1,
      });

      // Phase 0 – the fanned deck materializes at center
      tl.to(refs, { opacity: 1, duration: 0.4, stagger: 0.05 }, 0);

      // Phase 1 – deal the stack out to the 6 grid slots
      tl.to(refs, {
        x: (i: number) => slotPx(SLOTS_RATIO[i]).x,
        y: (i: number) => slotPx(SLOTS_RATIO[i]).y,
        rotation: 0,
        duration: 0.55,
        stagger: 0.09,
        ease: 'power2.out',
      }, 0.45);

      // Phase 2 – shuffle rounds (with a gentle tilt for a tarot-riffle feel)
      shuffleRounds.forEach((round, ri) => {
        const t = 1.55 + ri * 0.68;
        tl.to(refs, {
          x: (i: number) => slotPx(SLOTS_RATIO[round[i]]).x,
          y: (i: number) => slotPx(SLOTS_RATIO[round[i]]).y,
          rotation: () => Math.round(Math.random() * 6) - 3,
          duration: 0.58,
          ease: 'power2.inOut',
        }, t);
        tl.set(refs, {
          zIndex: (i: number) => (round[i] < 3 ? i + 1 : i + 7),
        }, t);
      });

      const afterShuffle = 1.55 + shuffleRounds.length * 0.68;

      // Phase 3 – settle the tilt back to flat
      tl.to(refs, { rotation: 0, duration: 0.45, ease: 'power2.out' }, afterShuffle + 0.25);

      // Phase 4 – select the drawn card, lift it to center & scale up
      tl.to(refs[SELECTED_ID], {
        x: centerPx.x,
        y: centerPx.y,
        scale: 1.7,
        opacity: 1,
        zIndex: 20,
        duration: 0.7,
        ease: 'power2.inOut',
      }, afterShuffle + 0.4);
      tl.to(refs.filter((_, i) => i !== SELECTED_ID), {
        opacity: 0.12,
        scale: 0.8,
        duration: 0.7,
        ease: 'power2.inOut',
      }, afterShuffle + 0.4);
      tl.call(() => setSelectedId(SELECTED_ID), [], afterShuffle + 0.4);

      // Phase 5 – flip the selected card
      tl.to(flips[SELECTED_ID], {
        rotationY: 180,
        duration: 0.9,
        ease: 'power2.inOut',
      }, afterShuffle + 1.25);

      // Fire once the flip has visibly revealed the division (~90° past start)
      tl.call(() => onRevealComplete?.(), [], afterShuffle + 1.25 + 0.5);
    }, stageRef);

    return () => ctx.revert();
  // Run once on mount; division is stable in this flow
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Icon = DIVISION_ICONS[division] ?? DIVISION_ICONS['Marketing'];
  const stageW = BASE_W * scale;
  const stageH = BASE_H * scale;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Card stage */}
      <div
        ref={stageRef}
        style={{ width: '100%', height: stageH + 8, position: 'relative' }}
      >
        {/* Outer box reserves the real (shrunk) layout space so narrow
            viewports never get a horizontal-scroll from the fixed-size
            inner stage below. */}
        <div
          style={{
            width: stageW,
            height: stageH,
            position: 'relative',
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          {/* Inner stage is authored at full BASE size (so all the GSAP
              pixel math stays simple) and visually scaled to fit the
              outer box, anchored at top-left to match its dimensions. */}
          <div
            style={{
              width: BASE_W,
              height: BASE_H,
              position: 'relative',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {SLOTS_RATIO.map((_, id) => (
              <div
                key={id}
                ref={(el) => { cardRefs.current[id] = el; }}
                style={{
                  position: 'absolute',
                  width: CARD_W,
                  height: CARD_H,
                  left: 0,
                  top: 0,
                  zIndex: id + 1,
                  willChange: 'transform, opacity',
                }}
              >
                <FlipCardFace
                  flipRef={(el) => { flipRefs.current[id] = el; }}
                  division={division}
                  divisionIcon={Icon}
                  isSelected={selectedId === id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Individual flip card face ────────────────────────────────────────────

interface FlipCardFaceProps {
  flipRef: (el: HTMLDivElement | null) => void;
  division: DivisionKey;
  divisionIcon: LucideIcon;
  isSelected: boolean;
}

function FlipCardFace({ flipRef, division, divisionIcon: Icon, isSelected }: FlipCardFaceProps) {
  const borderColor = isSelected ? '#F4B400' : 'rgba(244,180,0,0.32)';
  const shadow = isSelected
    ? '0 0 40px rgba(244,180,0,0.35)'
    : '0 6px 22px rgba(0,0,0,0.55)';

  return (
    <div style={{ width: '100%', height: '100%', perspective: 900, position: 'relative' }}>
      {/* flip container — rotationY driven by GSAP */}
      <div
        ref={flipRef}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {/* Front – simple playing-card back */}
        <div
          style={{
            ...faceStyle,
            borderRadius: 14,
            backgroundColor: '#161616',
            border: `2px solid ${borderColor}`,
            boxShadow: shadow,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* outer inset line */}
          <div
            style={{
              position: 'absolute',
              inset: 6,
              border: '1px solid rgba(244,180,0,0.22)',
              borderRadius: 9,
              pointerEvents: 'none',
            }}
          />
          {/* inner inset line + crosshatch texture */}
          <div
            style={{
              position: 'absolute',
              inset: 12,
              border: '1px solid rgba(244,180,0,0.14)',
              borderRadius: 5,
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(244,180,0,0.07) 0px, rgba(244,180,0,0.07) 1px, transparent 1px, transparent 9px), ' +
                'repeating-linear-gradient(-45deg, rgba(244,180,0,0.07) 0px, rgba(244,180,0,0.07) 1px, transparent 1px, transparent 9px)',
              pointerEvents: 'none',
            }}
          />

          {/* corner wordmark */}
          <span
            style={{
              position: 'absolute',
              bottom: 8,
              right: 10,
              fontSize: 6.5,
              fontWeight: 600,
              letterSpacing: '0.03em',
              color: 'rgba(244,180,0,0.55)',
            }}
          >
            BVoice Radio
          </span>
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
