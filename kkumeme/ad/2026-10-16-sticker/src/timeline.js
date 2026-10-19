(() => {
  const $=id=>document.getElementById(id),clamp=n=>Math.max(0,Math.min(1,n));
  const p=(t,a,b)=>clamp((t-a)/(b-a)),out=n=>1-(1-n)**3;
  const back=n=>1+2.70158*(n-1)**3+1.70158*(n-1)**2;
  const SHOTS=[
    {start:0,end:2,key:'hook',caption:'이거, 스티커 돼요'},
    {start:2,end:5,key:'create',folder:'create',caption:'찍기만 하면<br><span class="hl">배경 제거 + 테두리까지</span>'},
    {start:5,end:8,key:'bag',folder:'create',caption:'내 스티커 지퍼백에<br><span class="hl">차곡차곡</span>'},
    {start:8,end:11,key:'place',folder:'place',caption:'꺼내서<br><span class="hl">마음대로 붙이고</span>'},
    {start:11,end:13,key:'stamp',folder:'stamp',caption:'<span class="hl">우표로도</span><br>오려요'},
    {start:13,end:17,key:'peel',folder:'peel',caption:'방문자도<br><span class="hl">떼었다 붙일 수 있어요</span>'},
    {start:17,end:20,key:'brand',caption:'내 마음대로 꾸미고 공유하기'}
  ];
  let counts,assets;
  function index(t,shot){
    if(shot.key==='create'||shot.key==='bag')return Math.min(counts.create-1,Math.floor((t-2)*30));
    const n=counts[shot.folder];return Math.min(n-1,Math.floor((t-shot.start)/(shot.end-shot.start)*n));
  }
  async function image(el,src){if(el.getAttribute('src')!==src){el.src=src;await el.decode();}}
  window.AD={duration:20,fps:30,width:1080,height:1920,shots:SHOTS,boardTimes:[1.5,3.7,6.6,10.3,12.3,15.2,19.2]};
  window.render=async function(t){
    if(!Number.isFinite(t)||t<0||t>20)throw Error('t must be between 0 and 20');
    t=Math.min(t,19.999);
    const shot=SHOTS.find(s=>t>=s.start&&t<s.end);
    $('hook').style.opacity=shot.key==='hook'?'1':'0';$('ui').style.opacity=shot.folder?'1':'0';$('brand').style.opacity=shot.key==='brand'?'1':'0';
    // Every property is derived from t. No CSS transitions or real-time video playback.
    const cut=p(t,.6,1.15),pop=p(t,.78,1.28);
    $('photo').style.opacity=String(1-cut);
    $('photo').style.transform=`rotate(${-5-8*cut}deg) scale(${1-.06*cut})`;
    $('cutout').style.opacity=String(cut);
    $('cutout').style.transform=`translateY(${(1-out(pop))*-28}px) rotate(${-6*(1-pop)}deg) scale(${pop>0?back(pop):.001})`;
    $('tap').style.opacity=t>=.45&&t<.85?String(1-p(t,.45,.85)):'0';$('tap').style.transform=`scale(${.6+1.1*p(t,.45,.85)})`;
    if(shot.folder){
      $('uiCaption').innerHTML=shot.caption;$('uiCaption').style.fontSize=shot.key==='create'||shot.key==='peel'?'38px':'42px';
      const start=shot.key==='bag'?2:shot.start;
      const entry=p(t,start,start+.18);$('phone').style.opacity=String(entry);$('phone').style.transform=`translateY(${(1-out(entry))*45}px)`;
      await image($('recording'),`recordings/${shot.folder}/f${String(index(t,shot)).padStart(4,'0')}.png`);
    }
    const logo=p(t,17,17.45),copy=p(t,17.25,17.7),address=p(t,17.7,18.1);
    $('logo').style.opacity=String(logo);$('logo').style.transform=`scale(${logo>0?back(logo):.001})`;
    $('brandCopy').style.opacity=String(copy);$('brandCopy').style.transform=`translateY(${(1-out(copy))*24}px)`;
    $('brandUrl').style.opacity=String(address);$('address').style.opacity=String(address);
    $('brandCta').style.opacity=String(p(t,18.1,18.5));
    $('draft').style.display=assets?.placeholder?'block':'none';
  };
  window.ready=false;
  (async()=>{
    const get=async src=>{const r=await fetch(src);if(!r.ok)throw Error('Missing '+src);return r.json();};
    assets=await get('assets.json');counts={};
    for(const folder of ['create','place','stamp','peel'])counts[folder]=(await get(`recordings/${folder}/capture.json`)).frames;
    if(counts.create!==180||counts.stamp!==60||counts.peel!==120||counts.place<1)throw Error('Capture counts are incomplete');
    const logo=await fetch('logo.svg');if(!logo.ok)throw Error('Missing brand logo');$('logo').innerHTML=await logo.text();
    const text=document.getElementById('stage').textContent+SHOTS.map(s=>s.caption.replace(/<[^>]*>/g,'')).join('');
    await Promise.all([document.fonts.load('400 42px "Kkume Black Han Sans"',text),document.fonts.load('700 32px "Kkume Gaegu"',text),...Array.from(document.images).filter(i=>i.getAttribute('src')).map(i=>i.decode())]);
    await document.fonts.ready;await window.render(0);window.ready=true;
  })().catch(e=>{window.initError=String(e);console.error(e);});
})();
