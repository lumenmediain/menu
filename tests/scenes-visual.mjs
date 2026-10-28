import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const browser=await chromium.launch();const p=await browser.newPage({reducedMotion:'reduce'});const failures=[];const shots=[];let checked=0;
await fs.mkdir('.shots/scenes',{recursive:true});
for(const [w,h] of [[360,740],[390,844],[430,932],[1440,900],[320,568],[844,390]]) {
 await p.setViewportSize({width:w,height:h});await p.goto(process.env.TEST_URL || 'http://localhost:4403');await p.waitForTimeout(160);
 const seen=new Set();
 for(let n=0;n<30;n++) {
  await p.locator('.leaf-rest img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));
  const result=await p.locator('.leaf-rest .printed-page').evaluateAll(es=>es.flatMap(e=>{
   const content=e.querySelector('.page-content,.info-details');const photo=e.querySelector('.page-scene,.cover-art');const img=photo?.querySelector('img');const pr=photo?.getBoundingClientRect();
   const cr=e.querySelector('.printed-contact')?.getBoundingClientRect();const folio=e.querySelector('.page-folio')?.getBoundingClientRect();
   const menu=[...e.querySelectorAll('.menu-item')];
   const expected={cover:'/images/coffee-cup.jpg',coffee:'/images/coffee-cup.jpg',breakfast:'/images/breakfast.jpg',pizza:'/images/scenes/pizza.webp',desserts:'/images/dessert.jpg',drinks:'/images/cold-brew.jpg',beverages:'/images/cold-brew.jpg'};
   const key=e.dataset.backgroundKey;
   if(expected[key]&&e.dataset.backgroundSource!==expected[key])return ['wrong category background'];
   if(e.classList.contains('scene-composed')&&menu.length>1)return ['artwork text exceeds safe area capacity'];
   if(photo&&e.querySelectorAll('.page-scene,.cover-art').length!==1)return ['duplicate category photograph'];
   return [(content&&content.scrollHeight>content.clientHeight+2)?'content overflow':null,...menu.map(i=>i.getBoundingClientRect().bottom>e.getBoundingClientRect().bottom-64?'dish below footer':null),photo&&(!img?.naturalWidth||pr.height<60||getComputedStyle(photo).display==='none')?'photo missing or too small':null,cr&&folio&&cr.right>folio.left&&cr.left<folio.right&&cr.bottom>folio.top&&cr.top<folio.bottom?'contact overlaps folio':null].filter(Boolean);
  }));checked++;if(result.length)failures.push({w,h,n,result});
  let key=await p.locator('.leaf-rest .printed-page').first().getAttribute('data-category-id')||'cover';
  if(w===390&&await p.locator('.leaf-rest .printed-page').first().evaluate(e=>e.classList.contains('continuation')))key+='-continued';
  if(w!==844&&!seen.has(key)) {seen.add(key);const file=`.shots/scenes/${w}-${key}.png`;await p.screenshot({path:file});shots.push({file,w,h});}
  if(await p.locator('.corner-next').isDisabled())break;await p.locator('.corner-next').click();
 }
}
// A compact contact sheet of representative renders, for one visual review.
const selected=shots.filter(s=>s.w===390||s.w===360||s.w===430&&s.file.includes('pizza')||s.w===1440&&s.file.includes('cover'));const tiles=await Promise.all(selected.map(async(s,i)=>({input:await sharp(s.file).resize(240,520,{fit:'contain',background:'#222'}).png().toBuffer(),left:(i%5)*240,top:Math.floor(i/5)*520})));
await sharp({create:{width:1200,height:Math.ceil(tiles.length/5)*520,channels:3,background:'#222'}}).composite(tiles).png().toFile('.shots/scenes/contact-sheet.png');
await fs.writeFile('.shots/scenes/fit.json',JSON.stringify({checked,failures},null,2));console.log(JSON.stringify({checked,failures}));await browser.close();if(failures.length)process.exitCode=1;
