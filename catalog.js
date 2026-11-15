'use strict';

function normalizeSearchText(value) {
  return String(value || '').toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').trim();
}

function matchesCatalogQuery(searchText, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  return normalizeSearchText(searchText).includes(normalizedQuery);
}

function formatResultCount(visible, kind) {
  if (kind === 'plan') return `${visible} ${visible === 1 ? 'план' : 'планов'}`;
  return `${visible} ${visible === 1 ? 'инструмент' : 'инструментов'}`;
}

function filterCatalog(input, list, emptyState, counter, kind) {
  const cards = Array.from(list.querySelectorAll('.catalog-card'));
  let visible = 0;
  cards.forEach(card => {
    const searchText = `${card.dataset.search || ''} ${card.textContent || ''}`;
    const matches = matchesCatalogQuery(searchText, input.value);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  emptyState.hidden = visible !== 0;
  counter.textContent = formatResultCount(visible, kind);
  return visible;
}

function setupCatalog(inputId, listId, emptyId, countId, kind) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  const emptyState = document.getElementById(emptyId);
  const counter = document.getElementById(countId);
  if (!input || !list || !emptyState || !counter) return;
  const update = () => filterCatalog(input, list, emptyState, counter, kind);
  input.addEventListener('input', update);
  input.addEventListener('search', update);
  update();
}

function renderMedicalCalculators() {
  const list = document.getElementById('tools-list');
  const registry = window.MEDICAL_CALCULATORS || [];
  if (!list) return;
  const seenIds = new Set();
  const seenTitles = new Set();
  list.replaceChildren();
  registry.forEach(tool => {
    if (seenIds.has(tool.id) || seenTitles.has(tool.title)) return;
    seenIds.add(tool.id);
    seenTitles.add(tool.title);
    const link = document.createElement('a');
    link.className = 'catalog-card';
    link.dataset.kind = 'tool';
    link.dataset.search = `${tool.search} ${tool.title} ${tool.description} ${tool.category}`;
    link.href = tool.route;
    link.target = '_blank';
    link.rel = 'noopener';
    const body = document.createElement('span');
    body.className = 'catalog-card-body';
    const tag = document.createElement('span');
    tag.className = 'catalog-card-tag';
    tag.textContent = tool.category;
    const title = document.createElement('h4');
    title.textContent = tool.title;
    const description = document.createElement('p');
    description.textContent = tool.description;
    const action = document.createElement('span');
    action.className = 'catalog-card-action';
    action.textContent = 'Открыть в новом окне ↗';
    body.append(tag, title, description, action);
    link.append(body);
    list.append(link);
  });
}

function initializeCatalogs() {
  renderMedicalCalculators();
  setupCatalog('tools-search', 'tools-list', 'tools-empty', 'tools-count', 'tool');
  setupCatalog('plans-search', 'plans-list', 'plans-empty', 'plans-count', 'plan');
}

document.addEventListener('DOMContentLoaded', initializeCatalogs);
