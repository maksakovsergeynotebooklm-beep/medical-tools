/* Patient values and results deliberately live only in page memory. */
(function () {
  'use strict';
  let resultText = '', options = null;
  function patientUrl() {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('tool', options.toolId);
    url.searchParams.set('patient', '1');
    return url.href;
  }
  async function share(text, url) {
    if (navigator.share) {
      try {
        await navigator.share({ title: options.title, text, ...(url ? { url } : {}) });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    if (!url) {
      try {
        await navigator.clipboard.writeText(text);
        const button = document.getElementById('share-result');
        if (button) button.textContent = 'Скопировано — вставьте в сообщение';
        const status = document.getElementById('appStatus');
        if (status) status.textContent = 'Результат скопирован. Вставьте его в сообщение вручную.';
      } catch {
        window.prompt('Скопируйте результат и вставьте его в сообщение:', text);
      }
      return;
    }
    const target = new URL('https://t.me/share/url');
    target.searchParams.set('url', url);
    target.searchParams.set('text', text);
    window.open(target.href, '_blank', 'noopener,noreferrer');
  }
  function resetResult() {
    resultText = '';
    const button = document.getElementById('share-result');
    if (button) {
      button.disabled = true;
      button.textContent = 'Отправить результат';
    }
  }
  function markResultReady(text) {
    resultText = typeof text === 'string' ? text : '';
    const button = document.getElementById('share-result');
    if (button) {
      button.disabled = !resultText;
      button.textContent = 'Отправить результат';
    }
  }
  function init(config) {
    options = config;
    resetResult();
    const patient = new URLSearchParams(window.location.search).get('patient') === '1';
    document.body.classList.toggle('patient-mode', patient);
    document.querySelectorAll('[data-doctor-only]').forEach(el => { el.hidden = patient; });
    const linkButton = document.getElementById('share-patient-link');
    const resultButton = document.getElementById('share-result');
    const printButton = document.getElementById('print-result');
    if (linkButton) linkButton.onclick = () => share(options.title, patientUrl());
    if (resultButton) resultButton.onclick = () => {
      const text = resultText && (options.getResult ? options.getResult() : resultText);
      if (text) return share(text);
    };
    if (printButton) printButton.onclick = () => window.print();
  }
  window.PatientSharing = { init, markResultReady, resetResult };
})();
