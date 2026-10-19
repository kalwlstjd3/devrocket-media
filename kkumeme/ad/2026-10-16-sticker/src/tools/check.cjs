// Logic-only validation. Does not prove that a UI/frame is visible.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),script=fs.readFileSync(path.join(root,'timeline.js'),'utf8');
const elements=new Map();
for(const [,id]of html.matchAll(/id="([^"]+)"/g))elements.set(id,{style:{},textContent:'',innerHTML:'',src:'',getAttribute(name){return this[name];},async decode(){}});
const counts={create:180,place:420,stamp:60,peel:120};
const ctx={console,Math,Number,Array,Promise,Error,document:{getElementById:id=>{assert.ok(elements.has(id),id);return elements.get(id);},images:[],fonts:{load:async()=>[],ready:Promise.resolve()}},fetch:async name=>({ok:true,json:async()=>name==='assets.json'?{placeholder:true}:{frames:counts[name.split('/')[1]]},text:async()=>'<svg></svg>'})};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(script,ctx);
(async()=>{
  for(let n=0;!ctx.ready&&n<50;n++)await new Promise(resolve=>setImmediate(resolve));
  assert.equal(ctx.ready,true,ctx.initError);
  const shots=ctx.AD.shots;assert.equal(shots.length,7);assert.equal(shots[0].start,0);assert.equal(shots.at(-1).end,20);
  for(let i=1;i<shots.length;i++)assert.equal(shots[i-1].end,shots[i].start);
  for(let f=0;f<600;f++){
    const t=f/30;await ctx.render(t);
    for(const el of elements.values())assert.ok(!JSON.stringify(el.style).match(/NaN|Infinity/));
    if(t>=2&&t<17){const src=elements.get('recording').src,m=/recordings\/(\w+)\/f(\d+)\.png/.exec(src);assert.ok(m);assert.ok(Number(m[2])<counts[m[1]],src);}
  }
  const snapshot=()=>JSON.stringify([...elements].map(([id,e])=>[id,e.style]));
  for(const t of ctx.AD.boardTimes){await ctx.render(t);const s=snapshot();await ctx.render(19.9);await ctx.render(0);await ctx.render(t);assert.equal(snapshot(),s);}
  const touch=fs.readFileSync(path.join(__dirname,'touch.cjs'),'utf8'),capture=fs.readFileSync(path.join(__dirname,'capture.cjs'),'utf8');
  assert.ok(touch.includes('Input.dispatchTouchEvent'));assert.doesNotMatch(capture,/\.mouse\./);assert.ok(capture.includes('Sticker did not fully detach'));
  assert.doesNotMatch(html,/[\u{1F300}-\u{1FAFF}]/u);
  console.log('PASS: 600 times, 7 seeks, source frame bounds, touch-only capture contract, no emoji. Render not executed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
