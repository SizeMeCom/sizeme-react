const isHTMLElement = (elem: Element): elem is HTMLElement => true;

export const findVisibleElement = (selector: string) =>
  [...document.querySelectorAll(selector)].find(
    (elem) =>
      isHTMLElement(elem) &&
      !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
  );
