import sharp from 'sharp';
import {readdir,stat} from 'node:fs/promises';
let before=0,after=0;
for(const name of (await readdir('public/images')).filter(f=>f.endsWith('.jpg'))){
 const path='public/images/'+name;const src=sharp(path);const {data,info}=await src.clone().removeAlpha().raw().toBuffer({resolveWithObject:true});
 const blackRow=y=>{let sum=0;for(let x=0;x<info.width;x++)for(let c=0;c<info.channels;c++)sum+=data[(y*info.width+x)*info.channels+c];return sum/(info.width*info.channels)<12;};
 let top=0,bottom=info.height-1;while(top<info.height/4&&blackRow(top))top++;while(bottom>info.height*3/4&&blackRow(bottom))bottom--;
 const out=path.replace('.jpg','.webp');await src.extract({left:0,top,width:info.width,height:bottom-top+1}).webp({quality:88,effort:5}).toFile(out);
 before+=(await stat(path)).size;after+=(await stat(out)).size;
}
console.log(JSON.stringify({before,after,saved:Math.round((1-after/before)*100)+'%'}));

