const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); try {
  const p = await b.newPage({ viewport:{width:540,height:960}, deviceScaleFactor:2 }); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8767/index.html'); await p.waitForFunction(()=>window.ready===true,null,{timeout:20000});
  const el = p.locator('#stage');
  for (let f=0; f<450; f++) { await p.evaluate((t)=>window.render(t), f/30);
    await el.screenshot({ path: `${__dirname}/frames/f${String(f).padStart(3,'0')}.png` }); }
  console.log('errors', errs);
} finally { await b.close(); } })();
