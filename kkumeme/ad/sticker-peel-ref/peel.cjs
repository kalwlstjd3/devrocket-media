const { chromium } = require('playwright');
const out = process.argv[2], W = __dirname;
(async () => { const b = await chromium.launch();
  try {
    const ctx = await b.newContext({ viewport:{width:390,height:693}, deviceScaleFactor:1080/390, hasTouch:true, isMobile:true });
    const p = await ctx.newPage();
    const errs=[]; p.on('pageerror', e=>errs.push(String(e)));
    await p.clock.install();
    await p.addInitScript(() => { const base = Date.now(); performance.now = () => Date.now() - base; const raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = (cb) => raf(() => cb(performance.now())); });
    await p.goto('http://127.0.0.1:8767/index.html');
    await p.clock.pauseAt(new Date(Date.now() + 2000));
    for (let i=0;i<40;i++){ await p.clock.runFor(100); await p.waitForTimeout(20); }
    const cdp = await ctx.newCDPSession(p);
    const els = await p.$$('.sticker-peel-target'); console.log('targets', els.length);
    const bx = await els[0].boundingBox(); console.log(bx);
    let n=0; const shot = async()=>{ await p.screenshot({path:`${out}/f${String(n++).padStart(3,'0')}.png`}); };
    const tick = async(k=1)=>{ for(let i=0;i<k;i++){ await p.clock.runFor(33.3); await p.waitForTimeout(5); await shot(); } };
    const finger = (x,y,show=true)=>p.evaluate(([x,y,s])=>{const f=document.getElementById('finger'); f.style.display=s?'block':'none'; f.style.left=x+'px'; f.style.top=y+'px';},[x,y,show]);
    const touch = (type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type, touchPoints: type==='touchEnd'?[]:[{x,y,id:1,radiusX:10,radiusY:10,force:1}]});
    await tick(10);
    // start near bottom-right corner (edge band)
    let x = bx.x + bx.width*0.88, y = bx.y + bx.height*0.9;
    await finger(x,y); await tick(4);
    await touch('touchStart',x,y); await tick(3);
    // peel toward upper-left
    const tx = bx.x - bx.width*0.25, ty = bx.y - bx.height*0.12;
    const steps=36; const sx=x, sy=y;
    for(let i=1;i<=steps;i++){ const k=i/steps, e=k*k*(3-2*k); x=sx+(tx-sx)*e; y=sy+(ty-sy)*e; await touch('touchMove',x,y); await finger(x,y); await tick(1); }
    // carry to new spot
    const dx = 250, dy = 470; const cx=x, cy=y;
    for(let i=1;i<=24;i++){ const k=i/24, e=k*k*(3-2*k); x=cx+(dx-cx)*e; y=cy+(dy-cy)*e - Math.sin(k*Math.PI)*30; await touch('touchMove',x,y); await finger(x,y); await tick(1); }
    await tick(4);
    await touch('touchEnd',x,y); await finger(x,y,false); await tick(24);
    console.log('frames', n, 'errors', errs);
    await ctx.close();
  } finally { await b.close(); } })();
