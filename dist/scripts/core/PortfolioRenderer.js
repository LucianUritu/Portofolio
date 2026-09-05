import { CapabilityPanel } from "../components/CapabilityPanel.js";
import { ProjectCard } from "../components/ProjectCard.js";
import { Dom } from "../utils/dom.js";

export class PortfolioRenderer {
  constructor(profile) {
    this.profile = profile;
  }

  render() {
    this.renderCollection("#projectsGrid", this.profile.projects, (project, index) => new ProjectCard(project, index).render());
    this.renderCollection("#skillsGrid", this.profile.skills, (skillGroup) => new CapabilityPanel(skillGroup).render());
  }

  renderCollection(selector, items, factory) {
    const root = Dom.select(selector);
    Dom.clear(root);
    items.forEach((item, index) => root.append(factory(item, index)));
  }
}
