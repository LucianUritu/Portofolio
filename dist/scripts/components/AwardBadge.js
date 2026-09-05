import { Dom } from "../utils/dom.js";

export class AwardBadge {
  constructor(award) {
    this.award = award;
  }

  render() {
    const badge = Dom.create("article", "award-badge reveal");
    badge.append(Dom.create("h3", "", this.award.title), Dom.create("p", "", this.award.detail));
    return badge;
  }
}
