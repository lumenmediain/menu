import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const page=await context.newPage();
const checks=[];const check=(name,result)=>{assert.ok(result,name);checks.push(name);};
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.TEST_URL || 'http://localhost:4400';
const next=()=>page.locator('.corner-next');
const pizza=()=>page.locator('.leaf-rest .theme-pizza').first();
async function findPizza(){for(let n=0;n<20;n++){if(await pizza().count()) return;await next().click();}throw new Error('Pizza missing');}
async function open(){await page.goto(base);await page.evaluate(()=>document.fonts.ready);await findPizza();}
try {
 await open();
 check('data-driven pizza artwork rendered',await pizza().locator('.category-artwork img').count()===1);
 check('resting artwork uses complete alpha cutout crop',await pizza().locator('.category-artwork img').evaluate(e=>getComputedStyle(e).objectFit==='contain')); 
 check('phone pizza copy fits paper',await pizza().locator('.page-content').evaluate(e=>e.scrollHeight<=e.clientHeight+2));
 await page.screenshot({path:'.shots/pizza-mobile-first.png'});
 const trigger=pizza().locator('.menu-item').first();const name=await trigger.locator('.item-name').innerText();
 await trigger.click();await page.locator('dialog[open]').waitFor();
 check('pizza preview retains dynamic dish',await page.locator('#preview-title').innerText()===name);
 await page.screenshot({path:'.shots/pizza-preview.png'});await page.keyboard.press('Escape');
 check('preview restores focus',await trigger.evaluate(e=>e===document.activeElement));
 const axe=await new AxeBuilder({page}).analyze();check('pizza has no serious or critical axe issues',!axe.violations.some(v=>['serious','critical'].includes(v.impact)));
 await next().click();check('continuation retains artwork',await pizza().locator('.category-artwork img').count()===1);
 check('phone continuation fits paper',await pizza().locator('.page-content').evaluate(e=>e.scrollHeight<=e.clientHeight+2));
 await page.screenshot({path:'.shots/pizza-mobile-continuation.png'});
 await page.setViewportSize({width:320,height:568});await open();
 check('small phone has no document overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'.shots/pizza-small-top.png'});
 await pizza().locator('.menu-item').last().scrollIntoViewIfNeeded();await page.screenshot({path:'.shots/pizza-small-bottom.png'});
 check('small phone final dish reachable',await pizza().locator('.menu-item').last().isVisible());
 await page.setViewportSize({width:1440,height:900});await open();
 check('desktop pizza copy fits paper',await pizza().locator('.page-content').evaluate(e=>e.scrollHeight<=e.clientHeight+2));
 await page.screenshot({path:'.shots/pizza-desktop.png'});
 await page.emulateMedia({reducedMotion:'no-preference'});
 const r=await page.locator('.book-stage').boundingBox();
 await page.mouse.move(r.x+r.width-8,r.y+r.height-12);await page.mouse.down();
 await page.mouse.move(r.x+r.width-r.width*.19,r.y+r.height-45,{steps:10});
 check('existing curl includes pizza cutout',await page.locator('.turn-layer .category-artwork img').count()>10);
 check('turn snapshots preserve cutout fit',await page.locator('.turn-layer .category-artwork img').first().evaluate(e=>getComputedStyle(e).objectFit==='contain'));
 await page.screenshot({path:'.shots/pizza-turn.png'});
 await page.mouse.up();await page.waitForFunction(()=>!document.querySelector('.turn-layer'));
 check('zero browser exceptions',errors.length===0);
 await fs.writeFile('.shots/pizza-report.json',JSON.stringify({checks,errors,axe:axe.violations},null,2));
 console.log(`${checks.length} pizza-specific checks passed.`);
} finally {await browser.close();}
