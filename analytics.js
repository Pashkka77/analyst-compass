const quizAnalytics = (() => {
  const counterId = Number(document.currentScript.dataset.counterId);
  if (!Number.isSafeInteger(counterId) || counterId <= 0) return;

  window.ym = window.ym || function () {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = Date.now();
  window.ym(counterId, 'init', {
    clickmap: false,
    trackLinks: false,
    webvisor: false,
    disableYtm: true,
  });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + counterId;
  document.head.append(tag);

  return { complete: () => window.ym(counterId, 'reachGoal', 'quiz_completed') };
})();
