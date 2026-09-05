import { Dom } from "../utils/dom.js";

export class CapabilityPanel {
  constructor(skillGroup) {
    this.skillGroup = skillGroup;
  }

  render() {
    const panel = Dom.create("article", "skill-panel reveal");
    panel.append(Dom.create("h3", "", this.skillGroup.group), this.renderItems());
    return panel;
  }

  renderItems() {
    const list = Dom.create("div", "skill-list");
    this.skillGroup.items.forEach((item) => list.append(Dom.create("span", "", item)));
    return list;
  }
}
