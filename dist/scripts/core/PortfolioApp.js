import { ScrollAnimator } from '../animations/ScrollAnimator.js';
import { ProjectDemos, projectSymbols } from '../components/ProjectDemos.js';
import { Dom } from '../utils/dom.js';
import { safeExternalUrl } from '../utils/sanitize.js';
import { arrowIcon } from '../utils/icons.js';

export class PortfolioApp {
  constructor(profile) {
    this.profile = profile;
    this.selected = -1;
    this.cleanupDemo = null;
  }

  mount() {
    this.renderProjects();
    this.bindTileMotion();
    this.renderSkills();
    this.selectProject(0, false);
    new ScrollAnimator().observeAll();
    document.getElementById('copyrightYear').textContent = new Date().getFullYear();
    document.addEventListener('keydown', () => document.body.classList.add('keyboard-input'));
    document.addEventListener('pointerdown', () => document.body.classList.remove('keyboard-input'));
  }

  renderProjects() {
    const artifacts = Dom.select('#artifactGrid');
    const index = Dom.select('#projectIndex');
    const verbs = ['Build', 'Compute', 'Connect', 'Explore', 'Navigate', 'Solve'];
    const rotations = [-8, 4, -4, 5, -5, 8];
    this.profile.projects.forEach((project, i) => {
      const tile = Dom.create('button', 'artifact');
      tile.type = 'button';
      tile.style.setProperty('--i', i);
      tile.style.setProperty('--r', `${rotations[i]}deg`);
      tile.setAttribute('aria-label', `Explore ${project.title}`);
      tile.innerHTML = projectSymbols[i];
      tile.append(Dom.create('span', '', verbs[i]));
      tile.addEventListener('click', (event) => {
        this.selectProject(i, event.detail !== 0);
        Dom.select('#work').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches || event.detail === 0 ? 'instant' : 'smooth' });
        this.choices[i].focus({ preventScroll: true });
      });
      const float = Dom.create('div', 'artifact-float');
      float.style.setProperty('--i', i);
      float.append(tile);
      artifacts.append(float);

      const button = Dom.create('button', 'project-choice');
      button.type = 'button';
      button.id = `project-choice-${i}`;
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-controls', 'demoSurface projectDetail');
      const text = Dom.create('span');
      text.append(Dom.create('h3', '', project.title), Dom.create('small', '', project.label));
      const arrow = arrowIcon('up-right', 'choice-arrow');
      button.append(text, arrow);
      button.addEventListener('click', (event) => {
        this.selectProject(i, event.detail !== 0);
        if (event.detail !== 0 && matchMedia('(max-width: 800px)').matches) {
          Dom.select('#demoSurface').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        }
      });
      index.append(button);
    });
    this.choices = [...index.querySelectorAll('button')];
  }

  bindTileMotion() {
    const stage = Dom.select('.hero-playground');
    const button = Dom.select('#motionToggle');
    let paused = false;
    let visible = true;
    const sync = () => stage.classList.toggle('is-motion-paused', paused || !visible || document.hidden);
    button.addEventListener('click', () => {
      paused = !paused;
      button.setAttribute('aria-pressed', String(paused));
      button.setAttribute('aria-label', paused ? 'Resume tile motion' : 'Pause tile motion');
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      observer.observe(stage);
    }
  }

  selectProject(i, animate = true) {
    if (this.selected === i) return;
    const project = this.profile.projects[i];
    this.selected = i;
    this.choices.forEach((button, n) => button.setAttribute('aria-pressed', String(n === i)));
    this.cleanupDemo?.();
    const surface = Dom.select('#demoSurface');
    surface.classList.remove('is-entering');
    surface.setAttribute('aria-labelledby', `project-choice-${i}`);
    this.cleanupDemo = ProjectDemos.mount(surface, i);
    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      surface.animate([{ opacity: 0.35, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    }
    const detail = Dom.select('#projectDetail');
    const heading = Dom.create('div', 'detail-heading');
    heading.append(Dom.create('h3', '', project.title));
    const url = safeExternalUrl(project.link);
    if (url) {
      const link = Dom.create('a', 'text-link', 'Repository');
      link.append(arrowIcon());
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      heading.append(link);
    }
    const stack = Dom.create('div', 'detail-stack', project.stack.join(' / '));
    detail.replaceChildren(heading, Dom.create('p', '', project.detail), stack);
    if (project.report) {
      const report = Dom.create('div', 'project-report');
      const summary = Dom.create('div');
      const read = Dom.create('a', 'text-link', 'Read report');
      read.href = encodeURI(project.report.file);
      read.target = '_blank';
      read.rel = 'noopener noreferrer';
      read.setAttribute('aria-label', `Read ${project.title} project report (PDF)`);
      read.append(arrowIcon());
      summary.append(read, Dom.create('p', 'report-format', `PDF, ${project.report.pages} pages`));
      const download = Dom.create('a', 'text-link report-download', 'Download PDF');
      download.href = read.getAttribute('href');
      download.download = project.report.downloadName;
      download.setAttribute('aria-label', `Download ${project.title} project report`);
      download.append(arrowIcon('down'));
      report.append(summary, download);
      detail.append(report);
    }
    if (!url) detail.append(Dom.create('p', 'detail-note', 'Developed with Maastricht University’s Open Science in Education team.'));
  }

  renderSkills() {
    const root = Dom.select('#skillsGrid');
    this.profile.skills.forEach((group) => {
      const item = Dom.create('div', 'skill-group');
      item.append(Dom.create('h4', '', group.group), Dom.create('p', '', group.items.join(', ')));
      root.append(item);
    });
  }
}
