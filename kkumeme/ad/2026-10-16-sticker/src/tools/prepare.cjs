const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),app=path.resolve(process.argv[2]||'');
if(!process.argv[2])throw Error('Usage: node src/tools/prepare.cjs /path/to/kkumeme');
const sha=spawnSync('git',['rev-parse','HEAD'],{cwd:app,encoding:'utf8'});
if(sha.status!==0||!sha.stdout.trim().startsWith('4a1056f'))throw Error('Use an existing checkout/worktree at kkumeme 4a1056f. This script does not change its branch.');
const requireApp=createRequire(path.join(app,'package.json'));
let esbuild;try{esbuild=requireApp('esbuild');}catch{
  const pnpm=path.join(app,'node_modules/.pnpm'),versions=fs.readdirSync(pnpm).filter(x=>/^esbuild@/.test(x)).sort();
  if(!versions.length)throw Error('Existing esbuild not found; no package will be installed.');
  esbuild=require(path.join(pnpm,versions.at(-1),'node_modules/esbuild'));
}
const work=path.join(root,'work');fs.mkdirSync(work,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets.json')));
for(const [key,name]of [['catOriginal','original'],['catResult','result'],['heart','heart'],['flower','flower']]){
  const input=path.resolve(root,manifest[key]);if(!input.startsWith(root+path.sep))throw Error('Asset path must stay within src');
  const r=spawnSync('ffmpeg',['-y','-i',input,'-vf','scale=1024:1024:force_original_aspect_ratio=decrease','-frames:v','1','-map_metadata','-1','-pix_fmt','rgba',path.join(work,name+'.png')],{stdio:'inherit'});
  if(r.status!==0)throw Error('Could not prepare '+key);
}
fs.copyFileSync(path.join(app,'app/fonts.css'),path.join(root,'fonts.css'));
fs.cpSync(path.join(app,'public/fonts'),path.join(root,'fonts'),{recursive:true});
const cssRoot=path.join(app,'dist/client/_next/static/css');
const css=fs.readdirSync(cssRoot).filter(x=>x.endsWith('.css'));
if(!css.some(x=>/^index[.-]/.test(x)))throw Error('Existing pnpm build CSS required. Run build in the pinned worktree first.');
fs.writeFileSync(path.join(work,'app.css'),css.map(x=>fs.readFileSync(path.join(cssRoot,x),'utf8')).join('\n'));
const temp=fs.mkdtempSync(path.join(app,'.ad-sticker-'));
(async()=>{try{
  for(const file of ['fixture.ts','editor-entry.tsx','stamp-entry.tsx','public-entry.tsx'])fs.copyFileSync(path.join(__dirname,file),path.join(temp,file));
  for(const mode of ['editor','stamp','public']){
    await esbuild.build({absWorkingDir:app,entryPoints:[path.join(temp,mode+'-entry.tsx')],outfile:path.join(work,mode+'.js'),bundle:true,format:'esm',platform:'browser',jsx:'automatic',alias:{'@':app},loader:{'.css':'css','.woff2':'file'},external:['*?worker&url'],define:{'process.env.NODE_ENV':'"production"','process.env.NEXT_PUBLIC_BASE_DOMAIN':'"kkume.me"','process.env.NEXT_PUBLIC_HOME_ORIGIN':'"https://kkume.me"','process.env.NEXT_PUBLIC_HOST_PREFIX':'""','process.env.NEXT_PUBLIC_BUILD_SHA':JSON.stringify(sha.stdout.trim())},banner:{js:'var process={env:{}};'}});
    fs.writeFileSync(path.join(work,mode+'.html'),`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/fonts.css"><link rel="stylesheet" href="/work/app.css"><style>html,body{margin:0}#finger{position:fixed;display:none;pointer-events:none;width:30px;height:30px;margin:-15px 0 0 -15px;border:3px solid #49316599;background:#ffe48388;border-radius:50%;box-sizing:border-box;z-index:2147483647}</style><div id="root"></div><div id="finger"></div><script type="module" src="/work/${mode}.js"></script></html>`);
  }
  fs.writeFileSync(path.join(work,'build-info.json'),JSON.stringify({appSha:sha.stdout.trim(),placeholder:manifest.placeholder,cssFiles:css},null,2));
  console.log('Bundles prepared; no app files committed. Temporary entry folder removed in finally.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}})().catch(e=>{console.error(e);process.exitCode=1;});
