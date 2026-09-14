const root = document.documentElement;
const body = document.body;
const themeButton = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('flow-theme');

if (savedTheme) {
  body.dataset.theme = savedTheme;
}

const updateThemeIcon = () => {
  themeButton.textContent = body.dataset.theme === 'night' ? '☾' : '☼';
};

updateThemeIcon();

themeButton.addEventListener('click', () => {
  body.dataset.theme = body.dataset.theme === 'night' ? 'day' : 'night';
  localStorage.setItem('flow-theme', body.dataset.theme);
  updateThemeIcon();
});

document.addEventListener('pointermove', (event) => {
  root.style.setProperty('--cursor-x', `${event.clientX}px`);
  root.style.setProperty('--cursor-y', `${event.clientY}px`);
});

const stage = document.querySelector('.orbit-stage');
let draggedNode = null;
let dragOffset = { x: 0, y: 0 };

stage.querySelectorAll('.orbit-node').forEach((node) => {
  node.addEventListener('pointerdown', (event) => {
    draggedNode = node;
    const rect = node.getBoundingClientRect();
    dragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    node.setPointerCapture(event.pointerId);
  });

  node.addEventListener('pointermove', (event) => {
    if (!draggedNode) return;
    const bounds = stage.getBoundingClientRect();
    const x = event.clientX - bounds.left - dragOffset.x;
    const y = event.clientY - bounds.top - dragOffset.y;
    node.style.left = `${Math.max(0, Math.min(bounds.width - node.offsetWidth, x))}px`;
    node.style.top = `${Math.max(0, Math.min(bounds.height - node.offsetHeight, y))}px`;
    node.style.right = 'auto';
    node.style.bottom = 'auto';
  });

  node.addEventListener('pointerup', () => {
    draggedNode = null;
  });
});

const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');

    const selected = filter.dataset.filter;
    projects.forEach((project) => {
      project.classList.toggle('hidden', selected !== 'all' && project.dataset.category !== selected);
    });
  });
});

const modalBackdrop = document.querySelector('.modal-backdrop');
const modalTitle = document.querySelector('#modalTitle');
const modalType = document.querySelector('#modalType');

const closeModal = () => modalBackdrop.classList.remove('open');

projects.forEach((project) => {
  project.addEventListener('click', () => {
    modalTitle.textContent = project.dataset.title;
    modalType.textContent = `PROJECT / ${project.querySelector('.project-index').textContent.split('/')[0].trim()} · ${project.dataset.type}`;
    modalBackdrop.classList.add('open');
  });
});

document.querySelector('.close').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});
