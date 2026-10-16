const { chromium } = require('playwright');
const out = process.argv[2];
(async () => { const b = await chromium.launch();
  try {
    const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2 });
    const p = await ctx.newPage();
    await p.clock.install();
    await p.addInitScript(() => { const base = Date.now(); performance.now = () => Date.now() - base; const raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = (cb) => raf(() => cb(performance.now())); });
    await p.goto('http://127.0.0.1:8766/index.html');
    await p.clock.pauseAt(new Date(Date.now() + 2000));
    await p.clock.runFor(1500);
    await p.setInputFiles('input[type=file]:not([capture])', `${__dirname}/photo-ad.jpg`);
    for (let i=0;i<20;i++) { await p.clock.runFor(50); await p.waitForTimeout(20); }
    const bx = await (await p.$('.stamp-viewfinder')).boundingBox();
    const cx = bx.x+bx.width/2, cy = bx.y+bx.height/2;
    let n = 0; const shot = async () => { await p.screenshot({ path: `${out}/f${String(n++).padStart(3,'0')}.png` }); };
    const tick = async (k=1) => { for (let i=0;i<k;i++){ await p.clock.runFor(33.3); await p.waitForTimeout(5); await shot(); } };
    await p.evaluate(() => document.activeElement && document.activeElement.blur()); await tick(14);
    await p.mouse.move(cx, cy); await p.mouse.down();
    for (let i=1;i<=18;i++){ await p.mouse.move(cx - i*1.8, cy - i*0.7); await tick(1); }
    await p.mouse.up(); await tick(10);
    await p.click('button[aria-label="오려내기"]'); await tick(42);
    await p.click('button[role=tab]:has-text("테두리")'); await tick(9);
    await p.click('.stamp-tile:has-text("얇게")'); await tick(16);
    await p.click('button[role=tab]:has-text("종이")'); await tick(9);
    await p.click('.stamp-tile:has-text("크림")'); await tick(150 - n);
    console.log('frames', n);
    await ctx.close();
  } finally { await b.close(); } })();

