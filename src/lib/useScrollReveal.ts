import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PREFERS_REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Options {
  delay?: number;
  stagger?: number;
  staggerSelector?: string;
  start?: string;
  y?: number;
  duration?: number;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: Options = {},
) {
  const ref = useRef<T>(null);

  const {
    delay = 0,
    stagger = 0,
    staggerSelector,
    start = 'top 85%',
    y = 30,
    duration = 0.65,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = staggerSelector
      ? gsap.utils.toArray(el.querySelectorAll(staggerSelector))
      : [el];

    if (PREFERS_REDUCED) {
      gsap.set(targets, {
        opacity: 1,
        y: 0,
        clearProps: 'all',
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power2.out',
          stagger,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      );

      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, [delay, stagger, staggerSelector, start, y, duration]);

  return ref;
}