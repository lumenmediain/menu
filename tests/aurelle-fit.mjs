import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const b=await chromium.launch();const p=await b.newPage({reducedMotion:'reduce'});const failures=[];let checked=0;
for(const [w,h] of [[320,568],[390,844],[844,390],[1440,900]]){
 await p.setViewportSize({width:w,height:h});await p.goto('http://localhost:4400');await p.waitForTimeout(180);
 for(let n=0;n<30;n++){
  const bad=await p.locator('.leaf-rest .printed-page').evaluateAll(es=>es.flatMap(e=>{
   const content=e.querySelector('.page-content,.info-details');const footer=e.getBoundingClientRect().bottom-70;
   const items=[...e.querySelectorAll('.menu-item')];
   return [(content&&content.scrollHeight>content.clientHeight+2)?'content overflow':null,...items.map(i=>i.getBoundingClientRect().bottom>footer+3?'item below footer':null)].filter(Boolean);
  }));checked++;if(bad.length)failures.push({w,h,n,bad});
  if(w===320||w===844)await p.screenshot({path:`.shots/aurelle-${w}-${n}.png`});
  const next=p.locator('.corner-next');if(await next.isDisabled())break;await next.click();
 }
}
await fs.writeFile('.shots/aurelle-fit.json',JSON.stringify({checked,failures},null,2));console.log(JSON.stringify({checked,failures}));await b.close();if(failures.length)process.exitCode=1;
