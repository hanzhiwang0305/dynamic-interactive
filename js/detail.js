const projectNumber = new URLSearchParams(window.location.search).get('project') || '01';
const project = (window.projectData || []).find((item) => item.index === projectNumber) || window.projectData[0];

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value || '';
};

if (project) {
  document.title = `${project.title} / 王翰芝`;
  setText('#detailKicker', `PROJECT / ${project.index} · ${project.type}`);
  setText('#detailTitle', project.title);
  setText('#detailDescription', project.description);
  setText('#detailArtNumber', project.index);
  setText('#detailInsight', project.insight);
  setText('#detailProcess', project.process);
  setText('#detailOutcome', project.outcome);
  const meta = document.querySelector('#detailMeta');
  if (meta) meta.innerHTML = `<span>${project.client}</span><span>${project.year}</span><span>${project.role}</span>`;
  const art = document.querySelector('#detailArt');
  if (art) art.dataset.project = project.index;
}

const themeScript = document.createElement('script');
themeScript.src = 'js/theme.js';
document.body.appendChild(themeScript);
