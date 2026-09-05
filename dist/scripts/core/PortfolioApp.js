import { BackgroundField } from "../animations/BackgroundField.js";
import { ScrollAnimator } from "../animations/ScrollAnimator.js";
import { TechConstellation } from "../scenes/TechConstellation.js";
import { Dom } from "../utils/dom.js";
import { PortfolioRenderer } from "./PortfolioRenderer.js";

export class PortfolioApp {
  constructor(profile) {
    this.profile = profile;
    this.renderer = new PortfolioRenderer(profile);
    this.scrollAnimator = new ScrollAnimator();
  }

  mount() {
    this.renderer.render();
    this.startBackground();
    this.startTechScene();
    this.scrollAnimator.observeAll();
  }

  startBackground() {
    const canvas = Dom.select("#fieldCanvas");
    new BackgroundField(canvas).start();
  }

  startTechScene() {
    const canvas = Dom.select("#techScene");
    new TechConstellation(canvas).start();
  }
}
