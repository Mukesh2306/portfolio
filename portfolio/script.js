// ---------------------------------------------------
// Footer year
// ---------------------------------------------------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileNav.hidden = isOpen;
  navToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
});

// close mobile nav after choosing a link
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    mobileNav.hidden = true;
  });
});

// ---------------------------------------------------
// Scroll reveal (respects prefers-reduced-motion)
// ---------------------------------------------------
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('[data-reveal]');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}

// ---------------------------------------------------
// Active nav link on scroll
// ---------------------------------------------------
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.primary-nav .nav-link[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => navObserver.observe(section));
}

// ---------------------------------------------------
// Contact form validation (static site: falls back to mailto)
// ---------------------------------------------------
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

function setError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}Error`);
  const row = document.getElementById(fieldId).closest('.form-row');
  errorEl.textContent = message;
  row.classList.toggle('has-error', Boolean(message));
}

function validate() {
  let valid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name) {
    setError('name', 'Please enter your name.');
    valid = false;
  } else {
    setError('name', '');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    setError('email', 'Please enter your email.');
    valid = false;
  } else if (!emailPattern.test(email)) {
    setError('email', 'Please enter a valid email address.');
    valid = false;
  } else {
    setError('email', '');
  }

  if (!message || message.length < 10) {
    setError('message', 'Please enter a message of at least 10 characters.');
    valid = false;
  } else {
    setError('message', '');
  }

  return { valid, name, email, message };
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { valid, name, email, message } = validate();
  if (!valid) {
    status.textContent = '';
    return;
  }

  // This is a static site with no backend. We open a pre-filled email
  // as a working fallback. Swap this for a form backend (see README)
  // once one is wired up.
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:mukeshprabakaran2004@gmail.com?subject=${subject}&body=${body}`;

  status.textContent = 'Opening your email client to send this message…';
  form.reset();
});
