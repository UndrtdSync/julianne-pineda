const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.split').forEach(el => {
  const text = el.textContent.trim();
  el.textContent = '';
  text.split(' ').forEach(word => {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = word;
    el.appendChild(span);
  });
});

const lastPlay = new WeakMap();
const wordIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) {
      e.target.querySelectorAll('.word').forEach(w => w.classList.remove('play'));
      return;
    }
    const now = performance.now();
    if (now - (lastPlay.get(e.target) || 0) < 1200) return;
    lastPlay.set(e.target, now);
    const words = e.target.querySelectorAll('.word');
    requestAnimationFrame(() => {
      words.forEach((w, i) => {
        w.classList.remove('play');
        w.style.animationDelay = Math.min(i * 0.03, 0.7) + 's';
        w.classList.add('play');
      });
    });
  });
}, { threshold: 0.15 });
document.querySelectorAll('.split').forEach(el => wordIO.observe(el));

const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealIO.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
  });
});

const links = document.querySelectorAll('.nav-links a');
const setActive = () => {
  let current = 'home';
  document.querySelectorAll('main section, header').forEach(sec => {
    if (sec.getBoundingClientRect().top < 130) current = sec.id || current;
  });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
};
window.addEventListener('scroll', setActive, { passive: true });
setActive();
