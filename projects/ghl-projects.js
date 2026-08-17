const ghlProjectButtons = Array.from(document.querySelectorAll('[data-ghl-project-target]'));
const ghlProjectPanels = Array.from(document.querySelectorAll('[data-ghl-project-panel]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function showGhlProject(projectName, shouldScroll = false) {
  const selectedPanel = ghlProjectPanels.find((panel) => panel.dataset.ghlProjectPanel === projectName);
  if (!selectedPanel) return;

  ghlProjectButtons.forEach((button) => {
    const isSelected = button.dataset.ghlProjectTarget === projectName;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });

  ghlProjectPanels.forEach((panel) => {
    const isSelected = panel === selectedPanel;
    panel.hidden = !isSelected;
    panel.classList.toggle('is-active', isSelected);
  });

  window.history.replaceState(null, '', `#${projectName}`);

  if (shouldScroll) {
    selectedPanel.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }
}

ghlProjectButtons.forEach((button) => {
  button.addEventListener('click', () => showGhlProject(button.dataset.ghlProjectTarget, true));
});

const requestedProject = window.location.hash.slice(1);
showGhlProject(requestedProject === 'motioncare' ? 'motioncare' : 'glow-haven');
