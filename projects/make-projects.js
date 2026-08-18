const makeProjectButtons = Array.from(document.querySelectorAll('[data-make-project-target]'));
const makeProjectPanels = Array.from(document.querySelectorAll('[data-make-project-panel]'));
const reduceMakeMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function showMakeProject(projectName, shouldScroll = false) {
  const selectedPanel = makeProjectPanels.find((panel) => panel.dataset.makeProjectPanel === projectName);
  if (!selectedPanel) return;

  makeProjectButtons.forEach((button) => {
    const isSelected = button.dataset.makeProjectTarget === projectName;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });

  makeProjectPanels.forEach((panel) => {
    const isSelected = panel === selectedPanel;
    panel.hidden = !isSelected;
    panel.classList.toggle('is-active', isSelected);
  });

  window.history.replaceState(null, '', `#${projectName}`);

  if (shouldScroll) {
    selectedPanel.scrollIntoView({ behavior: reduceMakeMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }
}

makeProjectButtons.forEach((button) => {
  button.addEventListener('click', () => showMakeProject(button.dataset.makeProjectTarget, true));
});

const requestedMakeProject = window.location.hash.slice(1);
showMakeProject(requestedMakeProject === 'gmail-processor' ? 'gmail-processor' : 'xero-asana');
