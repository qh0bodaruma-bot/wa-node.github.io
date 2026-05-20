const fs = require('fs');
const files = [
  'src/pages/ai-chat-demo.astro',
  'src/pages/psychology-demo.astro',
  'src/pages/line_demo.astro',
  'src/pages/terms.astro',
  'src/pages/privacy.astro',
  'src/pages/cancel-policy.astro',
  'src/pages/tokutei.astro',
  'src/pages/security-policy.astro',
  'src/pages/terms_miniapp.astro',
  'src/pages/counseling-notes.astro'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/<BaseLayout([^>]*)>/g, (match, p1) => {
      if (!p1.includes('noindex')) {
        return `<BaseLayout${p1} noindex={true}>`;
      }
      return match;
    });
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  }
});
