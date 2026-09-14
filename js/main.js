const root = document.documentElement;
const body = document.body;
const themeButton = document.querySelector('.theme-toggle');
const savedTheme = (() => {
  try {
    return localStorage.getItem('flow-theme');
  } catch {
    return null;
  }
})();

if (savedTheme) {
  body.dataset.theme = savedTheme;
}

const updateThemeIcon = () => {
  if (themeButton) {
    themeButton.textContent = body.dataset.theme === 'night' ? '☾' : '☼';
  }
};

updateThemeIcon();

if (themeButton) {
  themeButton.addEventListener('click', () => {
    body.dataset.theme = body.dataset.theme === 'night' ? 'day' : 'night';
    try {
      localStorage.setItem('flow-theme', body.dataset.theme);
    } catch {
      // Theme still changes for the current page when storage is unavailable.
    }
    updateThemeIcon();
  });
}

document.addEventListener('pointermove', (event) => {
  root.style.setProperty('--cursor-x', `${event.clientX}px`);
  root.style.setProperty('--cursor-y', `${event.clientY}px`);
});

const stage = document.querySelector('.orbit-stage');
let draggedNode = null;
let dragOffset = { x: 0, y: 0 };

if (stage) {
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
    node.addEventListener('pointercancel', () => {
      draggedNode = null;
    });
  });

  stage.addEventListener('pointerleave', () => {
    draggedNode = null;
  });
  document.addEventListener('pointerup', () => {
    draggedNode = null;
  });
}

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}[character]));

const renderProjects = () => {
  const projectContainer = document.getElementById('projects-container');
  if (!projectContainer || !window.projectData) return;

  projectContainer.innerHTML = window.projectData.map((project) => `
    <article class="project" tabindex="0" role="button" aria-label="查看项目：${escapeHtml(project.title)}" data-category="${escapeHtml(project.category)}" data-title="${escapeHtml(project.title)}" data-type="${escapeHtml(project.type)}">
      <div class="project-visual"></div>
      <span class="project-index">${escapeHtml(project.index)} / 06</span>
      <span class="project-tag">${escapeHtml(project.tag)}</span>
      <h3 class="project-title">${escapeHtml(project.title)}<small>${escapeHtml(project.subtitle)}</small></h3>
    </article>
  `).join('');

  const projects = document.querySelectorAll('.project');
  const filters = document.querySelectorAll('.filter');

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filters.forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-pressed', 'false');
      });
      filter.classList.add('active');
      filter.setAttribute('aria-pressed', 'true');

      const selected = filter.dataset.filter;
      projects.forEach((project) => {
        project.classList.toggle('hidden', selected !== 'all' && project.dataset.category !== selected);
      });
    });
  });

  projects.forEach((project) => {
    const handleTilt = (event) => {
      const rect = project.getBoundingClientRect();
      const offsetX = ((event.clientX - rect.left) / rect.width) * 100;
      const offsetY = ((event.clientY - rect.top) / rect.height) * 100;
      const rotateY = ((offsetX - 50) / 50) * 9;
      const rotateX = ((50 - offsetY) / 50) * 9;
      project.style.setProperty('--rotate-x', `${rotateX.toFixed(2)}deg`);
      project.style.setProperty('--rotate-y', `${rotateY.toFixed(2)}deg`);
      project.style.setProperty('--glow-x', `${offsetX}%`);
      project.style.setProperty('--glow-y', `${offsetY}%`);
    };

    const resetTilt = () => {
      project.style.setProperty('--rotate-x', '0deg');
      project.style.setProperty('--rotate-y', '0deg');
      project.style.setProperty('--glow-x', '50%');
      project.style.setProperty('--glow-y', '50%');
    };

    project.addEventListener('pointermove', handleTilt);
    project.addEventListener('pointerleave', resetTilt);
    project.addEventListener('pointercancel', resetTilt);
  });

  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalTitle = document.querySelector('#modalTitle');
  const modalType = document.querySelector('#modalType');
  const modalDescription = document.querySelector('#modalDescription');

  const closeButton = document.querySelector('.close');
  const closeModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
  };

  projects.forEach((project) => {
    const openProject = () => {
      const data = window.projectData.find((item) => item.title === project.dataset.title);
      if (!data || !modalBackdrop) return;
      modalTitle.textContent = data.title;
      modalType.textContent = `PROJECT / ${data.index} · ${data.type}`;
      modalDescription.textContent = data.description;
      modalBackdrop.classList.add('open');
    };

    project.addEventListener('click', openProject);
    project.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProject();
      }
    });
  });

  if (closeButton) closeButton.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
};

renderProjects();
