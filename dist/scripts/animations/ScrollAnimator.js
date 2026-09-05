export class ScrollAnimator {
  constructor() {
    this.observer = new IntersectionObserver((entries) => this.handleEntries(entries), {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12
    });
  }

  observeAll(selector = ".reveal") {
    document.querySelectorAll(selector).forEach((element) => this.observer.observe(element));
  }

  handleEntries(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      this.observer.unobserve(entry.target);
    });
  }
}
