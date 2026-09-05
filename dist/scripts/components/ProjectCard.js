import { Dom } from "../utils/dom.js";
import { safeExternalUrl } from "../utils/sanitize.js";

export class ProjectCard {
  constructor(project, index) {
    this.project = project;
    this.index = index;
  }

  render() {
    const card = Dom.create("article", "project-card reveal");
    card.append(this.renderMeta(), this.renderBody(), this.renderStack(), this.renderAction());
    return card;
  }

  renderMeta() {
    const meta = Dom.create("div", "project-meta");
    meta.append(
      Dom.create("span", "project-number", String(this.index + 1).padStart(2, "0")),
      Dom.create("span", "project-type", this.project.label)
    );
    return meta;
  }

  renderBody() {
    const body = Dom.create("div", "project-body");
    body.append(
      Dom.create("h3", "", this.project.title),
      Dom.create("p", "project-description", this.project.detail)
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
    const action = Dom.create(url ? "a" : "span", "project-action", url ? "Open repository" : "Launching soon");
    if (url) {
      action.href = url;
      action.target = "_blank";
      action.rel = "noreferrer";
    }
    return action;
  }
}
