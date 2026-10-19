const fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {startServer}=require('./tools/server.cjs');
(async()=>{
  const server=await startServer(__dirname);let browser;
  try{
    browser=await chromium.launch({headless:true});
    const page=await browser.newPage({viewport:{width:540,height:960},deviceScaleFactor:2}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
    await page.route('**/*',route=>new URL(route.request().url()).origin===server.origin?route.continue():route.abort());
    await page.goto(server.origin+'/index.html');
    await page.waitForFunction(()=>window.ready||window.initError,null,{timeout:60000});
    const initError=await page.evaluate(()=>window.initError);if(initError)throw Error(initError);
    const metadata=await page.evaluate(()=>window.AD);
    if(metadata.duration!==20||metadata.fps!==30)throw Error('Unexpected timeline');
    const out=path.join(__dirname,'frames');fs.mkdirSync(out,{recursive:true});
    for(let f=0;f<600;f++){
      await page.evaluate(t=>window.render(t),f/30);
      await page.locator('#stage').screenshot({path:path.join(out,`f${String(f).padStart(3,'0')}.png`)});
      if(errors.length)throw Error(errors.join('\n'));
      if(f%150===0)console.log(`captured ${f}/600`);
    }
    const board=[];
    for(const [i,t] of metadata.boardTimes.entries()){
      await page.evaluate(t=>window.render(t),t);
      const png=await page.locator('#stage').screenshot();
      board.push({png:png.toString('base64'),label:metadata.shots[i].caption.replace(/<[^>]*>/g,''),time:t});
    }
    const contact=await browser.newPage({viewport:{width:876,height:1670},deviceScaleFactor:1});
    await contact.setContent(`<html><head><meta charset="utf-8"><link rel="stylesheet" href="${server.origin}/fonts.css"><style>body{margin:0;padding:24px;background:#fff9ee;color:#493165;font:18px "Kkume Gaegu",sans-serif}h1{font:28px "Kkume Black Han Sans",sans-serif;margin:0 0 18px}main{display:grid;grid-template-columns:repeat(3,264px);gap:18px}figure{margin:0}img{width:264px;display:block;border-radius:12px}figcaption{height:44px;padding-top:6px;font-weight:700;font-size:16px;line-height:20px}</style></head><body><h1>꾸밈 · 스티커 20초 스토리보드</h1><main>${board.map(b=>`<figure><img src="data:image/png;base64,${b.png}"><figcaption>${b.time.toFixed(1)}s · ${b.label}</figcaption></figure>`).join('')}</main></body></html>`);
    await contact.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).map(x=>x.decode()));});
    await contact.screenshot({path:path.join(__dirname,'../board.png'),fullPage:true});
    const output=path.join(__dirname,'../kkume-sticker-ad-20s.mp4');
    const enc=spawnSync('ffmpeg',['-y','-framerate','30','-start_number','0','-i',path.join(out,'f%03d.png'),'-frames:v','600','-an','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','slow','-movflags','+faststart',output],{stdio:'inherit'});
    if(enc.status!==0)throw Error('ffmpeg encoding failed');
    const probe=spawnSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',output],{encoding:'utf8'});
    if(probe.status!==0)throw Error('ffprobe failed');
    const info=JSON.parse(probe.stdout),video=info.streams.find(s=>s.codec_type==='video');
    if(!video||video.width!==1080||video.height!==1920||video.r_frame_rate!=='30/1'||Number(video.nb_frames)!==600||Number(info.format.duration)>20.001||info.streams.some(s=>s.codec_type==='audio'))throw Error('Output metadata mismatch');
    fs.writeFileSync(path.join(__dirname,'../render-result.json'),JSON.stringify({status:'rendered-awaiting-visual-review',metadata,probe:info,errors},null,2));
    console.log('Rendered MP4 + board; visual review is still required.');
  }finally{if(browser)await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
