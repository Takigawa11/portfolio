const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav.classList.toggle('open');
});

document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
  });
});

const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav__link');

const setActive = () => {
  let current = 'home';
  const y = window.scrollY + 120;
  sections.forEach(sec => {
    if (y >= sec.offsetTop) current = sec.id;
  });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
};
window.addEventListener('scroll', setActive);
setActive();

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill').forEach(el => observer.observe(el));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const heroTitle = document.querySelector('.hero__title');
if (heroTitle) {
  let i = 0;
  const wrapChars = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        [...child.textContent].forEach(ch => {
          if (ch === ' ') {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          const span = document.createElement('span');
          span.className = 'char';
          span.style.setProperty('--d', i++);
          span.textContent = ch;
          frag.appendChild(span);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        wrapChars(child);
      }
    });
  };
  wrapChars(heroTitle);
}

/* Левитация + наклон карточек3D:
   курсор в углу → карточка поворачивается на максимальный угол в его сторону */
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const MAX_ANGLE = 18;

  document.querySelectorAll('.project, .contact__item, .about__info, .hero__card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = 'transform .25s cubic-bezier(.2,.8,.3,1)';
      card.style.transform =
        'perspective(950px) rotateX(' + (-py * MAX_ANGLE).toFixed(2) + 'deg) ' +
        'rotateY(' + (px * MAX_ANGLE).toFixed(2) + 'deg)';
    });

    card.addEventListener('pointerleave', () => {
      card.style.transition = 'transform .55s cubic-bezier(.34,1.4,.5,1)';
      card.style.transform = '';
    });
  });
}
