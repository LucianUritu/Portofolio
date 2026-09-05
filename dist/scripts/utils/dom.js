export class Dom {
  static select(selector, parent = document) {
    const element = parent.querySelector(selector);
    if (!element) throw new Error(`Missing element: ${selector}`);
    return element;
  }

  static create(tagName, className, textContent = "") {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
  }

  static clear(element) {
    while (element.firstChild) element.removeChild(element.firstChild);
  }
}
