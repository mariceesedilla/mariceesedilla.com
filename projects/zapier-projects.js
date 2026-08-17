const zapierProjectButtons = Array.from(document.querySelectorAll('[data-zapier-project-target]'));
const zapierProjectPanels = Array.from(document.querySelectorAll('[data-zapier-project-panel]'));
const reduceZapierMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function showZapierProject(projectName, shouldScroll = false) {
  const selectedPanel = zapierProjectPanels.find((panel) => panel.dataset.zapierProjectPanel === projectName);
  if (!selectedPanel) return;

  zapierProjectButtons.forEach((button) => {
    const isSelected = button.dataset.zapierProjectTarget === projectName;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });

  zapierProjectPanels.forEach((panel) => {
    const isSelected = panel === selectedPanel;
    panel.hidden = !isSelected;
    panel.classList.toggle('is-active', isSelected);
  });

  window.history.replaceState(null, '', `#${projectName}`);

  if (shouldScroll) {
    selectedPanel.scrollIntoView({ behavior: reduceZapierMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }
}

zapierProjectButtons.forEach((button) => {
  button.addEventListener('click', () => showZapierProject(button.dataset.zapierProjectTarget, true));
});

const requestedZapierProject = window.location.hash.slice(1);
const availableZapierProjects = new Set(zapierProjectPanels.map((panel) => panel.dataset.zapierProjectPanel));
showZapierProject(availableZapierProjects.has(requestedZapierProject) ? requestedZapierProject : 'ai-content');
