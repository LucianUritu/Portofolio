const defaults = {
  name: "Lucian Uritu",
  headline: "I build fast, elegant software that feels alive.",
  bio: "Computer Science graduate focused on reliable web apps, refined interfaces, clean architecture, and practical automation.",
  about: "I like building the full path from idea to production: shaping the UX, modeling data, writing dependable code, and polishing the last interaction.",
  contactText: "I am open to software engineering roles, internships, freelance builds, and ambitious product ideas.",
  email: "lucian@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  photo: "photoMe.jpg",
  accent: "#27e0a3",
  years: "2+",
  projectsCount: "12",
  skills: ["TypeScript", "React", "Node.js", "Databases", "APIs", "Testing", "UI Motion", "Cloud fundamentals"],
  timeline: [
    "2026 | Portfolio rebuild - Designed a high-impact personal site with live admin editing.",
    "2025 | Computer Science - Built academic and personal projects across web, data, and systems.",
    "2024 | Product engineering - Practiced full-stack delivery from interface to deployment."
  ],
  projects: [
    {
      title: "Control Deck",
      tag: "Dashboard",
      description: "A responsive analytics interface with real-time-feeling metrics, command actions, and polished motion.",
      stack: "React, Charts, UX",
      link: "#contact",
      featured: true
    },
    {
      title: "API Forge",
      tag: "Backend",
      description: "Service architecture for clean endpoints, validation, persistence, and maintainable domain logic.",
      stack: "Node.js, REST, SQL",
      link: "#contact",
      featured: false
    },
    {
      title: "Automation Lab",
      tag: "Tools",
      description: "Workflow utilities that cut repetitive tasks into simple, reliable actions for real users.",
      stack: "JavaScript, Scripts, APIs",
      link: "#contact",
      featured: false
    }
  ]
};

const storageKey = "lucian-portfolio-admin-v1";
let state = loadState();

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return stored ? { ...defaults, ...stored } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function render() {
  document.documentElement.style.setProperty("--accent", state.accent || defaults.accent);
  document.title = `${state.name} - Software Engineer`;

  document.querySelectorAll("[data-field]").forEach((node) => {
    const key = node.dataset.field;
    if (state[key]) node.textContent = state[key];
  });

  const profilePhoto = document.querySelector("#profilePhoto");
  profilePhoto.src = state.photo || defaults.photo;
  profilePhoto.alt = `Portrait of ${state.name}`;

  document.querySelector("#emailLink").href = `mailto:${state.email}`;
  document.querySelector("#githubLink").href = state.github;
  document.querySelector("#linkedinLink").href = state.linkedin;

  renderProjects();
  renderSkills();
  renderTimeline();
  fillAdminForm();
}

function renderProjects() {
  const grid = document.querySelector("#projectsGrid");
  grid.innerHTML = "";

  state.projects.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card reveal";
    card.innerHTML = `
      <div class="project-top">
        <span class="project-index">0${index + 1}</span>
        <span class="project-tag">${project.featured ? "Featured" : escapeHtml(project.tag || "Project")}</span>
      </div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="project-stack">${project.stack.split(",").map((item) => `<span>${escapeHtml(item.trim())}</span>`).join("")}</div>
      <a class="project-link" href="${sanitizeUrl(project.link)}">View project</a>
    `;

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });

    grid.appendChild(card);
  });

  observeReveals();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sanitizeUrl(value) {
  const url = String(value || "#contact").trim();
  if (url.startsWith("#") || url.startsWith("mailto:")) return escapeHtml(url);
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? escapeHtml(parsed.href) : "#contact";
  } catch {
    return "#contact";
  }
}

function renderSkills() {
  const list = document.querySelector("#skillList");
  list.innerHTML = "";
  state.skills.forEach((skill, index) => {
    const level = 58 + ((index * 7) % 34);
    const row = document.createElement("div");
    row.className = "skill-line";
    row.innerHTML = `<span>${escapeHtml(skill)}</span><div class="skill-meter" style="--level:${level}%"></div>`;
    list.appendChild(row);
  });
}

function renderTimeline() {
  const timeline = document.querySelector("#timeline");
  timeline.innerHTML = "";
  state.timeline.forEach((entry) => {
    const [year, ...details] = entry.split("|");
    const item = document.createElement("article");
    item.className = "timeline-item reveal";
    item.innerHTML = `<div class="timeline-year">${escapeHtml(year.trim())}</div><p>${escapeHtml(details.join("|").trim())}</p>`;
    timeline.appendChild(item);
  });
  observeReveals();
}

function fillAdminForm() {
  const form = document.querySelector("#adminForm");
  ["name", "headline", "bio", "about", "email", "github", "linkedin", "photo", "accent", "contactText"].forEach((key) => {
    const field = form.elements[key];
    if (field) field.value = state[key] || "";
  });
  form.elements.skills.value = state.skills.join(", ");
  form.elements.timeline.value = state.timeline.join("\n");
  renderProjectEditor();
}

function renderProjectEditor() {
  const editor = document.querySelector("#projectEditor");
  editor.innerHTML = "";

  state.projects.forEach((project, index) => {
    const block = document.createElement("div");
    block.className = "project-editor";
    block.innerHTML = `
      <div class="project-editor-row">
        <label>Title <input data-project="${index}" data-key="title" value="${escapeHtml(project.title)}"></label>
        <label>Tag <input data-project="${index}" data-key="tag" value="${escapeHtml(project.tag)}"></label>
      </div>
      <label>Description <textarea rows="3" data-project="${index}" data-key="description">${escapeHtml(project.description)}</textarea></label>
      <div class="project-editor-row">
        <label>Stack <input data-project="${index}" data-key="stack" value="${escapeHtml(project.stack)}"></label>
        <label>Link <input data-project="${index}" data-key="link" value="${escapeHtml(project.link)}"></label>
      </div>
      <label><input type="checkbox" data-project="${index}" data-key="featured" ${project.featured ? "checked" : ""}> Featured project</label>
      <button class="remove-project" type="button" data-remove="${index}">Remove project</button>
    `;
    editor.appendChild(block);
  });
}

function collectForm() {
  const form = document.querySelector("#adminForm");
  const formData = new FormData(form);
  state = {
    ...state,
    name: formData.get("name").trim(),
    headline: formData.get("headline").trim(),
    bio: formData.get("bio").trim(),
    about: formData.get("about").trim(),
    email: formData.get("email").trim(),
    github: formData.get("github").trim(),
    linkedin: formData.get("linkedin").trim(),
    photo: formData.get("photo").trim(),
    accent: formData.get("accent"),
    contactText: formData.get("contactText").trim(),
    skills: formData.get("skills").split(",").map((item) => item.trim()).filter(Boolean),
    timeline: formData.get("timeline").split("\n").map((item) => item.trim()).filter(Boolean)
  };

  document.querySelectorAll("[data-project]").forEach((field) => {
    const index = Number(field.dataset.project);
    const key = field.dataset.key;
    if (!state.projects[index]) return;
    state.projects[index][key] = field.type === "checkbox" ? field.checked : field.value;
  });
}

function openAdmin() {
  const panel = document.querySelector("#adminPanel");
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  document.body.classList.add("admin-open");
}

function closeAdmin() {
  const panel = document.querySelector("#adminPanel");
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("admin-open");
}

function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal:not(.visible)").forEach((node) => observer.observe(node));
}

document.querySelector("#openAdmin").addEventListener("click", openAdmin);
document.querySelector("#closeAdmin").addEventListener("click", closeAdmin);
document.querySelector("#closeAdminButton").addEventListener("click", closeAdmin);

document.querySelector("#adminForm").addEventListener("submit", (event) => {
  event.preventDefault();
  collectForm();
  saveState();
  render();
  closeAdmin();
});

document.querySelector("#projectEditor").addEventListener("click", (event) => {
  const index = event.target.dataset.remove;
  if (index === undefined) return;
  state.projects.splice(Number(index), 1);
  renderProjectEditor();
});

document.querySelector("#addProject").addEventListener("click", () => {
  state.projects.push({
    title: "New Project",
    tag: "Build",
    description: "Describe what makes this project useful, technical, and memorable.",
    stack: "JavaScript, UI, API",
    link: "#contact",
    featured: false
  });
  renderProjectEditor();
});

document.querySelector("#resetPortfolio").addEventListener("click", () => {
  state = { ...defaults, projects: defaults.projects.map((project) => ({ ...project })) };
  saveState();
  render();
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".admin-section").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`[data-panel="${button.dataset.tab}"]`).classList.add("active");
  });
});

window.addEventListener("pointermove", (event) => {
  document.querySelector(".cursor-glow").style.left = `${event.clientX}px`;
  document.querySelector(".cursor-glow").style.top = `${event.clientY}px`;
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAdmin();
});

render();
observeReveals();
