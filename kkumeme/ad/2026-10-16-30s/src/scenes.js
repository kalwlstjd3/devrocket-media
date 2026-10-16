/* HTML motion approximations, not recordings of the editor.
   Calendar: paper theme, fixed October 2026, manually placed decoration.
   Map: original schematic drawing, fixed view; no tiles/navigation/geotagging. */
(() => {
  const stage = document.getElementById('stage');
  const icons = {
    letter: '<svg viewBox="0 0 100 100"><g stroke="#fff" stroke-width="10" stroke-linejoin="round" paint-order="stroke"><rect x="10" y="22" width="80" height="57" rx="7" fill="#ffe483"/></g><path d="M13 27L50 54L87 27M13 75L35 52M87 75L65 52" fill="none" stroke="#493165" stroke-width="4"/><path d="M50 54C32 42 36 30 45 34L50 39L55 34C64 30 68 42 50 54" fill="#ff8fab"/></svg>',
    cup: '<svg viewBox="0 0 100 100"><g stroke="#fff" stroke-width="10" paint-order="stroke" stroke-linejoin="round"><path d="M22 33H68V69Q45 87 22 69Z" fill="#ffc9d6"/><path d="M69 39H79Q95 54 76 63H69" fill="none" stroke="#fff" stroke-width="15"/></g><path d="M69 39H79Q95 54 76 63H69M28 84H75" fill="none" stroke="#493165" stroke-width="5" stroke-linecap="round"/><path d="M34 21Q26 13 36 7M54 21Q46 13 56 7" fill="none" stroke="#493165" stroke-width="4" stroke-linecap="round"/></svg>',
    flower: '<svg viewBox="0 0 100 100"><g fill="#a8d8ff" stroke="#fff" stroke-width="10" paint-order="stroke"><circle cx="50" cy="25" r="20"/><circle cx="75" cy="50" r="20"/><circle cx="50" cy="75" r="20"/><circle cx="25" cy="50" r="20"/></g><circle cx="50" cy="50" r="17" fill="#ffe483"/><circle cx="44" cy="47" r="2.5" fill="#493165"/><circle cx="56" cy="47" r="2.5" fill="#493165"/><path d="M44 55Q50 60 56 55" fill="none" stroke="#493165" stroke-width="3"/></svg>'
  };
  const holidays = {3:'개천절',5:'대체공휴일',9:'한글날'};
  let cells = '';
  for(let i=0;i<35;i++) {
    const day=i-3, valid=day>=1&&day<=31, weekday=i%7;
    const tone=weekday===0||holidays[day]?'red':weekday===6?'blue':'';
    cells+=`<div class="calendar-day ${tone}" ${valid?`id="day-${day}"`:''}>${valid?`<span class="day-number">${day}</span><span class="day-holiday">${holidays[day]||''}</span>`:''}</div>`;
  }
  stage.insertAdjacentHTML('beforeend', `
    <section id="calendarScene" class="feature-scene">
      <div id="calendarCap" class="abs cap">달력에<br><span class="hl">하루하루 붙이고</span></div>
      <div id="calendarPhone" class="abs phone"><div class="notch"></div><div class="screen"><div class="dots"></div>
        <div class="page-heading">나의 10월 기록</div>
        <div class="paper-calendar"><div class="calendar-head"><div class="month-tile">10</div><div><strong>10월의 기록</strong><small>2026 · 소중한 날들</small></div></div>
          <div class="weekdays"><span class="red">SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span class="blue">SAT</span></div>
          <div class="calendar-days">${cells}</div>
        </div><div id="calendarFoot" class="page-footnote">별일 없어도, 남겨 두기</div><div id="calendarTap" class="scene-tap"></div>
      </div></div>
    </section>
    <section id="mapScene" class="feature-scene">
      <div id="mapCap" class="abs cap">다녀온 곳은<br><span class="hl">지도로</span></div>
      <div id="mapPhone" class="abs phone"><div class="notch"></div><div class="screen"><div class="dots"></div>
        <div class="page-heading">서울, 느긋한 하루</div>
        <div class="map-paper">
          <svg viewBox="0 0 286 344" aria-label="직접 그린 지도 꾸미기 예시">
            <rect width="286" height="344" fill="#f3eedf"/>
            <g fill="#e5ddc8"><rect x="15" y="20" width="65" height="52" rx="6"/><rect x="98" y="17" width="58" height="57" rx="8"/><rect x="176" y="17" width="85" height="56" rx="7"/><rect x="14" y="91" width="77" height="74" rx="5"/><rect x="113" y="91" width="60" height="43" rx="6"/><rect x="191" y="90" width="73" height="67" rx="7"/><rect x="22" y="242" width="64" height="65" rx="8"/><rect x="106" y="256" width="61" height="57" rx="6"/><rect x="190" y="248" width="76" height="64" rx="8"/></g>
            <g fill="none" stroke="#fffdf7" stroke-width="9"><path d="M0 81L286 81M89 0L99 167M174 0L184 164M0 237L286 243M95 238L95 344M178 244L178 344"/></g>
            <path d="M-20 180C55 140 110 235 164 198S250 178 310 206L310 244C244 216 219 224 171 233S54 180-20 220Z" fill="#a9d9e8"/>
            <path d="M67 165L60 224M220 190L209 243" stroke="#fffdf7" stroke-width="13"/>
            <path d="M63 165L56 223M216 190L205 243" stroke="#d2c9b4" stroke-width="2"/>
            <path d="M118 140Q165 126 173 161Q158 187 115 164Z" fill="#bed8ae"/>
            <g fill="#91b78d"><circle cx="125" cy="147" r="8"/><circle cx="143" cy="155" r="10"/><circle cx="159" cy="146" r="8"/></g>
          </svg>
          <div class="map-caption">그림 지도 예시</div>
          <div id="mapFlower" class="map-sticker" style="left:112px;top:111px">${icons.flower}</div>
          <div id="mapFlowerNote" class="map-note" style="left:153px;top:148px">산책 한 바퀴</div>
          <div id="mapCup" class="map-sticker" style="left:36px;top:35px">${icons.cup}</div>
          <div id="mapCupNote" class="map-note" style="left:15px;top:101px">쉬어 가기</div>
          <div id="mapLetter" class="map-sticker" style="left:182px;top:244px">${icons.letter}</div>
        </div>
        <div id="mapFoot" class="map-memory">좋았던 곳에<br>내 마음 하나씩</div><div id="mapTap" class="scene-tap"></div>
      </div></div>
    </section>`);
  const dayDecorations = [[9,'letter','편지 쓴 날'],[16,'flower','꽃 한 송이'],[23,'cup','잠깐 쉬기']];
  for(const [day,icon,label] of dayDecorations) document.getElementById(`day-${day}`).insertAdjacentHTML('beforeend',`<div id="calSticker${day}" class="day-sticker">${icons[icon]}</div><div id="calMemo${day}" class="day-memo">${label}</div>`);

  const clamp=(n)=>Math.max(0,Math.min(1,n));
  const progress=(t,a,b)=>clamp((t-a)/(b-a));
  const out=(p)=>1-(1-p)**3;
  const pop=(p)=>1+2.70158*(p-1)**3+1.70158*(p-1)**2;
  function drop(id,t,at,rotation=0) {
    const p=progress(t,at,at+.45),el=document.getElementById(id);
    el.style.opacity=p>0?'1':'0';
    el.style.transform=`translateY(${-50*(1-out(p))}px) rotate(${rotation-14*(1-p)}deg) scale(${p>0?pop(p):.001})`;
  }
  function scene(name,t,start,end) {
    const active=t>=start&&t<end,p=progress(t,start,start+.35),q=progress(t,end-.3,end);
    document.getElementById(name+'Scene').style.opacity=active?'1':'0';
    const phone=document.getElementById(name+'Phone'),cap=document.getElementById(name+'Cap');
    phone.style.opacity=String(active?p*(1-q):0);
    phone.style.transform=`translateY(${(1-out(p))*120}px)`;
    cap.style.opacity=String(active?p*(1-q):0);
    cap.style.transform=`translateY(${(1-out(p))*30}px)`;
  }
  function ripple(id,t,at,x,y) {
    const p=progress(t,at,at+.35),el=document.getElementById(id);
    el.style.left=x+'px';el.style.top=y+'px';
    el.style.opacity=t>=at&&t<at+.35?String(1-p):'0';
    el.style.transform=`scale(${.6+p})`;
  }
  const timeline=[
    {start:0,end:2.4,key:'intro',label:'내 마음대로 꾸미고 공유하기'},
    {start:2.4,end:6,key:'arrange',label:'사진·스티커·글을 손으로 툭툭'},
    {start:6,end:11,key:'stamp',label:'사진을 우표로 오려 붙이고'},
    {start:11,end:17,key:'calendar',label:'달력에 하루하루 붙이고'},
    {start:17,end:23,key:'map',label:'다녀온 곳은 지도로'},
    {start:23,end:26.3,key:'share',label:'내 주소로 바로 공유'},
    {start:26.3,end:30,key:'cta',label:'지금 꾸며 보기'}
  ];
  window.AD={duration:30,fps:30,width:1080,height:1920,timeline,boardTimes:[1.6,5.1,8.9,15.9,21.9,25.5,29.2],sourceKind:{stamp:'reused-real-ui',calendar:'html-motion',map:'original-schematic'}};
  window.render=async function(t) {
    if(!Number.isFinite(t)||t<0||t>30) throw Error('t must be in [0,30]');
    const added=t>=11&&t<23;
    const baseTime=t<11?t:t<23?0:t<26.3?11+(t-23)*2.3/3.3:Math.min(14.999,13.3+(t-26.3)*1.7/3.7);
    await window.baseRender(baseTime);
    document.getElementById('baseStage').style.opacity=added?'0':'1';
    scene('calendar',t,11,17);scene('map',t,17,23);
    for(const [i,[day]] of dayDecorations.entries()) {
      const at=11.8+i*1.25;
      drop('calSticker'+day,t,at,[-7,6,-5][i]);drop('calMemo'+day,t,at+.35,[-3,2,-2][i]);
    }
    drop('calendarFoot',t,15.4,-3);
    const calAt=t<13.05?11.8:t<14.3?13.05:14.3;
    const calDay=calAt===11.8?9:calAt===13.05?16:23;
    const index=calDay+3;
    ripple('calendarTap',t,calAt,18+(index%7+.5)*273/7,201+Math.floor(index/7)*342/5+25);
    drop('mapCup',t,17.9,-8);drop('mapCupNote',t,18.35,-3);
    drop('mapFlower',t,19.2,7);drop('mapFlowerNote',t,19.65,3);
    drop('mapLetter',t,20.5,-6);drop('mapFoot',t,21.1,-3);
    const mapAt=t<19.2?17.9:t<20.5?19.2:20.5;
    ripple('mapTap',t,mapAt,...(mapAt===17.9?[77,171]:mapAt===19.2?[153,246]:[223,379]));
  };
  window.ready=false;
  (async()=>{
    await window.initBase();
    const text=stage.textContent+timeline.map(x=>x.label).join('');
    await Promise.all([
      document.fonts.load('400 48px "Kkume Black Han Sans"',text),
      document.fonts.load('700 26px "Kkume Gaegu"',text),
      document.fonts.load('400 12px "Kkume Gaegu"',text),
      ...Array.from(document.images).filter(img=>img.getAttribute('src')).map(img=>img.decode())
    ]);
    await document.fonts.ready;
    await window.render(0);
    window.ready=true;
  })().catch(error=>{window.initError=String(error);console.error(error);});
})();
