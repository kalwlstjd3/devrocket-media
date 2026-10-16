/* Logic-only check. This does not validate pixels, fonts, layout or video. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),extra=fs.readFileSync(path.join(root,'scenes.js'),'utf8');
const elements=new Map();
function parse(text){for(const [,id] of text.matchAll(/\bid="([^"]+)"/g))if(!elements.has(id))elements.set(id,element(id));}
function element(id){return {id,style:{},src:'',textContent:'',innerHTML:'',querySelector:()=>({style:{}}),insertAdjacentHTML:(_,text)=>parse(text),decode:async()=>{},getAttribute:()=>null};}
parse(html);
const context={console,Math,Promise,Number,Array,Error,document:{getElementById:id=>{assert.ok(elements.has(id),`Missing element ${id}`);return elements.get(id);},images:[],fonts:{load:async()=>[],ready:Promise.resolve()}},fetch:async()=>({text:async()=>'<svg></svg>'})};
context.window=context;vm.createContext(context);
for(const [,script] of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(script,context);
vm.runInContext(extra,context);
(async()=>{
  for(let n=0;!context.ready&&n<100;n++)await new Promise(resolve=>setImmediate(resolve));
  assert.equal(context.ready,true,context.initError);
  const timeline=context.AD.timeline;
  assert.equal(timeline[0].start,0);assert.equal(timeline.at(-1).end,30);
  for(let i=1;i<timeline.length;i++)assert.equal(timeline[i-1].end,timeline[i].start);
  for(let f=0;f<900;f++){
    await context.render(f/30);
    for(const e of elements.values())assert.ok(!JSON.stringify(e.style).match(/NaN|Infinity/),`Invalid motion at ${f}: ${e.id}`);
  }
  const snapshot=()=>JSON.stringify([...elements].map(([id,e])=>[id,e.style]));
  for(const t of context.AD.boardTimes){await context.render(t);const a=snapshot();await context.render(29.9);await context.render(0);await context.render(t);assert.equal(snapshot(),a,`Seeking must be deterministic at ${t}`);}
  assert.equal(elements.has('day-31'),true);assert.equal(elements.has('day-32'),false);
  assert.ok(!/[\u{1F300}-\u{1FAFF}]/u.test(html+extra),'Use drawn SVG, not emoji fallback');
  console.log('PASS: 900 timeline steps, 7 seek comparisons, 31 calendar dates, no emoji. Logic only; render not executed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
