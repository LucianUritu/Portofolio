import { ScrollAnimator } from "../animations/ScrollAnimator.js";
import { MacbookScene } from "../scenes/MacbookScene.js";
import { Dom } from "../utils/dom.js";
import { PortfolioRenderer } from "./PortfolioRenderer.js";

export class PortfolioApp {
  constructor(profile) {
    this.profile = profile;
    this.renderer = new PortfolioRenderer(profile);
    this.scrollAnimator = new ScrollAnimator();
    this.macbookScene = null;
  }

  mount() {
    this.renderer.render();
    this.startMacbookScene();
    this.bindJumpMenu();
    this.bindScrollProgress();
    this.scrollAnimator.observeAll();
  }

  startMacbookScene() {
    const canvas = Dom.select("#macbookScene");
    this.macbookScene = new MacbookScene(canvas);
    this.macbookScene.start();
  }

  bindJumpMenu() {
    const button = Dom.select("#jumpButton");
    const list = Dom.select("#jumpList");

    button.addEventListener("click", () => {
      const isOpen = list.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    list.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        list.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      });
    });
  }

  bindScrollProgress() {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      this.macbookScene?.setScrollProgress(progress);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }
}
