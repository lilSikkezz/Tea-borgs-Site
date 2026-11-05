const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');
const navItems = [...document.querySelectorAll('.nav-link')];
const progressBar = document.querySelector('#progressBar');

// Mobile navigation
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Deschide meniul' : 'Închide meniul');
  navLinks.classList.toggle('open', !isOpen);
});

navItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Deschide meniul');
  });
});

// Reveal elements as they enter the viewport
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

// Active navigation item follows the visible section
const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-38% 0px -52% 0px' });
sections.forEach(section => sectionObserver.observe(section));

// Reading progress indicator
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Small count-up effect for the intro numbers
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const start = performance.now();
    const duration = 850;
    function animate(now) {
      const amount = Math.min((now - start) / duration, 1);
      element.textContent = Math.round(target * (1 - Math.pow(1 - amount, 3)));
      if (amount < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    counterObserver.unobserve(element);
  });
}, { threshold: 0.7 });
counters.forEach(counter => counterObserver.observe(counter));

// Project category filters
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    projectCards.forEach(card => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

// Footer year
 document.querySelector('#year').textContent = new Date().getFullYear();
