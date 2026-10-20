import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '/opt/codex/cua_node/lib/node_modules/playwright-core/index.mjs';
const [run,url]=process.argv.slice(2),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const result={run_id:run,posthoc:true,reason:'Independent reviewer identified missing Save -> edit -> Cancel semantic check and unresolved resource console errors',failed_requests:[],http_errors:[]};
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox'],headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(5000);
 page.on('requestfailed',r=>result.failed_requests.push({url:r.url(),failure:r.failure()?.errorText}));
 page.on('response',r=>{if(r.status()>=400)result.http_errors.push({url:r.url(),status:r.status()})});
 await page.goto(url);const input=page.getByRole('textbox',{name:/name/i});const email=page.getByRole('textbox',{name:/email/i});
 await input.fill('Committed team');await email.fill('committed@example.com');await page.getByRole('button',{name:/^Save(?: changes)?$/i}).click();await page.getByRole('status').getByText(/saved/i).waitFor();
 await input.fill('Uncommitted team');await email.fill('unsaved@example.com');await page.getByRole('button',{name:'Cancel',exact:true}).click();
 result.after_cancel={name:await input.inputValue(),email:await email.inputValue()};result.saved_snapshot_restored=result.after_cancel.name==='Committed team'&&result.after_cancel.email==='committed@example.com';
 await page.reload();await input.waitFor();
 const before=await input.evaluate(e=>({boxShadow:getComputedStyle(e).boxShadow,borderColor:getComputedStyle(e).borderColor,focusVisible:e.matches(':focus-visible')}));
 await page.keyboard.press('Tab');const after=await input.evaluate(e=>({boxShadow:getComputedStyle(e).boxShadow,borderColor:getComputedStyle(e).borderColor,focusVisible:e.matches(':focus-visible'),sdsFocusVisible:e.hasAttribute('data-focus-visible')}));
 result.focus_styles={before,after,changed:before.boxShadow!==after.boxShadow||before.borderColor!==after.borderColor};
 await page.screenshot({path:path.join(root,'experiments/screenshots',run+'-focus.png'),fullPage:true});
}catch(e){result.error=e.message;}finally{await browser.close();}
fs.writeFileSync(path.join(root,'experiments/traces',run,'posthoc.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
