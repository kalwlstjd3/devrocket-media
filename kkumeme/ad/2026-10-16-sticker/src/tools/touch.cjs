exports.touchDriver=async function(page,context,root,folder){
  const fs=require('node:fs'),path=require('node:path');fs.mkdirSync(path.join(root,'recordings',folder),{recursive:true});
  const cdp=await context.newCDPSession(page),trace=[];let n=0,recording=true;
  async function point(x,y,show=true){
    if(x<18||x>372||y<18||y>808)throw Error(`Finger would leave viewport: ${x},${y}`);
    trace.push({frame:n,x,y,show});
    await page.evaluate(([x,y,s])=>{const f=document.getElementById('finger');f.style.display=s?'block':'none';f.style.left=x+'px';f.style.top=y+'px';},[x,y,show]);
  }
  async function tick(k=1){for(let i=0;i<k;i++){
    await page.clock.runFor(1000/30);await page.waitForTimeout(5);
    if(recording)await page.screenshot({path:path.join(root,'recordings',folder,`f${String(n++).padStart(4,'0')}.png`)});
  }}
  async function touch(type,x,y){await point(x,y,type!=='touchEnd');await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y,id:1,radiusX:9,radiusY:9,force:1}]});}
  async function tap(locator){const b=await locator.boundingBox();if(!b)throw Error('Tap target not visible');const x=b.x+b.width/2,y=b.y+b.height/2;await touch('touchStart',x,y);await tick(4);await touch('touchEnd',x,y);await tick(3);}
  async function drag(from,to,frames=18){await touch('touchStart',from.x,from.y);await tick(4);for(let i=1;i<=frames;i++){const p=i/frames,e=p*p*(3-2*p);await touch('touchMove',from.x+(to.x-from.x)*e,from.y+(to.y-from.y)*e);await tick();}await touch('touchEnd',to.x,to.y);await tick(5);}
  function finish(){fs.writeFileSync(path.join(root,'recordings',folder,'capture.json'),JSON.stringify({frames:n,fps:30,pointerType:'touch',trace},null,2));return n;}
  return{tick,touch,tap,drag,point,finish,get frames(){return n;},pause(){recording=false;},resume(){recording=true;}};
};
