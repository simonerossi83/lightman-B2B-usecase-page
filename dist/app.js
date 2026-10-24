'use strict';

const grid = document.querySelector('#case-grid');
const cardTemplate = document.querySelector('#case-card-template');
const dialog = document.querySelector('#project-dialog');
const projectContent = document.querySelector('#project-content');
const closeButton = dialog.querySelector('.dialog-close');
let activeTrigger = null;
let scrollPosition = 0;
let backdropPointerDown = false;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function createCard(project, index) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const button = card.querySelector('.case-open');
  const title = element('h3', 'case-title', project.title);
  title.id = `case-title-${project.id}`;
  card.querySelector('.case-title').replaceWith(title);
  button.setAttribute('aria-labelledby', title.id);
  button.dataset.project = project.id;

  const image = card.querySelector('img');
  image.src = project.coverImage;
  image.alt = project.coverAlt;
  // The first row is loaded immediately; the second row stays lazy.
  image.loading = index < 2 ? 'eager' : 'lazy';
  if (index === 0) image.fetchPriority = 'high';
  card.querySelector('.case-number').textContent = String(index + 1).padStart(2, '0');
  card.querySelector('.case-type').textContent = project.eventType;
  card.querySelector('.case-description').textContent = project.shortDescription;
  button.addEventListener('click', () => openProject(project, index, button));
  return card;
}

function createSection(number, title, paragraphs) {
  const section = element('section', 'story-section');
  const heading = element('h3', 'story-heading');
  heading.append(element('span', 'story-number', `${number} — `), document.createTextNode(title));
  section.append(heading);
  const copy = element('div', 'story-copy');
  paragraphs.forEach(paragraph => copy.append(element('p', '', paragraph)));
  section.append(copy);
  return section;
}

function renderProject(project) {
  const cover = element('figure', 'project-cover');
  const image = element('img');
  image.src = project.coverImage;
  image.alt = project.coverAlt;
  image.width = 1920;
  image.height = 1080;
  cover.append(image, element('figcaption', '', project.imageCaption));

  const body = element('div', 'project-body');
  const heading = element('header', 'project-heading');
  heading.append(element('p', 'project-type', project.eventType));
  const title = element('h2', '', project.title);
  title.id = 'project-title';
  heading.append(title, element('p', 'project-summary', project.shortDescription));

  const facts = element('dl', 'project-facts');
  [['Cliente', project.client], ['Pubblico', project.audience]].forEach(([label, value]) => {
    const group = element('div');
    group.append(element('dt', '', label), element('dd', '', value));
    facts.append(group);
  });
  body.append(heading, facts, element('p', 'content-note', project.contentNote));
  body.append(
    createSection('01', 'Il contesto', project.context),
    createSection('02', 'La personalizzazione', project.customization),
    createSection('03', 'La realizzazione', project.execution)
  );
  projectContent.replaceChildren(cover, body);
}

function openProject(project, index, trigger) {
  if (dialog.open) return;
  renderProject(project);
  document.querySelector('#project-number').textContent = String(index + 1).padStart(2, '0');
  activeTrigger = trigger;
  scrollPosition = window.scrollY;
  // Fixed positioning also prevents background scrolling in mobile Safari.
  document.body.style.top = `-${scrollPosition}px`;
  document.body.classList.add('modal-open');
  dialog.showModal();
  dialog.scrollTop = 0;
  closeButton.focus({ preventScroll: true });
}

function closeProject() {
  if (dialog.open) dialog.close();
}

closeButton.addEventListener('click', closeProject);
// Native modal dialogs provide background inertness and Escape handling.
// Explicit cancel handling keeps all close paths on the same cleanup path.
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeProject();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  document.body.style.top = '';
  window.scrollTo({ top: scrollPosition, behavior: 'instant' });
  activeTrigger?.focus({ preventScroll: true });
  activeTrigger = null;
  backdropPointerDown = false;
});

function isOutsideDialog(event) {
  const rect = dialog.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right ||
    event.clientY < rect.top || event.clientY > rect.bottom;
}

// Requiring both ends outside avoids closing after a drag from the content.
dialog.addEventListener('pointerdown', event => {
  backdropPointerDown = event.target === dialog && isOutsideDialog(event);
});
dialog.addEventListener('click', event => {
  if (backdropPointerDown && event.target === dialog && isOutsideDialog(event)) closeProject();
  backdropPointerDown = false;
});

// Keep Tab on the dialog controls, including browsers that cycle to browser UI.
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll(
    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter(node => node.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first) {
    event.preventDefault();
    return;
  }
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

grid.replaceChildren(...caseStudies.map(createCard));
