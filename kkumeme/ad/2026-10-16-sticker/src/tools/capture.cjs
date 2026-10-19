/* Real UI capture, not yet executed in GPT's environment.
   All API requests are intercepted locally. All recorded pointing uses CDP touch. */
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {startServer}=require('./server.cjs');
const {installMock}=require('./mock.cjs');
const {touchDriver}=require('./touch.cjs');
const root=path.resolve(__dirname,'..');
async function warm(page){await page.clock.runFor(1000);await page.waitForTimeout(40);}
async function setup(browser,server,mode){
  const context=await browser.newContext({viewport:{width:390,height:826},deviceScaleFactor:2,hasTouch:true,isMobile:true,reducedMotion:'no-preference'});
  const state=await installMock(context,server.origin,root),page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install({time:new Date('2026-10-16T03:00:00Z')});
  await page.addInitScript(()=>{
    const base=Date.now();performance.now=()=>Date.now()-base;
    const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(()=>cb(performance.now()));
    // Avoid access to physical cameras. Album input is used in the take.
    if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=async()=>{throw Error('Offline recording uses album input');};
  });
  await page.goto(server.origin+`/work/${mode}.html`);
  await page.waitForSelector(mode==='editor'?'.notebook-add':mode==='stamp'?'.stamp-maker':'.sticker-peel-target');
  await page.evaluate(()=>document.fonts.ready);
  const now=await page.evaluate(()=>Date.now());await page.clock.pauseAt(new Date(now+2000));await warm(page);
  return{context,page,state,errors};
}
async function advanceUntil(driver,predicate,max=300){for(let i=0;i<max;i++){if(await predicate())return;await driver.tick();}throw Error('UI did not settle within recording budget');}
async function openPanel(page,d){
  await d.tap(page.locator('.notebook-add'));
  await d.tap(page.locator('.notebook-insert button').filter({hasText:/^스티커$/}));
  await advanceUntil(d,()=>page.locator('.zipbag-entry').isVisible(),90);
}
async function openBag(page,d){await openPanel(page,d);await d.tap(page.locator('.zipbag-entry'));await advanceUntil(d,()=>page.locator('.zipbag-scene[data-busy="false"] .user-sticker-grid').isVisible(),180);}
async function pickAlbum(page,d){
  const choice=page.waitForEvent('filechooser');
  await d.tap(page.getByRole('button',{name:'앨범에서 고르기',exact:true}));
  await (await choice).setFiles(path.join(root,'work/original.png'));
}
async function pickCamera(page,d){
  // 「사진 찍기」 opens the phone camera (capture input). The native camera is drawn in the
  // composite (timeline.js #cam) over the frames recorded between tap and file selection.
  await d.tick(10);
  const choice=page.waitForEvent('filechooser');
  await d.tap(page.getByRole('button',{name:'사진 찍기',exact:true}));
  const chooser=await choice;
  const cameraStart=d.frames;await d.tick(36);const cameraEnd=d.frames;
  await chooser.setFiles(path.join(root,'work/original.png'));
  return{cameraStart,cameraEnd};
}
(async()=>{
  const server=await startServer(root);let browser;
  const contexts=[];
  try{
    browser=await chromium.launch({headless:true});
    const editor=await setup(browser,server,'editor');contexts.push(editor.context);
    const {page,state}=editor,d=await touchDriver(page,editor.context,root,'create');d.pause();
    await openPanel(page,d);d.resume();await d.tick(6);
    await d.tap(page.locator('.zipbag-make').filter({hasText:'스티커'}));
    const markers=await pickCamera(page,d);
    while(d.frames<220)await d.tick();
    if(!state.created)throw Error('Mock upload was not called');
    d.finish();
    fs.writeFileSync(path.join(root,'recordings/create/markers.json'),JSON.stringify(markers));
    d.pause();await advanceUntil(d,()=>page.locator('.zipbag-scene[data-busy="false"] .user-sticker-grid').isVisible(),180);
    const placement=await touchDriver(page,editor.context,root,'place');
    for(const [index,name]of ['고양이','하트','꽃'].entries()){
      if(index)await openBag(page,placement);
      await placement.tap(page.getByRole('button',{name:name+' 붙이기',exact:true}));
      await advanceUntil(placement,async()=>!(await page.locator('.zipbag-dialog').count()),180);
      const selected=page.locator('.paper [data-element-id]').filter({has:page.locator(`img[src="/api/assets/${require('./mock.cjs').IDS[['cat','heart','flower'][index]]}"]`)}).last();
      const b=await selected.boundingBox();if(!b)throw Error('Placed sticker is not visible');
      const to=[{x:155,y:290},{x:105,y:470},{x:280,y:490}][index];
      await placement.drag({x:b.x+b.width/2,y:b.y+b.height/2},to,15);
      if(index===0){
        const handle=page.getByRole('button',{name:'se 방향으로 크기 조절',exact:true});
        // Handles may be non-button semantic elements; fall back to the exact accessible label.
        const resize=await handle.count()?handle:page.locator('[aria-label="se 방향으로 크기 조절"]');
        const r=await resize.boundingBox();if(!r)throw Error('Resize handle not visible');
        await placement.drag({x:r.x+r.width/2,y:r.y+r.height/2},{x:r.x+r.width/2-22,y:r.y+r.height/2-25},12);
        const rotate=page.locator('[aria-label="회전: 끌어서 돌리기, 방향키로 조절"]');
        const rb=await rotate.boundingBox();if(!rb)throw Error('Rotation handle not visible');
        await placement.drag({x:rb.x+rb.width/2,y:rb.y+rb.height/2},{x:rb.x+rb.width/2+25,y:rb.y+rb.height/2+8},12);
      }
      await placement.tick(8);
    }
    const placeFrames=placement.finish();
    fs.writeFileSync(path.join(root,'recordings/editor-audit.json'),JSON.stringify({calls:state.calls,creationFrames:d.frames,placeFrames,errors:editor.errors},null,2));
    if(editor.errors.length)throw Error(editor.errors.join('\n'));

    const stamp=await setup(browser,server,'stamp');contexts.push(stamp.context);
    await stamp.page.locator('input[type=file]:not([capture])').setInputFiles(path.join(root,'work/original.png'));
    for(let i=0;i<30;i++){await stamp.page.clock.runFor(50);await stamp.page.waitForTimeout(10);if(await stamp.page.locator('.stamp-viewfinder.is-still').count())break;}
    const sd=await touchDriver(stamp.page,stamp.context,root,'stamp');await sd.tick(8);
    await sd.tap(stamp.page.getByRole('button',{name:'오려내기',exact:true}));
    while(sd.frames<60)await sd.tick();sd.finish();
    if(stamp.errors.length)throw Error(stamp.errors.join('\n'));

    const pub=await setup(browser,server,'public');contexts.push(pub.context);
    const pd=await touchDriver(pub.page,pub.context,root,'peel');
    const target=pub.page.locator('.sticker-peel-target').first(),b=await target.boundingBox();
    if(!b)throw Error('Public sticker is not visible');
    const start={x:b.x+b.width*.1,y:b.y+b.height*.1};
    // Cat has rotation 0. Peel from its top-left edge to beyond the bottom-right.
    const end={x:b.x+b.width*1.6,y:b.y+b.height*1.5};
    if(end.x>365||end.y>760)throw Error('Peel path leaves viewport; adjust fixture, never clamp the gesture');
    await pd.tick(8);await pd.touch('touchStart',start.x,start.y);await pd.tick(4);
    for(let i=1;i<=36;i++){const p=i/36,e=p*p*(3-2*p);await pd.touch('touchMove',start.x+(end.x-start.x)*e,start.y+(end.y-start.y)*e);await pd.tick();}
    const lifted=await pub.page.locator('.sticker-peel-lifted').count();
    if(!lifted)throw Error('Sticker did not fully detach; do not label a snap-back as success');
    const destination={x:270,y:540};
    for(let i=1;i<=24;i++){const p=i/24,e=p*p*(3-2*p);await pd.touch('touchMove',end.x+(destination.x-end.x)*e,end.y+(destination.y-end.y)*e-Math.sin(p*Math.PI)*24);await pd.tick();}
    await pd.tick(4);await pd.touch('touchEnd',destination.x,destination.y);
    while(pd.frames<120)await pd.tick();pd.finish();
    fs.writeFileSync(path.join(root,'recordings/peel-audit.json'),JSON.stringify({lifted,errors:pub.errors,start,end,destination,pointerType:'touch'},null,2));
    if(pub.errors.length)throw Error(pub.errors.join('\n'));
    console.log('Real UI source takes captured. Review screenshots and retimed cuts before approval.');
  }finally{for(const c of contexts)await c.close();if(browser)await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
