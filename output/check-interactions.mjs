import { Browser } from 'file:///C:/Users/lucia/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const directory = new URL('./interaction-check/', import.meta.url);
mkdirSync(directory, { recursive: true });
const browser = await Browser.launch();
const results = [];
function check(name, value) { results.push({ name, pass: Boolean(value) }); if (!value) throw new Error(name); }
try {
  const page = await browser.newPage({ width: 1440, height: 1000 });
  await page.goto('http://127.0.0.1:3006/dist/index.html');
  check('All six project choices and hero artifacts render', await page.eval(() => document.querySelectorAll('.project-choice').length === 6 && document.querySelectorAll('.artifact').length === 6));
  check('Every link arrow uses SVG, with no font-dependent arrow characters', await page.eval(async () => {
    const sprite = await fetch('assets/icons.svg').then(r => r.text());
    return !/[↗↘↑↓➡⬇⬆]/u.test(document.body.innerText) && document.querySelectorAll('.icon use').length >= 10 && [...document.querySelectorAll('.icon use')].every(use => sprite.includes(`id="${use.getAttribute('href').split('#')[1]}"`));
  }));
  check('Satoshi loads for body type while display headings keep Switzer', await page.eval(async () => {
    await document.fonts.ready;
    return [...document.fonts].some(face => face.family.replace(/["']/g,'') === 'Satoshi' && face.status === 'loaded') && getComputedStyle(document.body).fontFamily.includes('Satoshi') && getComputedStyle(document.querySelector('h1')).fontFamily.includes('Switzer');
  }));
  check('Tiles float without hovering', await page.eval(async () => {
    const tile = document.querySelector('.artifact-float');
    const before = getComputedStyle(tile).transform;
    await new Promise(r => setTimeout(r, 200));
    return getComputedStyle(tile).animationPlayState === 'running' && getComputedStyle(tile).transform !== before;
  }));
  check('Tile motion can be paused and resumed', await page.eval(() => {
    const button = document.querySelector('#motionToggle'); button.click();
    const paused = getComputedStyle(document.querySelector('.artifact-float')).animationPlayState === 'paused';
    button.click(); return paused && button.getAttribute('aria-pressed') === 'false';
  }));
  check('Live authoring updates and escapes HTML', await page.eval(() => {
    const editor = document.querySelector('.book-input');
    editor.value = '# Tested title\n\n<img src=x onerror=alert(1)>';
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    return document.querySelector('.book-preview h4').textContent === 'Tested title' && !document.querySelector('.book-preview img');
  }));
  await page.eval(() => document.querySelector('#work').scrollIntoView({ behavior: 'instant' }));
  for (let i = 0; i < 6; i++) {
    check(`Project ${i + 1} selection updates the accessible state and preview`, await page.eval((i) => {
      const buttons = [...document.querySelectorAll('.project-choice')];
      buttons[i].click();
      return buttons.filter(b => b.getAttribute('aria-pressed') === 'true').length === 1 && buttons[i].getAttribute('aria-pressed') === 'true' && document.querySelector('.detail-heading h3').textContent === buttons[i].querySelector('h3').textContent && document.querySelector('.demo-content').children.length > 0;
    }, i));
    await page.screenshot({ path: new URL(`project-${i + 1}.jpg`, directory).pathname.replace(/^\/(?:([A-Z]:))/, '$1'), quality: 85 });
  }
  await page.eval(() => document.querySelectorAll('.project-choice')[1].click());
  check('Traffic is paused initially and has a pause control', await page.eval(() => {
    const button = document.querySelector('.demo-button');
    const initial = button.getAttribute('aria-pressed') === 'false';
    button.click(); const playing = button.getAttribute('aria-pressed') === 'true' && button.textContent === 'Pause traffic';
    button.click(); return initial && playing && button.getAttribute('aria-pressed') === 'false';
  }));
  await page.eval(() => { document.querySelectorAll('.project-choice')[2].click(); document.querySelector('.demo-button').click(); });
  check('Networking request reaches a completed response', await page.eval(async () => { await new Promise(r => setTimeout(r, 80)); return document.querySelector('[role=status]').textContent.includes('Response received') && !document.querySelector('.demo-button').disabled; }));
  check('Perspective slider changes layer transforms', await page.eval(() => {
    document.querySelectorAll('.project-choice')[3].click(); const layer = document.querySelector('.perspective-layer'); const before = layer.style.transform;
    const input = document.querySelector('input[type=range]'); input.value = '-25'; input.dispatchEvent(new Event('input')); return before !== layer.style.transform;
  }));
  check('Route needs two different selected stops', await page.eval(() => {
    document.querySelectorAll('.project-choice')[4].click();
    const run = document.querySelector('.route-actions button:last-child');
    const initial = run.disabled;
    document.querySelector('[data-stop=A]').click(); document.querySelector('[data-stop=A]').click();
    const one = run.disabled && document.querySelectorAll('.route-stop[aria-pressed=true]').length === 1;
    document.querySelector('[data-stop=L]').click();
    return initial && one && !run.disabled && document.querySelectorAll('.route-stop[aria-pressed=true]').length === 2;
  }));
  check('Route runs from selected start to selected destination', await page.eval(() => {
    document.querySelector('.route-actions button:last-child').click();
    return document.querySelector('.route-line').getAttribute('d').startsWith('M12 20') && document.querySelector('.route-line').getAttribute('d').endsWith('L88 80') && document.querySelector('.route-stop.is-arrived').dataset.stop === 'L' && document.querySelector('.route-demo [role=status]').textContent.includes('Arrived at stop L');
  }));
  check('A new selection clears the completed journey and Reset clears both stops', await page.eval(() => {
    document.querySelector('[data-stop=C]').click();
    const restarted = !document.querySelector('.route-line').hasAttribute('d') && document.querySelector('.route-actions button:last-child').disabled;
    document.querySelector('[data-stop=J]').click(); document.querySelector('.route-actions button:last-child').click();
    const arrived = document.querySelector('.route-stop.is-arrived').dataset.stop === 'J';
    document.querySelector('.route-reset').click();
    return restarted && arrived && !document.querySelectorAll('.route-stop[aria-pressed=true]').length && document.querySelector('.route-traveler').hidden;
  }));
  check('Reset cancels an in-flight journey without a stale arrival', await page.eval(async () => {
    document.querySelector('[data-stop=B]').click(); document.querySelector('[data-stop=K]').click();
    document.querySelector('.route-actions button:last-child').dispatchEvent(new MouseEvent('click', { bubbles:true, detail:1 }));
    const started = document.querySelector('.route-actions button:last-child').disabled;
    document.querySelector('.route-reset').click();
    await new Promise(r => setTimeout(r, 1700));
    return started && !document.querySelector('.route-stop.is-arrived') && document.querySelector('.route-demo [role=status]').textContent.includes('Pick a start');
  }));
  check('Graph puzzle recognizes a valid coloring and resets', await page.eval(() => {
    document.querySelectorAll('.project-choice')[5].click(); const nodes = [...document.querySelectorAll('.graph-node')];
    [0,1,2,1,0].forEach((count,i) => { for(let n=0;n<count;n++) nodes[i].click(); });
    const solved = document.querySelector('[role=status]').textContent.includes('Nicely solved'); document.querySelector('.demo-button').click();
    return solved && nodes.every(n => n.getAttribute('aria-label').includes('blue'));
  }));
  check('CV and external links preserve actual destinations', await page.eval(() => {
    return [...document.querySelectorAll('a[target=_blank]')].every(a => a.rel.includes('noopener')) && document.querySelector('a[download]').getAttribute('href').includes('CV%20main.pdf');
  }));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewport({ width, height: 900, mobile: width < 500 });
    if (width === 390) {
      await page.eval(() => document.querySelectorAll('.project-choice')[0].click());
      check('Touch editor avoids iOS focus zoom', await page.eval(() => !matchMedia('(pointer: coarse)').matches || parseFloat(getComputedStyle(document.querySelector('.book-input')).fontSize) >= 16));
    }
    for (let i=0;i<6;i++) {
      check(`No horizontal overflow at ${width}px, project ${i+1}`, await page.eval((i) => {
        document.querySelectorAll('.project-choice')[i].click();
        return document.documentElement.scrollWidth <= innerWidth + 1;
      },i));
      if (i === 4) check(`Route controls stay inside the preview at ${width}px`, await page.eval(() => {
        const box = document.querySelector('.demo-surface').getBoundingClientRect();
        return [...document.querySelectorAll('.route-stop,.route-actions button')].every(button => { const r=button.getBoundingClientRect(); return r.top >= box.top && r.bottom <= box.bottom + 1 && r.left >= box.left && r.right <= box.right + 1; });
      }));
    }
  }
  check('No uncaught browser errors', page.consoleErrors.length === 0);
  const reduced = await browser.newPage({ width: 390, height: 844, mobile: true, reducedMotion: true });
  await reduced.goto('http://127.0.0.1:3006/dist/index.html');
  check('Reduced motion keeps hero content visible without entrance travel', await reduced.eval(() => [...document.querySelectorAll('.title-line>span,.artifact>span')].every(e => +getComputedStyle(e).opacity === 1) && getComputedStyle(document.querySelector('.title-line>span')).animationName === 'none'));
  check('Reduced motion disables floating tiles', await reduced.eval(() => [...document.querySelectorAll('.artifact-float')].every(e => getComputedStyle(e).animationName === 'none')));
  check('Reduced motion route reaches its destination immediately', await reduced.eval(() => {
    document.querySelectorAll('.project-choice')[4].click(); document.querySelector('[data-stop=A]').click(); document.querySelector('[data-stop=K]').click();
    document.querySelector('.route-actions button:last-child').dispatchEvent(new MouseEvent('click', { bubbles:true, detail:1 }));
    return document.querySelector('.route-stop.is-arrived')?.dataset.stop === 'K';
  }));
  await reduced.eval(() => { document.querySelectorAll('.project-choice')[1].click(); document.querySelector('.demo-button').click(); });
  check('Reduced motion keeps traffic still', await reduced.eval(() => document.querySelector('.traffic-view').classList.contains('is-paused')));
  check('No browser errors under reduced motion', reduced.consoleErrors.length === 0);
  console.log(`${results.length} browser checks passed.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { writeFileSync(new URL('results.json', directory), JSON.stringify(results, null, 2)); await browser.close(); }
