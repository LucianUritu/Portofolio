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
  check('Route control selects a different path', await page.eval(() => {
    document.querySelectorAll('.project-choice')[4].click(); const line = document.querySelector('.route-line'); const before = line.getAttribute('d');
    document.querySelectorAll('.route-options button')[2].click(); return line.getAttribute('d') !== before && document.querySelectorAll('.route-options button[aria-pressed=true]').length === 1;
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
    }
  }
  check('No uncaught browser errors', page.consoleErrors.length === 0);
  const reduced = await browser.newPage({ width: 390, height: 844, mobile: true, reducedMotion: true });
  await reduced.goto('http://127.0.0.1:3006/dist/index.html');
  check('Reduced motion keeps hero content visible without entrance travel', await reduced.eval(() => [...document.querySelectorAll('.title-line>span,.artifact>span')].every(e => +getComputedStyle(e).opacity === 1) && getComputedStyle(document.querySelector('.title-line>span')).animationName === 'none'));
  await reduced.eval(() => { document.querySelectorAll('.project-choice')[1].click(); document.querySelector('.demo-button').click(); });
  check('Reduced motion keeps traffic still', await reduced.eval(() => document.querySelector('.traffic-view').classList.contains('is-paused')));
  check('No browser errors under reduced motion', reduced.consoleErrors.length === 0);
  console.log(`${results.length} browser checks passed.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { writeFileSync(new URL('results.json', directory), JSON.stringify(results, null, 2)); await browser.close(); }
