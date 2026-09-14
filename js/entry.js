const card = document.querySelector('.card');
const readout = document.querySelector('.signal-readout');
const aboutTrigger = document.querySelector('[data-about-trigger]');
const aboutDialog = document.querySelector('[data-about-dialog]');
const aboutClose = document.querySelector('[data-about-close]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateSignal = (event) => {
  if (!card || reduceMotion) return;
  const bounds = card.getBoundingClientRect();
  const percentX = ((event.clientX - bounds.left) / bounds.width) * 100;
  const percentY = ((event.clientY - bounds.top) / bounds.height) * 100;
  const tiltX = ((percentY - 50) * -0.04).toFixed(2);
  const tiltY = ((percentX - 50) * 0.04).toFixed(2);
  card.style.setProperty('--pointer-x', `${percentX}%`);
  card.style.setProperty('--pointer-y', `${percentY}%`);
  card.style.setProperty('--tilt-x', `${tiltX}deg`);
  card.style.setProperty('--tilt-y', `${tiltY}deg`);
  if (readout) readout.textContent = `SIGNAL / ${Math.round(percentX)}:${Math.round(percentY)}`;
};

const resetSignal = () => {
  if (!card || reduceMotion) return;
  card.style.setProperty('--tilt-x', '0deg');
  card.style.setProperty('--tilt-y', '0deg');
  if (readout) readout.textContent = 'SIGNAL / READY';
};

if (card) {
  card.addEventListener('pointermove', updateSignal);
  card.addEventListener('pointerleave', resetSignal);
}

if (aboutTrigger && aboutDialog) {
  aboutTrigger.addEventListener('click', () => aboutDialog.showModal());
}

if (aboutClose && aboutDialog) {
  aboutClose.addEventListener('click', () => aboutDialog.close());
}