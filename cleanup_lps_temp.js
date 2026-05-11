const fs = require('fs');
const path = require('path');

const dir = './public/portfolio-lp';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const exclude = ['lp_ec.html', 'lp_clinic.html', 'lp_realestate.html', 'lp_lawyer.html'];

const returnBtn = `
<a href="/works" style="position:fixed; bottom:20px; left:20px; background:#2c2c2a; color:#fff; padding:10px 20px; border-radius:30px; text-decoration:none; z-index:9999; font-size:14px; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.2); transition:0.3s;" onmouseover="this.style.background='#d14d3a'" onmouseout="this.style.background='#2c2c2a'">← 制作実績一覧に戻る</a>
`;

files.forEach(file => {
    if (exclude.includes(file)) return;

    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Add Canonical
    if (!content.includes('rel="canonical"')) {
        content = content.replace(/<title>(.*?)<\/title>/i, `<title>$1</title>\n<link rel="canonical" href="https://www.wa-node.com/portfolio-lp/${file}">`);
    }

    // Add Return Button
    if (!content.includes('/works')) {
        content = content.replace('</body>', `${returnBtn}\n</body>`);
    }

    // Replace Placeholders
    content = content.replace(/AAAAA/g, 'Premium');
    content = content.replace(/BBBBB/g, 'Strategy');
    content = content.replace(/CCCCC/g, 'Design');
    content = content.replace(/¥0,000/g, '¥150,000');
    content = content.replace(/0,000円/g, '150,000円');
    content = content.replace(/あああああ/g, '心に響く、最適な導線を。');
    content = content.replace(/いいいいい/g, '確かな技術で、想いを形に。');
    content = content.replace(/ううううう/g, '未来を拓く、スマートな選択。');
    content = content.replace(/えええええ/g, '信頼のパートナーシップ。');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${file}`);
});
