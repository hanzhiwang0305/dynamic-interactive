const body = document.body;
const themeButton = document.querySelector('.theme-toggle');

try {
  const savedTheme = localStorage.getItem('flow-theme');
  if (savedTheme) body.dataset.theme = savedTheme;
} catch {
  // The default theme remains available when storage is unavailable.
}

const updateThemeIcon = () => {
  if (themeButton) themeButton.textContent = body.dataset.theme === 'night' ? '☾' : '☼';
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
