import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const browser=await chromium.launch();const p=await browser.newPage({reducedMotion:'reduce'});const failures=[];const shots=[];let checked=0;
await fs.mkdir('.shots/correction',{recursive:true});
for(const [w,h] of [[320,568],[390,844],[1440,900],[844,390]]) {
 await p.setViewportSize({width:w,height:h});await p.goto('http://localhost:4402');await p.waitForTimeout(160);
 const seen=new Set();
 for(let n=0;n<30;n++) {
  await p.locator('.leaf-rest img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));
  const result=await p.locator('.leaf-rest .printed-page').evaluateAll(es=>es.flatMap(e=>{
   const content=e.querySelector('.page-content,.info-details');const photo=e.querySelector('.category-photo,.category-artwork,.cover-art');const img=photo?.querySelector('img');const pr=photo?.getBoundingClientRect();
   const cr=e.querySelector('.printed-contact')?.getBoundingClientRect();const folio=e.querySelector('.page-folio')?.getBoundingClientRect();
   const menu=[...e.querySelectorAll('.menu-item')];
   return [(content&&content.scrollHeight>content.clientHeight+2)?'content overflow':null,...menu.map(i=>i.getBoundingClientRect().bottom>e.getBoundingClientRect().bottom-64?'dish below footer':null),photo&&(!img?.naturalWidth||pr.height<60||getComputedStyle(photo).display==='none')?'photo missing or too small':null,cr&&folio&&cr.right>folio.left&&cr.left<folio.right&&cr.bottom>folio.top&&cr.top<folio.bottom?'contact overlaps folio':null].filter(Boolean);
  }));checked++;if(result.length)failures.push({w,h,n,result});
  const key=await p.locator('.leaf-rest .printed-page').first().getAttribute('data-category-id')||'cover';
  if(w!==844&&!seen.has(key)) {seen.add(key);const file=`.shots/correction/${w}-${key}.png`;await p.screenshot({path:file});shots.push({file,w,h});}
  if(await p.locator('.corner-next').isDisabled())break;await p.locator('.corner-next').click();
 }
}
// A compact contact sheet of representative renders, for one visual review.
const selected=shots.filter(s=>s.w===390||s.w===320||s.w===1440&&s.file.includes('cover'));const tiles=await Promise.all(selected.map(async(s,i)=>({input:await sharp(s.file).resize(240,520,{fit:'contain',background:'#222'}).png().toBuffer(),left:(i%5)*240,top:Math.floor(i/5)*520})));
await sharp({create:{width:1200,height:Math.ceil(tiles.length/5)*520,channels:3,background:'#222'}}).composite(tiles).png().toFile('.shots/correction/contact-sheet.png');
await fs.writeFile('.shots/correction/fit.json',JSON.stringify({checked,failures},null,2));console.log(JSON.stringify({checked,failures}));await browser.close();if(failures.length)process.exitCode=1;
