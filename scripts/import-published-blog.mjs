// Refresh the public article snapshot used when microCMS build credentials are absent.
// Reads only published wa-node.com pages; never sends changes to the original website.
import fs from 'node:fs/promises';
import { parse, serialize } from 'parse5';
const origin = 'https://www.wa-node.com';
const walk = node => [node, ...(node.childNodes || []).flatMap(walk)];
const attr = (node, name) => node?.attrs?.find(item => item.name === name)?.value;
const hasClass = (node, name) => (attr(node,'class') || '').split(/\s+/).includes(name);
const plain = node => node ? node.nodeName === '#text' ? node.value : (node.childNodes || []).map(plain).join('') : '';
async function fetchDocument(path) {
 const response = await fetch(new URL(path,origin),{signal:AbortSignal.timeout(45000)});
 if(!response.ok) throw new Error(`Public snapshot failed: ${path} (${response.status})`);
 return parse(await response.text());
}
const index = await fetchDocument('/blog/');
const paths = [...new Set(walk(index).filter(node=>node.tagName==='a').map(node=>attr(node,'href')).filter(path=>/^\/blog\/[^/]+\/?$/.test(path||'')))];
if(!paths.length) throw new Error('No public blog posts found; existing snapshot kept.');
const results = await Promise.allSettled(paths.map(async path=>{
 const doc = await fetchDocument(path); const nodes=walk(doc);
 const header = nodes.find(node=>hasClass(node,'post-header'));
 const content = nodes.find(node=>hasClass(node,'content-wrap'));
 const hero = nodes.find(node=>hasClass(node,'post-hero'));
 const title = plain(walk(header).find(node=>node.tagName==='h1')).trim();
 const date = attr(walk(header).find(node=>node.tagName==='time'),'datetime');
 const picture = hero ? walk(hero).find(node=>node.tagName==='img') : null;
 if(!content || !title || !date) throw new Error(`Missing article content: ${path}`);
 const schema = nodes.filter(node=>node.tagName==='script'&&attr(node,'type')==='application/ld+json').flatMap(node=>{try {const data=JSON.parse(plain(node));return Array.isArray(data)?data:[data];}catch{return[];}}).find(item=>item['@type']==='BlogPosting');
 const tags = nodes.find(node=>hasClass(node,'tags'));
 return {id:path.split('/').filter(Boolean)[1],title,publishedAt:date,createdAt:date,updatedAt:schema?.dateModified||date,revisedAt:schema?.dateModified||date,description:attr(nodes.find(node=>node.tagName==='meta'&&attr(node,'name')==='description'),'content'),content:serialize(content),tags:tags?walk(tags).filter(node=>node.tagName==='span').map(node=>plain(node).replace(/^#/,'')):[],...(picture?{eyecatch:{url:new URL(attr(picture,'src'),origin).href,width:Number(attr(picture,'width'))||1200,height:Number(attr(picture,'height'))||675}}:{}),sourceUrl:new URL(path,origin).href};
}));
const failed = results.filter(result=>result.status==='rejected');
if(failed.length) throw new AggregateError(failed.map(result=>result.reason),'Snapshot incomplete; existing snapshot kept.');
const contents=results.map(result=>result.value).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
await fs.writeFile(new URL('../src/data/blogSnapshot.json',import.meta.url),JSON.stringify({source:origin,importedAt:new Date().toISOString(),contents},null,2)+'\n');
console.log(`Imported ${contents.length} published articles.`);
