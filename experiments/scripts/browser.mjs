import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '/opt/codex/cua_node/lib/node_modules/playwright-core/index.mjs';
const [run,url]=process.argv.slice(2);
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const out=path.join(repo,'experiments/traces',run), shots=path.join(repo,'experiments/screenshots');
fs.mkdirSync(shots,{recursive:true});
const result={run_id:run,browser:'system Chromium via provided playwright-core',viewport:{width:1440,height:1000},checks:[],runtime_errors:[],console_errors:[]};
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
result.browser_version=browser.version();
try {
 const page=await browser.newPage({viewport:result.viewport,deviceScaleFactor:1});page.setDefaultTimeout(5000);
 page.on('pageerror',e=>result.runtime_errors.push(e.message));page.on('console',m=>{if(m.type()==='error')result.console_errors.push(m.text())});
 const load=async()=>{await page.goto(url);await page.getByRole('heading',{name:'Team Settings',exact:true}).waitFor();};
 const name=()=>page.getByRole('textbox',{name:/name/i});const email=()=>page.getByRole('textbox',{name:/email/i});
 const save=()=>page.getByRole('button',{name:/^Save(?: changes)?$/i});const cancel=()=>page.getByRole('button',{name:/^Cancel$/i});
 const selects=()=>page.locator('.select-container button.select');
 const remove=()=>page.getByRole('button',{name:/^Remove /i});
 const check=async(id,fn)=>{try{await load();const evidence=await fn();result.checks.push({id,status:'PASS',evidence});}catch(e){result.checks.push({id,status:'FAIL',message:e.message});}console.log(JSON.stringify(result.checks.at(-1)));};
 await check('heading',async()=>{assert.equal(await page.locator('h1').count(),1);return 'One h1 named Team Settings';});
 await page.screenshot({path:path.join(shots,run+'-desktop.png'),fullPage:true});
 fs.writeFileSync(path.join(out,'initial-aria.yml'),await page.locator('body').ariaSnapshot());
 result.initial_controls=await page.locator('input,button').evaluateAll(els=>els.map(e=>({tag:e.tagName,type:e.type,role:e.getAttribute('role'),ariaLabel:e.getAttribute('aria-label'),labels:[...(e.labels||[])].map(l=>l.textContent),text:e.textContent,value:e.value,disabled:e.disabled,class:e.className})));
 await check('populated_fields',async()=>{assert.ok(await name().inputValue());assert.match(await email().inputValue(),/@/);return 'Name and email have accessible labels and nonempty local data';});
 await check('notification_toggle',async()=>{const control=page.getByRole('switch');const before=await control.isChecked();await control.focus();await control.press('Space');assert.notEqual(await control.isChecked(),before);return 'Space toggles controlled switch';});
 await check('role_change',async()=>{assert.equal(await selects().count(),2);const first=selects().first();const before=await first.innerText();await first.click();const option=page.getByRole('option',{name:'Viewer',exact:true});await option.click();assert.match(await first.innerText(),/Viewer/);assert.notEqual(await first.innerText(),before);return 'Two labeled selectors; first changes to Viewer';});
 await check('invalid_email',async()=>{await email().fill('invalid');await save().click();await page.waitForFunction(()=>document.querySelector('input[type=email]')?.getAttribute('aria-invalid')==='true');assert.equal(await email().getAttribute('aria-invalid'),'true');const ids=(await email().getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);const descriptions=await page.evaluate(ids=>ids.map(id=>document.getElementById(id)?.textContent||'').join(' '),ids);assert.match(descriptions,/valid email/i);assert.ok(!/saved successfully|settings saved locally/i.test(await page.getByRole('status').innerText()));await page.screenshot({path:path.join(shots,run+'-invalid.png'),fullPage:true});return {aria_invalid:true,associated_description:descriptions};});
 await check('cancel_restores',async()=>{const original=await name().inputValue();const originalEmail=await email().inputValue();const originalSwitch=await page.getByRole('switch').isChecked();const originalRole=await selects().first().innerText();await name().fill('Unsaved edits');await email().fill('bad');await page.getByRole('switch').focus();await page.getByRole('switch').press('Space');await selects().first().click();await page.getByRole('option',{name:'Viewer',exact:true}).click();await remove().first().click();assert.equal(await selects().count(),1);await cancel().click();assert.equal(await name().inputValue(),original);assert.equal(await email().inputValue(),originalEmail);assert.equal(await page.getByRole('switch').isChecked(),originalSwitch);assert.equal(await selects().count(),2);assert.equal(await selects().first().innerText(),originalRole);return 'Cancel restores initial name/email/toggle/members/role';});
 await check('save_feedback',async()=>{await name().fill('Updated team');await email().fill('updated@example.com');await save().click();await page.getByRole('status').getByText(/saved/i).waitFor();assert.equal(await email().inputValue(),'updated@example.com');return await page.getByRole('status').innerText();});
 await check('disabled_invitation',async()=>{const invite=page.getByRole('button',{name:/Invite member/i});assert.equal(await invite.isDisabled(),true);return 'Invitation is actually disabled';});
 await check('destructive_removal',async()=>{const r=remove().first();assert.match(await r.getAttribute('class'),/button-variant-danger-/);await r.focus();await r.press('Enter');assert.equal(await selects().count(),1);return 'Danger variant; Enter removes one member';});
 await check('remove_focus_retained',async()=>{await remove().first().focus();await remove().first().press('Enter');const active=await page.evaluate(()=>({tag:document.activeElement?.tagName,text:document.activeElement?.textContent}));assert.notEqual(active.tag,'BODY');return active;});
 await check('action_variants',async()=>{assert.match(await save().getAttribute('class'),/button-variant-primary/);assert.match(await cancel().getAttribute('class'),/button-variant-(neutral|subtle)/);return 'Save primary; Cancel neutral/subtle';});
 await check('keyboard_focus',async()=>{await page.keyboard.press('Tab');const focus=await page.evaluate(()=>({tag:document.activeElement?.tagName,focusVisible:document.activeElement?.matches(':focus-visible'),outline:getComputedStyle(document.activeElement).outlineStyle}));assert.equal(focus.tag,'INPUT');assert.equal(focus.focusVisible,true);return focus;});
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
  await check('layout_'+viewport.width,async()=>{await page.setViewportSize(viewport);await page.reload();await page.getByRole('heading',{name:'Team Settings',exact:true}).waitFor();await page.screenshot({path:path.join(shots,run+(viewport.width===390?'-mobile':'-desktop')+'.png'),fullPage:true});const dimensions=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth}));assert.ok(dimensions.scrollWidth<=dimensions.innerWidth,'Horizontal overflow: '+JSON.stringify(dimensions));return dimensions;});
 }
 result.checks.push({id:'runtime_errors',status:result.runtime_errors.length?'FAIL':'PASS',evidence:result.runtime_errors});
} catch(e){result.fatal_error=e.message;}finally{await browser.close();}
fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(result,null,2)+'\n');
process.exitCode=result.fatal_error||result.checks.some(c=>c.status==='FAIL')?1:0;
