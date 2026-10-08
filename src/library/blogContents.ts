export interface BlogHeading { id: string; text: string; level: number }

// CMSの本文から目次を作る。既存のアンカーを維持し、同名見出しにも一意なIDを付ける。
export function buildBlogContents(content: string): { content: string; headings: BlogHeading[] } {
  const headings: BlogHeading[] = [];
  const idPattern = /\sid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
  const ids = [...content.matchAll(/<[^>]+\sid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi)].map(match => match[1] ?? match[2] ?? match[3]);
  const used = new Set(ids);
  const seen = new Set<string>();
  const decode = (text: string) => text.replace(/&(?:amp|lt|gt|quot|apos|nbsp|#39|#\d+|#x[\da-f]+);/gi, entity => {
    const named: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&nbsp;': ' ', '&#39;': "'" };
    if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
    const value = entity.toLowerCase().startsWith('&#x') ? parseInt(entity.slice(3), 16) : parseInt(entity.slice(2), 10);
    return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : entity;
  });
  const html = content.replace(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (original, level, attributes, inner) => {
    const text = decode(inner.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
    if (!text) return original;
    const match = attributes.match(idPattern);
    let id = match ? decode(match[1] ?? match[2] ?? match[3]) : '';
    if (!id || seen.has(id)) {
      let index = headings.length + 1;
      do { id = `article-section-${index++}`; } while (used.has(id));
    }
    used.add(id);
    seen.add(id);
    headings.push({ id, text, level: Number(level) });
    const escaped = id.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `<h${level}${attributes.replace(idPattern, '')} id="${escaped}">${inner}</h${level}>`;
  });
  return { content: html, headings };
}
