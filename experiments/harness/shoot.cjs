// usage: node shoot.cjs <distDir> <outPrefix>  -> desktop(1280) + mobile(375) screenshots of the Team Settings block, plus keyboard/a11y spot check JSON
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const http = require("http"); const fs = require("fs"); const path = require("path");
const [dist, out] = process.argv.slice(2);
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const srv = http.createServer((req, res) => { let p = path.join(dist, decodeURIComponent(req.url.split("?")[0])); if (p.endsWith("/")) p += "index.html";
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { "Content-Type": types[path.extname(p)] || "application/octet-stream" }); res.end(d); }); });
srv.listen(0, async () => {
  const url = `http://127.0.0.1:${srv.address().port}/`;
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" + (fs.existsSync("/opt/pw-browsers/chromium/chrome") ? "/chrome" : ""), args: ["--no-sandbox"] }).catch(() => chromium.launch({ args: ["--no-sandbox"] }));
  const report = { url_ok: false };
  const errors = [];
  for (const [label, w] of [["desktop", 1280], ["mobile", 375]]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    page.on("pageerror", e => errors.push(`${label}: ${e.message}`));
    await page.goto(url); await page.waitForTimeout(800);
    // un-stick the site header so element screenshots are not overlapped (same for every run)
    await page.evaluate(() => { for (const el of document.querySelectorAll("body *")) { const p = getComputedStyle(el).position; if (p === "sticky" || p === "fixed") el.style.position = "static"; } });
    const h = page.getByText("Team settings", { exact: true }).first();
    if (!(await h.count())) { report[label] = "heading 'Team settings' not found"; await page.screenshot({ path: `${out}-${label}-full.png` }); continue; }
    report.url_ok = true;
    const handle = await h.evaluateHandle(el => { let n = el; while (n.parentElement && n.parentElement.id !== "root") n = n.parentElement; return n; });
    await handle.asElement().screenshot({ path: `${out}-${label}.png` });
    const box = await handle.asElement().boundingBox();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    report[label] = { block_height: Math.round(box.height), horizontal_overflow: overflow };
    if (label === "desktop") {
      // keyboard spot check: tab through the block and record focused controls
      const focused = [];
      await page.evaluate(() => document.activeElement && document.activeElement.blur());
      await h.scrollIntoViewIfNeeded();
      await page.mouse.click(2, (await h.boundingBox()).y); // focus document near block
      for (let i = 0; i < 30; i++) { await page.keyboard.press("Tab");
        const f = await page.evaluate((root) => { const a = document.activeElement; if (!a || !root.contains(a)) return null;
          const name = a.getAttribute("aria-label") || (a.labels && a.labels[0] && a.labels[0].innerText) || a.innerText || a.getAttribute("placeholder") || "";
          return `${a.tagName.toLowerCase()}${a.getAttribute("role") ? "[" + a.getAttribute("role") + "]" : ""}:${name.trim().slice(0, 30)}`; }, handle);
        if (f) focused.push(f); }
      report.keyboard_focus_sequence = focused;
      report.headings = await handle.evaluate(r => [...r.querySelectorAll("h1,h2,h3,h4,h5,h6,[role=heading]")].map(x => `${x.tagName.toLowerCase()}:${x.innerText.trim().slice(0, 30)}`));
      report.unlabelled_controls = await handle.evaluate(r => [...r.querySelectorAll("input,select,textarea,button,[role=switch],[role=checkbox]")].filter(e => { const n = e.getAttribute("aria-label") || e.getAttribute("aria-labelledby") || (e.labels && e.labels.length) || (e.innerText || "").trim(); return !n; }).map(e => e.outerHTML.slice(0, 80)));
    }
    await page.close();
  }
  report.page_errors = errors;
  fs.writeFileSync(`${out}-a11y.json`, JSON.stringify(report, null, 1));
  console.log(JSON.stringify({ url_ok: report.url_ok, desktop: report.desktop, mobile: report.mobile, focus_count: (report.keyboard_focus_sequence || []).length, unlabelled: (report.unlabelled_controls || []).length, errors: errors.length }));
  await browser.close(); srv.close();
});
