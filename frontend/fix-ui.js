const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix massive target icon
  if (content.includes('')) {
    content = content.replace(/style="width:48px;height:48px;color:var\(--accent-primary\)"/g, '');
    changed = true;
  }
  
  if (content.includes('')) {
    content = content.replace(/style="width: 48px; height: 48px; color: var\(--accent-primary\);"/g, '');
    changed = true;
  }
  
  // Fix search icon massive size
  if (content.includes('')) {
    content = content.replace(//g, '');
    changed = true;
  }
  
  if (content.includes('')) {
    content = content.replace(//g, '');
    changed = true;
  }

  if (content.includes('')) {
    content = content.replace(//g, '');
    changed = true;
  }

  // Fix missed clock emoji
  if (content.includes('<i data-lucide="clock" style="width:1em;height:1em;vertical-align:middle;"></i>')) {
    content = content.replace(/<i data-lucide="clock" style="width:1em;height:1em;vertical-align:middle;"></i>/g, '<i data-lucide="clock" style="width:1em;height:1em;vertical-align:middle;"></i>');
    changed = true;
  }
  
  // Fix <i data-lucide="trending-up" style="width:14px;height:14px;vertical-align:middle;margin-right:2px;"></i> icon
  if (content.includes('<i data-lucide="trending-up" style="width:14px;height:14px;vertical-align:middle;margin-right:2px;"></i>')) {
    content = content.replace(/<i data-lucide="trending-up" style="width:14px;height:14px;vertical-align:middle;margin-right:2px;"></i>/g, '<i data-lucide="trending-up" style="width:14px;height:14px;vertical-align:middle;margin-right:2px;"></i>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed UI in ' + filePath);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules')) walk(fullPath);
    } else {
      if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
        processFile(fullPath);
      }
    }
  });
}

walk('.');
console.log('Done fixing UI sizes and missed emojis.');
