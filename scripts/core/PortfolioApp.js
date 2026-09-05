import { ScrollAnimator } from "../animations/ScrollAnimator.js";
import { MacbookStage } from "../scenes/MacbookStage.js";
import { Dom } from "../utils/dom.js";
import { PortfolioRenderer } from "./PortfolioRenderer.js";

export class PortfolioApp {
  constructor(profile) {
    this.profile = profile;
    this.renderer = new PortfolioRenderer(profile);
    this.scrollAnimator = new ScrollAnimator();
    this.macbookStage = null;
  }

  mount() {
    this.renderer.render();
    this.startMacbookStage();
    this.bindJumpMenu();
    this.bindCvPreview();
    this.bindScrollProgress();
    this.scrollAnimator.observeAll();
  }

  startMacbookStage() {
    const stage = Dom.select("#macbookStage");
    this.macbookStage = new MacbookStage(stage);
    this.macbookStage.start();
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

  bindCvPreview() {
    const dialog = Dom.select("#cvDialog");
    const openButtons = [Dom.select("#cvPreviewButton"), Dom.select("#cvPreviewMenu")];
    const closeButton = Dom.select("#cvCloseButton");

    openButtons.forEach((button) => {
      button.addEventListener("click", () => dialog.showModal());
    });

    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  bindScrollProgress() {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      this.macbookStage?.setScrollProgress(progress);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }
}
