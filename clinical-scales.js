(() => {
  'use strict';

  function incomplete(warning = '') {
    return { complete: false, score: null, label: 'Заполните все пункты', warning };
  }

  function validAnswers(values, count, max) {
    return Array.isArray(values)
      && values.length === count
      && values.every((value) => Number.isFinite(value) && Number.isInteger(value) && value >= 0 && value <= max);
  }

  function result(score, label, warning = '') {
    return { complete: true, score, label, warning };
  }

  function sum(values) {
    return values.reduce((total, value) => total + value, 0);
  }

  function labelByUpperBound(score, ranges) {
    return ranges.find((range) => score <= range[0])[1];
  }

  function pain(value) {
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0 || value > 10) {
      return incomplete();
    }
    return result(value, labelByUpperBound(value, [
      [0, 'Нет боли'],
      [3, 'Слабая боль'],
      [6, 'Умеренная боль'],
      [9, 'Очень сильная боль'],
      [10, 'Нестерпимая боль']
    ]));
  }

  function gad7(values) {
    if (!validAnswers(values, 7, 3)) return incomplete();
    const score = sum(values);
    return result(score, labelByUpperBound(score, [
      [4, 'Минимальная тревога'],
      [9, 'Лёгкая тревога'],
      [14, 'Умеренная тревога'],
      [21, 'Тяжёлая тревога']
    ]));
  }

  function phq9(values) {
    const warning = Array.isArray(values) && Number.isInteger(values[8]) && values[8] > 0 && values[8] <= 3
      ? 'Ответ на пункт 9 требует немедленной клинической оценки риска самоповреждения.'
      : '';
    if (!validAnswers(values, 9, 3)) return incomplete(warning);
    const score = sum(values);
    return result(score, labelByUpperBound(score, [
      [4, 'Минимальные симптомы'],
      [9, 'Лёгкие симптомы'],
      [14, 'Умеренные симптомы'],
      [19, 'Умеренно тяжёлые симптомы'],
      [27, 'Тяжёлые симптомы']
    ]), warning);
  }

  function pss10(values) {
    if (!validAnswers(values, 10, 4)) return incomplete();
    const reverse = new Set([3, 4, 6, 7]);
    const score = values.reduce((total, value, index) => total + (reverse.has(index) ? 4 - value : value), 0);
    return result(score, labelByUpperBound(score, [
      [13, 'Низкий уровень стресса'],
      [26, 'Умеренный уровень стресса'],
      [40, 'Высокий уровень стресса']
    ]));
  }

  function sss8(values) {
    if (!validAnswers(values, 8, 4)) return incomplete();
    const score = sum(values);
    return result(score, labelByUpperBound(score, [
      [3, 'Очень низкий уровень'],
      [7, 'Низкий уровень'],
      [11, 'Умеренный уровень'],
      [15, 'Высокий уровень'],
      [32, 'Очень высокий уровень']
    ]));
  }

  function bfi(values) {
    if (!validAnswers(values, 9, 10)) return incomplete();
    const score = Math.round((sum(values) / values.length) * 10) / 10;
    return result(score, 'Средний балл усталости (0–10)');
  }

  function healthWheel(values) {
    if (!validAnswers(values, 12, 10)) return { ...incomplete(), lowest: [] };
    const score = Math.round((sum(values) / values.length) * 10) / 10;
    const minimum = Math.min(...values);
    const lowest = values.map((value, index) => value === minimum ? index : -1).filter((index) => index >= 0);
    return { ...result(score, 'Средняя оценка областей здоровья'), lowest };
  }

  globalThis.ClinicalScales = Object.freeze({ pain, gad7, phq9, pss10, sss8, bfi, healthWheel });
})();
