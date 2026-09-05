import { Dom } from "../utils/dom.js";

export class CapabilityPanel {
  constructor(capability) {
    this.capability = capability;
  }

  render() {
    const panel = Dom.create("article", "capability-panel reveal");
    panel.append(Dom.create("h3", "", this.capability.title), this.renderItems());
    return panel;
  }

  renderItems() {
    const list = Dom.create("div", "capability-list");
    this.capability.items.forEach((item) => list.append(Dom.create("span", "", item)));
    return list;
  }
}
