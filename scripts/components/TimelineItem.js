import { Dom } from "../utils/dom.js";

export class TimelineItem {
  constructor(entry) {
    this.entry = entry;
  }

  render() {
    const item = Dom.create("article", "timeline-item reveal");
    item.append(
      Dom.create("span", "timeline-year", this.entry.year),
      Dom.create("h3", "", this.entry.title),
      Dom.create("p", "", this.entry.detail)
    );
    return item;
  }
}
