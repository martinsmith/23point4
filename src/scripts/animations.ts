import { animate, inView, stagger } from 'motion';

type RevealElement = HTMLElement & { dataset: { reveal?: string } };

// Bail if reduced motion is preferred — CSS keeps elements visible as fallback
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
} else {
  const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const DURATION = 0.8;
  const MARGIN = '-40px 0px';

  function reveal(el: RevealElement, delay = 0): void {
    const isFade = el.dataset.reveal === 'fade';
    inView(el, () => {
      animate(
        el,
        isFade
          ? { opacity: [0, 1] }
          : { opacity: [0, 1], transform: ['translateY(48px)', 'translateY(0px)'] },
        { duration: DURATION, delay, easing: EASING },
      );
      return false;
    }, { margin: MARGIN });
  }

  function revealGroup(els: RevealElement[]): void {
    if (!els.length) return;
    inView(els[0], () => {
      els.forEach((el, i) => {
        const isFade = el.dataset.reveal === 'fade';
        animate(
          el,
          isFade
            ? { opacity: [0, 1] }
            : { opacity: [0, 1], transform: ['translateY(48px)', 'translateY(0px)'] },
          { duration: DURATION, delay: stagger(0.18)(i, els.length), easing: EASING },
        );
      });
      return false;
    }, { margin: MARGIN });
  }

  const all = Array.from(document.querySelectorAll<RevealElement>('[data-reveal]'));

  const groups = new Map<Element | null, RevealElement[]>();
  all.forEach((el) => {
    const key = el.parentElement;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(el);
  });

  groups.forEach((siblings) => {
    if (siblings.length === 1) {
      reveal(siblings[0]);
    } else {
      revealGroup(siblings);
    }
  });
}
