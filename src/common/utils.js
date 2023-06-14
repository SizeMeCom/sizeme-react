export const findVisibleElement = (selector) =>
  [...document.querySelectorAll(selector)].find(
    (elem) => !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
  );
