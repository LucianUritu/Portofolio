import { Dom } from "../utils/dom.js";
import { safeExternalUrl } from "../utils/sanitize.js";

export class ProjectCard {
  constructor(project, index) {
    this.project = project;
    this.index = index;
  }

  render() {
    const card = Dom.create("article", `project-card reveal accent-${this.project.accent}`);
    card.append(this.renderMeta(), this.renderBody(), this.renderStack(), this.renderAction());
    card.addEventListener("pointermove", (event) => this.updatePointerLight(event, card));
    return card;
  }

  renderMeta() {
    const meta = Dom.create("div", "project-meta");
    meta.append(
      Dom.create("span", "project-number", String(this.index + 1).padStart(2, "0")),
      Dom.create("span", "project-type", this.project.type)
    );
    return meta;
  }

  renderBody() {
    const body = Dom.create("div", "project-body");
    body.append(
      Dom.create("p", "project-period", this.project.period),
      Dom.create("h3", "", this.project.title),
      Dom.create("p", "project-description", this.project.description),
      Dom.create("p", "project-impact", this.project.impact)
    );
    return body;
  }

  renderStack() {
    const stack = Dom.create("div", "project-stack");
    this.project.stack.forEach((item) => stack.append(Dom.create("span", "", item)));
    return stack;
  }

  renderAction() {
    const url = safeExternalUrl(this.project.link);
    const action = Dom.create(url ? "a" : "span", "project-action", url ? "Open repository" : "Launch pending");
    if (url) {
      action.href = url;
      action.target = "_blank";
      action.rel = "noreferrer";
    }
    return action;
  }

  updatePointerLight(event, card) {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }
}
