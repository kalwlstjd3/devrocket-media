/* Existing kkume fonts only. Does not download or install packages. */
const fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const app=process.argv[2];
if(!app)throw Error('Usage: node src/tools/prepare.cjs /absolute/path/to/kkumeme');
const root=path.resolve(__dirname,'..');
for(const file of ['photo.jpg','stamp.png','icon.svg','logo.svg','rec-stamp-maker.mp4'])if(!fs.existsSync(path.join(root,file)))throw Error(`Missing committed asset: ${file}`);
fs.copyFileSync(path.join(app,'app/fonts.css'),path.join(root,'fonts.css'));
fs.cpSync(path.join(app,'public/fonts'),path.join(root,'fonts'),{recursive:true});
const frames=path.join(root,'rf5');fs.mkdirSync(frames,{recursive:true});
const result=spawnSync('ffmpeg',['-y','-i',path.join(root,'rec-stamp-maker.mp4'),'-vf','fps=30','-frames:v','150','-start_number','0',path.join(frames,'f%03d.png')],{stdio:'inherit'});
if(result.status!==0)throw Error('Could not extract original stamp footage');
for(let i=0;i<150;i++)if(!fs.existsSync(path.join(frames,`f${String(i).padStart(3,'0')}.png`)))throw Error(`Stamp frame ${i} is missing`);
console.log('Ready: existing same-origin fonts + rf5/f000.png…f149.png.');
