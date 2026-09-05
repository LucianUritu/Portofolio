import { AwardBadge } from "../components/AwardBadge.js";
import { CapabilityPanel } from "../components/CapabilityPanel.js";
import { ProjectCard } from "../components/ProjectCard.js";
import { TimelineItem } from "../components/TimelineItem.js";
import { Dom } from "../utils/dom.js";

export class PortfolioRenderer {
  constructor(profile) {
    this.profile = profile;
  }

  render() {
    this.renderCollection("#projectsGrid", this.profile.projects, (project, index) => new ProjectCard(project, index).render());
    this.renderCollection("#capabilityGrid", this.profile.capabilities, (capability) => new CapabilityPanel(capability).render());
    this.renderCollection("#timelineList", this.profile.timeline, (entry) => new TimelineItem(entry).render());
    this.renderCollection("#awardsGrid", this.profile.awards, (award) => new AwardBadge(award).render());
  }

  renderCollection(selector, items, factory) {
    const root = Dom.select(selector);
    Dom.clear(root);
    items.forEach((item, index) => root.append(factory(item, index)));
  }
}
