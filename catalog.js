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

function initializeCatalogs() {
  setupCatalog('tools-search', 'tools-list', 'tools-empty', 'tools-count', 'tool');
  setupCatalog('plans-search', 'plans-list', 'plans-empty', 'plans-count', 'plan');
}

document.addEventListener('DOMContentLoaded', initializeCatalogs);
