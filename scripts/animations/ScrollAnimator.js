export class ScrollAnimator {
  observeAll(selector = '.reveal') {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = [...document.querySelectorAll(selector)];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-waiting');
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    elements.forEach((element) => {
      // Content is only hidden after the observer is ready; no-JS stays readable.
      element.classList.add('is-waiting');
      observer.observe(element);
    });
  }
}
