const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const files = ['index.html', 'style.css', 'Lucian Uritu CV main.pdf', 'assets/favicon.svg', 'assets/icons.svg', 'scripts/main.js', 'scripts/core/PortfolioApp.js', 'scripts/components/ProjectDemos.js', 'scripts/animations/ScrollAnimator.js', 'scripts/data/portfolioProfile.js', 'scripts/utils/dom.js', 'scripts/utils/sanitize.js', 'scripts/utils/icons.js', 'scripts/utils/routePlanner.js'];
for (const file of files) {
  const destination = path.join(root, 'dist', file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}
console.log(`Built ${files.length} static files into dist/.`);
