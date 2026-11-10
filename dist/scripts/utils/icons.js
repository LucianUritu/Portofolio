export function arrowIcon(direction = 'up-right', className = '') {
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('class', `icon ${className}`.trim());
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(namespace, 'use');
  use.setAttribute('href', `assets/icons.svg#arrow-${direction}`);
  svg.append(use);
  return svg;
}
