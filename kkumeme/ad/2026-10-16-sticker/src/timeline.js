(() => {
  const $=id=>document.getElementById(id),clamp=n=>Math.max(0,Math.min(1,n));
  const p=(t,a,b)=>clamp((t-a)/(b-a)),out=n=>1-(1-n)**3;
  const back=n=>1+2.70158*(n-1)**3+1.70158*(n-1)**2;
  const SHOTS=[
    {start:0,end:2.5,key:'hook',caption:'이거, 스티커 돼요'},
    {start:2.5,end:5.7,key:'create',folder:'create',caption:'폰 카메라로 찍으면<br><span class="hl">바로 배경 제거 + 테두리</span>'},
    {start:5.7,end:9.3,key:'bag',folder:'create',caption:'내 스티커 지퍼백에<br><span class="hl">차곡차곡</span>'},
    {start:9.3,end:13.8,key:'place',folder:'place',caption:'꺼내서<br><span class="hl">마음대로 붙이고</span>'},
    {start:13.8,end:15.8,key:'stamp',folder:'stamp',caption:'<span class="hl">우표로도</span><br>오려요'},
    {start:15.8,end:19.8,key:'peel',folder:'peel',caption:'방문자도<br><span class="hl">떼었다 붙일 수 있어요</span>'},
    {start:19.8,end:23,key:'brand',caption:'내 마음대로 꾸미고 공유하기'}
  ];
  let counts,assets,markers;
  function index(t,shot){
    if(shot.key==='create'||shot.key==='bag')return Math.min(counts.create-1,Math.floor((t-2.5)*30));
    if(shot.key==='place'){
      // Skip the zipbag re-open frames (cards still empty) and keep the placing moments.
      const segs=[[0,110],[168,222],[290,counts.place-1]].filter(([a,b])=>b>a),total=segs.reduce((n,[a,b])=>n+b-a,0);
      let k=Math.min(total-1,Math.floor((t-shot.start)/(shot.end-shot.start)*total));
      for(const [a,b] of segs){if(k<b-a)return a+k;k-=b-a;}
      return counts.place-1;
    }
    const n=counts[shot.folder];return Math.min(n-1,Math.floor((t-shot.start)/(shot.end-shot.start)*n));
  }
  async function image(el,src){if(el.getAttribute('src')!==src){el.src=src;await el.decode();}}
  window.AD={duration:23,fps:30,width:1080,height:1920,shots:SHOTS,boardTimes:[1.5,4.6,7.6,11.6,15.0,18.0,22.2]};
  window.render=async function(t){
    if(!Number.isFinite(t)||t<0||t>23)throw Error('t must be between 0 and 23');
    t=Math.min(t,22.999);
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
      const start=shot.key==='bag'?2.5:shot.start;
      const entry=p(t,start,start+.18);$('phone').style.opacity=String(entry);$('phone').style.transform=`translateY(${(1-out(entry))*45}px)`;
      const fi=index(t,shot);
      await image($('recording'),`recordings/${shot.folder}/f${String(fi).padStart(4,'0')}.png`);
      const cam=shot.folder==='create'&&markers&&fi>=markers.cameraStart&&fi<markers.cameraEnd;
      $('cam').style.display=cam?'block':'none';
      if(cam){
        const q=(fi-markers.cameraStart)/(markers.cameraEnd-markers.cameraStart);
        const press=p(q,.55,.68),flash=p(q,.7,1);
        $('camPhoto').style.transform=`scale(${1.08-.08*p(q,0,.5)})`;
        $('camShutter').style.transform=`translateX(-50%) scale(${1-.14*Math.sin(Math.PI*press)})`;
        $('camFinger').style.opacity=q>=.42&&q<.78?'1':'0';
        $('camFlash').style.opacity=String(flash>0?1-flash:0);
      }
    }
    const logo=p(t,19.8,20.25),copy=p(t,20.05,20.5),address=p(t,20.5,20.9);
    $('logo').style.opacity=String(logo);$('logo').style.transform=`scale(${logo>0?back(logo):.001})`;
    $('brandCopy').style.opacity=String(copy);$('brandCopy').style.transform=`translateY(${(1-out(copy))*24}px)`;
    $('brandUrl').style.opacity=String(address);$('address').style.opacity=String(address);
    $('brandCta').style.opacity=String(p(t,20.9,21.3));
    $('draft').style.display=assets?.placeholder?'block':'none';
  };
  window.ready=false;
  (async()=>{
    const get=async src=>{const r=await fetch(src);if(!r.ok)throw Error('Missing '+src);return r.json();};
    assets=await get('assets.json');counts={};
    for(const folder of ['create','place','stamp','peel'])counts[folder]=(await get(`recordings/${folder}/capture.json`)).frames;
    markers=await get('recordings/create/markers.json');if(counts.create<180||counts.stamp!==60||counts.peel!==120||counts.place<1)throw Error('Capture counts are incomplete');
    const logo=await fetch('logo.svg');if(!logo.ok)throw Error('Missing brand logo');$('logo').innerHTML=await logo.text();
    const text=document.getElementById('stage').textContent+SHOTS.map(s=>s.caption.replace(/<[^>]*>/g,'')).join('');
    await Promise.all([document.fonts.load('400 42px "Kkume Black Han Sans"',text),document.fonts.load('700 32px "Kkume Gaegu"',text),...Array.from(document.images).filter(i=>i.getAttribute('src')).map(i=>i.decode())]);
    await document.fonts.ready;await window.render(0);window.ready=true;
  })().catch(e=>{window.initError=String(e);console.error(e);});
})();
