const fs=require('node:fs'),path=require('node:path');
const IDS={cat:'11111111-1111-4111-8111-111111111111',heart:'22222222-2222-4222-8222-222222222222',flower:'33333333-3333-4333-8333-333333333333'};
const record=(id,name)=>({id,assetId:id,src:'/api/assets/'+id,name,category:null,favorite:false,takenOn:null,dateSource:'upload',createdAt:'2026-10-16T03:00:00.000Z'});
exports.IDS=IDS;
exports.installMock=async function(context,origin,root){
  const state={created:false,document:null,revision:1,calls:[]};
  await context.route('**/*',async route=>{
    const req=route.request(),url=new URL(req.url());
    if(url.origin!==origin){await route.abort();throw Error('External request blocked: '+url.origin);}
    if(!url.pathname.startsWith('/api/'))return route.continue();
    state.calls.push({method:req.method(),path:url.pathname});
    const json=body=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
    if(url.pathname.startsWith('/api/assets/')&&req.method()==='GET'){
      const id=url.pathname.split('/')[3],file=id===IDS.cat?'result':id===IDS.heart?'heart':id===IDS.flower?'flower':null;
      if(!file)throw Error('Unknown asset '+id);
      return route.fulfill({status:200,contentType:'image/png',body:fs.readFileSync(path.join(root,'work',file+'.png'))});
    }
    if(url.pathname==='/api/assets/custom-sticker'&&req.method()==='POST'){
      state.created=true;
      return json({src:'/api/assets/'+IDS.cat,userStickerId:IDS.cat,name:'고양이',createdAt:'2026-10-16T03:00:00.000Z',dateSource:'upload'});
    }
    if(url.pathname==='/api/user-stickers'&&req.method()==='GET'){
      const all=[...(state.created?[record(IDS.cat,'고양이')]:[]),record(IDS.heart,'하트'),record(IDS.flower,'꽃')];
      return json({stickers:all.slice(0,Number(url.searchParams.get('limit')||50)),total:all.length,nextCursor:null,categories:[]});
    }
    if(url.pathname==='/api/workspace'){
      if(req.method()==='PUT'){const body=req.postDataJSON();state.document=body.document;state.revision++;return json({revision:state.revision});}
      if(!state.document)state.document=await req.frame().evaluate(()=>window.AD_FIXTURE);
      return json({user:{userId:'ad-local',username:'myspace',plan:'internal'},document:state.document,revision:state.revision,slug:null,publishedAt:null});
    }
    if(url.pathname==='/api/stickers')return json({stickers:[]});
    // Publishing, Cloudflare Images and every unplanned endpoint are blocked.
    await route.abort();throw Error('Unmocked API: '+req.method()+' '+url.pathname);
  });
  return state;
};
