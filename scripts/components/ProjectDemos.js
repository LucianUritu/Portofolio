import { Dom } from '../utils/dom.js';
import { routeStops, routeConnections, findRoute } from '../utils/routePlanner.js';

const svg = (content) => `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${content}</svg>`;
export const projectSymbols = [
  svg('<path d="M15 23c14-5 25-3 35 5 10-8 21-10 35-5v53c-14-5-25-3-35 5-10-8-21-10-35-5V23Z" fill="#fffdf1" stroke="currentColor" stroke-width="3"/><path d="M50 29v50M25 38l15 3M25 49l15 3M60 41l15-3M60 52l15-3" stroke="currentColor" stroke-width="3"/>'),
  svg('<path d="M8 66h84M8 38h84M36 8v84M64 8v84" stroke="currentColor" stroke-width="11"/><path d="M8 66h84M8 38h84M36 8v84M64 8v84" stroke="#cedcff" stroke-width="1.5" stroke-dasharray="4 5"/><rect x="12" y="32" width="14" height="7" rx="2" fill="#faf8ee"/><rect x="60" y="64" width="7" height="14" rx="2" fill="#faf8ee"/>'),
  svg('<path d="M25 35 50 20l25 15v30L50 80 25 65V35Z" stroke="currentColor" stroke-width="3"/><path d="m25 35 25 15 25-15M50 50v30" stroke="currentColor" stroke-width="3"/><path d="m40 30 25 15v12" stroke="currentColor" stroke-width="3"/><circle cx="18" cy="78" r="7" fill="currentColor"/><circle cx="82" cy="20" r="7" fill="currentColor"/>'),
  svg('<path d="M8 50s17-28 42-28 42 28 42 28-17 28-42 28S8 50 8 50Z" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="17" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="8" fill="currentColor"/><path d="M50 5v10M50 85v10M5 50h10M85 50h10" stroke="currentColor" stroke-width="3"/>'),
  svg('<path d="m13 75 22-45 25 34 26-48" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="13" cy="75" r="8" fill="#fff9ef" stroke="currentColor" stroke-width="3"/><circle cx="35" cy="30" r="6" fill="#fff9ef" stroke="currentColor" stroke-width="3"/><circle cx="60" cy="64" r="6" fill="#fff9ef" stroke="currentColor" stroke-width="3"/><circle cx="86" cy="16" r="8" fill="currentColor"/>'),
  svg('<path d="M22 28 77 25 72 76 22 71 22 28l50 48M22 71l55-46" stroke="currentColor" stroke-width="2"/><circle cx="22" cy="28" r="11" fill="#a9baff"/><circle cx="77" cy="25" r="11" fill="#f5a68c"/><circle cx="72" cy="76" r="11" fill="#c5d99c"/><circle cx="22" cy="71" r="11" fill="#a9baff"/>')
];

function shell(root, className, title, subtitle) {
  const demo = Dom.create('div', `demo ${className}`);
  const head = Dom.create('div', 'demo-head');
  head.append(Dom.create('span', '', title), Dom.create('span', '', subtitle));
  const content = Dom.create('div', 'demo-content');
  const caption = Dom.create('div', 'demo-caption');
  demo.append(head, content, caption);
  root.replaceChildren(demo);
  return { demo, content, caption };
}

export class ProjectDemos {
  static mount(root, index) {
    root.classList.toggle('is-route-preview', index === 4);
    const methods = [this.book, this.traffic, this.network, this.parallax, this.route, this.graph];
    return methods[index](root) || (() => {});
  }

  static book(root) {
    const { content, caption } = shell(root, 'book-demo', 'From text to a book', 'Try the editor');
    const workspace = Dom.create('div', 'book-workspace');
    const input = Dom.create('textarea', 'book-input');
    input.setAttribute('aria-label', 'Try editing the book text using Markdown headings');
    input.spellcheck = false;
    input.value = '# A little curiosity\n\nEvery good idea starts with a question.\n\n## Make it useful\n\nWrite. Explore. Build something.';
    const preview = Dom.create('div', 'book-preview');
    preview.setAttribute('aria-label', 'Live book preview');
    const update = () => {
      preview.replaceChildren();
      input.value.split('\n').filter((line) => line.trim()).forEach((line) => {
        const tag = line.startsWith('## ') ? 'h5' : line.startsWith('# ') ? 'h4' : 'p';
        preview.append(Dom.create(tag, '', line.replace(/^#{1,2} /, '')));
      });
    };
    input.addEventListener('input', update);
    update();
    workspace.append(input, preview);
    content.append(workspace);
    caption.append(Dom.create('span', '', 'Your words, with a little structure.'), Dom.create('span', '', 'Live preview'));
  }

  static traffic(root) {
    const { demo, content, caption } = shell(root, 'traffic-demo', 'A city in parallel', 'Traffic sketch');
    let blocks = '';
    for (let y = 0; y < 4; y++) for (let x = 0; x < 6; x++) {
      blocks += `<rect x="${x * 85 + 14}" y="${y * 76 + 12}" width="58" height="47" rx="3" fill="${(x + y) % 3 === 0 ? '#bbc9a3' : '#cbd4bc'}"/>`;
    }
    let cars = '';
    [70, 146, 222].forEach((y, i) => { cars += `<rect class="traffic-dot" x="0" y="${y}" width="16" height="7" rx="2" fill="#355c3c" style="animation-delay:-${i * 1.7}s"/>`; });
    [81, 251, 421].forEach((x, i) => { cars += `<rect class="traffic-dot vertical" x="${x}" y="0" width="7" height="15" rx="2" fill="#3159b6" style="animation-delay:-${i * 2.1}s"/>`; });
    content.innerHTML = `<svg class="traffic-view is-paused" viewBox="0 0 520 310" role="img" aria-label="An illustrative traffic network with moving vehicles">${blocks}${cars}</svg>`;
    const view = content.querySelector('svg');
    const button = Dom.create('button', 'demo-button', 'Play traffic');
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    let playing = false;
    let visible = true;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => view.classList.toggle('is-paused', !playing || !visible || document.hidden || motion.matches);
    button.addEventListener('click', () => {
      playing = !playing;
      button.textContent = playing ? 'Pause traffic' : 'Play traffic';
      button.setAttribute('aria-pressed', String(playing));
      sync();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(demo);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    caption.append(Dom.create('span', '', 'Many routes. One connected system.'), button);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync); };
  }

  static network(root) {
    const { content, caption } = shell(root, 'network-demo', 'A request, connected', 'Protocol sketch');
    content.innerHTML = '<div class="network-field"><div class="network-track"></div><div class="network-packet"></div><div class="network-station"><svg viewBox="0 0 60 60" aria-hidden="true"><rect x="9" y="10" width="42" height="29" rx="2"/><path d="M3 47h54M22 39v8m16-8v8"/></svg><span>Client</span></div><div class="network-station"><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M8 20h44M40 10l12 10-12 10M52 42H8m12-10L8 42l12 10"/></svg><span>Proxy</span></div><div class="network-station"><svg viewBox="0 0 60 60" aria-hidden="true"><rect x="11" y="6" width="38" height="48" rx="3"/><path d="M11 23h38M11 38h38M19 14h5m-5 17h5m-5 15h5"/></svg><span>Server</span></div></div>';
    const button = Dom.create('button', 'demo-button', 'Send request');
    button.type = 'button';
    const status = Dom.create('span', '', 'Ready when you are.');
    status.setAttribute('role', 'status');
    const field = content.querySelector('.network-field');
    const packet = content.querySelector('.network-packet');
    let animation;
    let current = true;
    button.addEventListener('click', async (event) => {
      if (button.disabled) return;
      button.disabled = true;
      status.textContent = 'Request sent through the proxy…';
      const distance = field.clientWidth * .7;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || event.detail === 0;
      animation = packet.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: `translateX(${distance}px)`, opacity: 1, offset: .48 }, { transform: `translateX(${distance}px)`, opacity: 1, offset: .55 }, { transform: 'translateX(0)', opacity: 1 }], { duration: reduce ? 1 : 1200, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' });
      try { await animation.finished; } catch { return; }
      if (!current) return;
      status.textContent = 'Response received. Connection complete.';
      button.disabled = false;
    });
    caption.append(status, button);
    return () => { current = false; animation?.cancel(); };
  }

  static parallax(root) {
    const { content, caption } = shell(root, 'parallax-demo', 'A change of perspective', 'Explore depth');
    content.innerHTML = `<div class="perspective-scene"><div class="perspective-layer">${projectSymbols[3]}</div><div class="perspective-layer">${projectSymbols[3]}</div><div class="perspective-layer">${projectSymbols[3]}</div></div>`;
    const label = Dom.create('label', 'perspective-control', 'Perspective');
    const input = Dom.create('input');
    input.type = 'range'; input.min = '-35'; input.max = '35'; input.value = '18';
    input.setAttribute('aria-label', 'Change the perspective of the layers');
    const layers = [...content.querySelectorAll('.perspective-layer')];
    const update = () => {
      const value = Number(input.value);
      layers.forEach((layer, i) => { layer.style.transform = `translateX(${(i - 1) * value}px) translateY(${(1 - i) * 16}px) rotateY(${value}deg) rotateX(-12deg)`; });
    };
    input.addEventListener('input', update);
    update(); label.append(input);
    caption.append(Dom.create('span', '', 'One scene. Different points of view.'), label);
  }

  static route(root) {
    const { content, caption } = shell(root, 'route-demo', 'Finding a way through', 'Choose two stops');
    const field = Dom.create('div', 'route-field');
    field.setAttribute('role', 'group');
    field.setAttribute('aria-label', 'Pick a start stop and a destination');
    const stopById = new Map(routeStops.map(stop => [stop.id, stop]));
    const roads = routeConnections.map(([a, b]) => {
      const from = stopById.get(a), to = stopById.get(b);
      return `<path d="M${from.x} ${from.y}L${to.x} ${to.y}"/>`;
    }).join('');
    field.innerHTML = `<svg class="route-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M72 0C62 22 91 39 75 61S71 90 82 100" fill="none" stroke="#b5cfd7" stroke-width="8"/><g fill="none" stroke="#b1cfc1" stroke-width="2">${roads}</g><path class="route-line"/></svg>`;
    const line = field.querySelector('.route-line');
    const traveler = Dom.create('div', 'route-traveler');
    traveler.hidden = true;
    traveler.setAttribute('aria-hidden', 'true');
    const status = Dom.create('span', '', 'Pick a start stop, then a destination.');
    status.setAttribute('role', 'status');
    const run = Dom.create('button', 'demo-button', 'Run route');
    const reset = Dom.create('button', 'demo-button route-reset', 'Reset');
    run.type = reset.type = 'button';
    run.disabled = true;
    const actions = Dom.create('div', 'route-actions');
    actions.append(reset, run);
    let start = null, destination = null, animation = null, generation = 0;
    let mounted = true;
    const stopButtons = new Map();
    const cancel = () => { generation++; animation?.cancel(); animation = null; };
    const update = () => {
      stopButtons.forEach((button, id) => {
        const kind = id === start ? 'start' : id === destination ? 'destination' : '';
        button.dataset.kind = kind;
        button.setAttribute('aria-pressed', String(Boolean(kind)));
        button.setAttribute('aria-label', `Stop ${id}${kind ? `, ${kind}` : ''}`);
        button.classList.remove('is-arrived');
      });
      line.removeAttribute('d');
      traveler.hidden = true;
      run.disabled = !start || !destination;
      run.textContent = 'Run route';
    };
    routeStops.forEach(({ id, x, y }) => {
      const button = Dom.create('button', 'route-stop', id);
      button.type = 'button';
      button.dataset.stop = id;
      button.style.left = `${x}%`; button.style.top = `${y}%`;
      button.addEventListener('click', () => {
        cancel();
        if (!start || destination) {
          start = id; destination = null;
          status.textContent = `Start: stop ${id}. Now pick your destination.`;
        } else if (id === start) {
          status.textContent = 'Pick a different stop for your destination.';
        } else {
          destination = id;
          status.textContent = `Stop ${start} to stop ${destination}. Ready to run.`;
        }
        update();
      });
      stopButtons.set(id, button); field.append(button);
    });
    run.addEventListener('click', async (event) => {
      if (!start || !destination || run.disabled) return;
      cancel();
      const route = findRoute(start, destination);
      if (!route) { status.textContent = 'No connection found. Pick another destination.'; return; }
      const token = generation;
      run.disabled = true;
      status.textContent = `Traveling from stop ${start} to stop ${destination}…`;
      line.setAttribute('d', route.stops.map((stop, i) => `${i ? 'L' : 'M'}${stop.x} ${stop.y}`).join(''));
      const { width, height } = field.getBoundingClientRect();
      const last = route.stops.at(-1);
      const transform = stop => `translate(${(stop.x - last.x) * width / 100}px, ${(stop.y - last.y) * height / 100}px)`;
      traveler.hidden = false;
      traveler.style.left = `${last.x}%`;
      traveler.style.top = `${last.y}%`;
      traveler.style.transform = 'none';
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && event.detail !== 0) {
        let traveled = 0;
        const keyframes = route.stops.map((stop, i) => {
          if (i) traveled += Math.hypot(stop.x - route.stops[i-1].x, stop.y - route.stops[i-1].y);
          return { transform: transform(stop), offset: traveled / route.distance };
        });
        animation = traveler.animate(keyframes, { duration: 1600, easing: 'linear' });
        try { await animation.finished; } catch { return; }
      }
      if (!mounted || token !== generation) return;
      stopButtons.get(destination).classList.add('is-arrived');
      status.textContent = `Arrived at stop ${destination}. ${route.stops.length - 1} connections from ${start}.`;
      run.disabled = false;
      run.textContent = 'Run again';
    });
    reset.addEventListener('click', () => {
      cancel(); start = destination = null; update();
      status.textContent = 'Pick a start stop, then a destination.';
    });
    field.append(traveler); content.append(field); caption.append(status, actions);
    update();
    return () => { mounted = false; cancel(); };
  }

  static graph(root) {
    const { content, caption } = shell(root, 'graph-demo', 'A little graph theory', 'Try coloring the nodes');
    const points = [[20, 26], [77, 22], [50, 49], [22, 79], [79, 77]];
    const edges = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 4], [2, 3], [2, 4], [3, 4]];
    const colors = ['#a8b9ff', '#f5b39c', '#c3d79b'];
    const colorNames = ['blue', 'peach', 'green'];
    let values = [0, 0, 0, 0, 0];
    const field = Dom.create('div', 'graph-field');
    field.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="graph-edges" aria-hidden="true">${edges.map(([a, b]) => `<path d="M${points[a][0]} ${points[a][1]}L${points[b][0]} ${points[b][1]}" stroke="#8696cb" stroke-width=".7"/>`).join('')}</svg>`;
    const status = Dom.create('span', '', 'Tap a node. Connected nodes need different colors.');
    status.setAttribute('role', 'status');
    const nodes = points.map(([x, y], i) => {
      const button = Dom.create('button', 'graph-node', String.fromCharCode(65 + i));
      button.type = 'button'; button.style.left = `${x}%`; button.style.top = `${y}%`;
      button.addEventListener('click', () => { values[i] = (values[i] + 1) % 3; update(true); });
      field.append(button);
      return button;
    });
    function update(announce) {
      nodes.forEach((button, i) => { button.style.setProperty('--node-color', colors[values[i]]); button.setAttribute('aria-label', `Node ${String.fromCharCode(65 + i)}, ${colorNames[values[i]]}. Activate to change color.`); });
      if (announce) {
        const conflicts = edges.filter(([a, b]) => values[a] === values[b]).length;
        status.textContent = conflicts ? `${conflicts} connection${conflicts === 1 ? '' : 's'} still share a color. Keep going.` : 'Nicely solved. Every connected pair is different.';
      }
    }
    const reset = Dom.create('button', 'demo-button', 'Reset');
    reset.type = 'button'; reset.addEventListener('click', () => { values = [0, 0, 0, 0, 0]; update(false); status.textContent = 'Tap a node. Connected nodes need different colors.'; });
    update(false); content.append(field); caption.append(status, reset);
  }
}
