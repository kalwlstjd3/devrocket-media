const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); try {
  const p = await b.newPage({ viewport:{width:540,height:960}, deviceScaleFactor:2 }); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8767/index.html'); await p.waitForFunction(()=>window.ready===true,null,{timeout:20000});
  for (const t of (process.argv[2]||'1.4,4.8,7.0,8.4,12.6,14.8').split(',').map(Number)) {
    await p.evaluate((t)=>window.render(t), t); await p.waitForTimeout(80);
    await p.locator('#stage').screenshot({ path: `${__dirname}/board-${t}.png` }); }
  console.log('errors', errs);
} finally { await b.close(); } })();
