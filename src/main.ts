import './styles/global.css';
import './scripts/animations';
import { funnyQuotes, attributionLabels, type Quote } from './data/quotes';

// ── Header: mobile menu toggle ─────────────────────────────
const toggle = document.querySelector<HTMLButtonElement>('.site-header__toggle');
const nav = document.getElementById('primary-nav');
const header = document.querySelector('.site-header');

toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('is-open');
  header?.classList.toggle('is-open');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
    header?.classList.remove('is-open');
  });
});

// ── Header: solid background on scroll ─────────────────────
const onScroll = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Footer: email obfuscation ──────────────────────────────
const emailLink = document.querySelector<HTMLAnchorElement>('.site-footer__email');
if (emailLink) {
  const { u, d, t } = emailLink.dataset;
  const email = `${u}@${d}.${t}`;
  emailLink.href = `mailto:${email}`;
  const span = emailLink.querySelector('.site-footer__email-text');
  if (span) span.textContent = email;
}

// ── Footer: dynamic year ───────────────────────────────────
const yearEl = document.getElementById('js-year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ── Testimonials: rotating quotes ──────────────────────────
function shuffle(arr: Quote[]): Quote[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let pool = shuffle(funnyQuotes);
let poolIndex = 0;

function getNextQuotes(count: number): Quote[] {
  const result: Quote[] = [];
  for (let i = 0; i < count; i++) {
    if (poolIndex >= pool.length) {
      pool = shuffle(funnyQuotes);
      poolIndex = 0;
    }
    result.push(pool[poolIndex++]);
  }
  return result;
}

function renderCards(cards: NodeListOf<Element>, data: Quote[]): void {
  cards.forEach((card, i) => {
    const q = data[i];
    const p = card.querySelector('.testimonials__quote p');
    const role = card.querySelector('.testimonials__role');
    if (p) p.textContent = `"${q.quote}"`;
    if (role) role.textContent = attributionLabels[Math.floor(Math.random() * attributionLabels.length)];
  });
}

function rotateQuotes(): void {
  const cards = document.querySelectorAll('#rotating-quotes .testimonials__card');
  cards.forEach((c) => c.classList.add('is-fading'));
  setTimeout(() => {
    renderCards(cards, getNextQuotes(3));
    cards.forEach((c) => c.classList.remove('is-fading'));
  }, 600);
}

const quoteCards = document.querySelectorAll('#rotating-quotes .testimonials__card');
renderCards(quoteCards, getNextQuotes(3));

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(rotateQuotes, 12000);
}

// ── Contact: form feedback ─────────────────────────────────
const params = new URLSearchParams(window.location.search);
const formStatus = params.get('form');

if (formStatus === 'success' || formStatus === 'error') {
  const feedback = document.querySelector(`.contact__feedback--${formStatus}`);
  const form = document.querySelector('.contact__form');
  if (feedback) feedback.removeAttribute('hidden');
  if (formStatus === 'success' && form) form.setAttribute('hidden', '');
}
