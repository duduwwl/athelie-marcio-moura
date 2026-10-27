'use client';
import {useCallback,useEffect,useLayoutEffect,useRef,useState,type CSSProperties,type KeyboardEvent as ReactKeyboardEvent,type PointerEvent as ReactPointerEvent} from 'react';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import {motion,useReducedMotion} from 'motion/react';
import {TextEffect} from './core/text-effect';
import {dressMessage,whatsapp,type Dress} from '../lib/catalog';
import './dress-rack.css';

/*
 * Arara interativa: os vestidos ficam pendurados lado a lado em um trilho cromado.
 * Ao passar o mouse (ou tocar), o vestido escolhido sobe e os vizinhos abrem espaço;
 * o movimento do cursor e da rolagem faz as peças balançarem no cabide como em uma arara real.
 * A física roda em requestAnimationFrame e escreve transformações direto no DOM (sem re-render por quadro).
 */

const BASE=(import.meta as unknown as {env?:{BASE_URL?:string}}).env?.BASE_URL||'/';
const src=(path:string)=>BASE+path.replace(/^\//,'');
/** Recortes normalizados (gancho centralizado no topo, altura 900px). */
const CUTOUT_WIDTH:Record<string,number>={'capa-esmeralda':432,drape:330,fucsia:606,marinho:318,oliva:528,'sereia-esmeralda':350,'serenity-capa':498,'serenity-georgette':552,'terracota-jabos':444,terracota:442,zibeline:612};
function cutout(d:Dress){const m=d.rackImage?.match(/\/images\/cabideiro-(.+)\.webp$/);if(m&&CUTOUT_WIDTH[m[1]])return {path:'/images/arara-'+m[1]+'.webp',ratio:CUTOUT_WIDTH[m[1]]/900};return {path:d.rackImage||d.images[0],ratio:.62};}
const SWATCH:Record<string,string>={'Terracota':'#a95f47','Verde esmeralda':'#155c47','Azul-marinho':'#27334a','Fúcsia':'#a52d70','Azul serenity':'#a5becf','Verde oliva':'#777d57'};
const MARQUEE=['NOVOS MODELOS NO ACERVO','AGENDE SUA PROVA NO ATELIÊ','LOCAÇÃO DE VESTIDOS DE FESTA','LAVRAS · MG'];

type Body={off:number;offV:number;ang:number;angV:number;lift:number;liftV:number};
type Geometry={rackW:number;itemH:number;slot:number;pad:number;rodY:number;scroll:boolean};

function measure(width:number,count:number):Geometry{
 const mobile=width<720;
 const itemH=mobile?Math.round(Math.min(360,Math.max(300,width*.86))):Math.round(Math.min(500,Math.max(330,width*.335)));
 const minSlot=mobile?Math.round(itemH*.29):0;
 const pad=mobile?Math.round(itemH*.3):Math.round(Math.max(itemH*.24,width*.075));
 const fitSlot=(width-pad*2)/count;
 const slot=Math.max(fitSlot,minSlot);
 const rackW=Math.round(slot*count+pad*2);
 return {rackW,itemH,slot,pad,rodY:mobile?34:44,scroll:rackW>width+1};
}

export function DressRack({dresses,phone}:{dresses:Dress[];phone:string}){
 const rack=dresses.filter(d=>d.published&&(d.rackImage||d.images.length)).slice(0,11);
 const n=rack.length;
 const reduced=!!useReducedMotion();
 const [selected,setSelected]=useState(0);
 const [hovered,setHovered]=useState<number|null>(null);
 const [geo,setGeo]=useState<Geometry>(()=>measure(1200,Math.max(n,1)));
 const scrollerRef=useRef<HTMLDivElement>(null);
 const itemRefs=useRef<(HTMLDivElement|null)[]>([]);
 const captionRef=useRef<HTMLDivElement>(null);
 const bodies=useRef<Body[]>([]);
 const raf=useRef(0);const last=useRef(0);
 const state=useRef({hovered:null as number|null,selected:0,touch:false,geo,reduced});
 const pointer=useRef<{x:number;y:number;t:number}|null>(null);
 const lastScroll=useRef<{x:number;t:number}|null>(null);

 if(bodies.current.length!==n)bodies.current=Array.from({length:n},()=>({off:0,offV:0,ang:0,angV:0,lift:0,liftV:0}));
 state.current.geo=geo;state.current.reduced=reduced;state.current.selected=selected;state.current.hovered=hovered;

 const restX=(i:number,g=state.current.geo)=>g.pad+g.slot*(i+.5);

 const targets=useCallback(()=>{
  const {hovered:h,selected:s,touch,geo:g}=state.current;
  const focus=h??s;const strength=h!=null||touch?1:.55;
  const push=Math.min(g.slot*.95,g.itemH*.3)*strength;
  return bodies.current.map((_,i)=>{const d=i-focus;const off=d===0?0:Math.sign(d)*push*Math.exp(-(Math.abs(d)-1)*.62);const lift=i===focus?(h!=null||touch?-12:-6):0;return {off,lift};});
 },[]);

 const paint=useCallback(()=>{
  const g=state.current.geo;
  bodies.current.forEach((b,i)=>{const el=itemRefs.current[i];if(el)el.style.transform=`translate3d(${(restX(i)+b.off).toFixed(2)}px,${b.lift.toFixed(2)}px,0) rotate(${b.ang.toFixed(3)}deg)`;});
  const cap=captionRef.current;const focus=state.current.hovered??state.current.selected;const b=bodies.current[focus];
  if(cap&&b)cap.style.transform=`translate3d(${(restX(focus)+b.off).toFixed(1)}px,0,0) translateX(-50%)`;
  void g;
 },[]);

 const step=useCallback((now:number)=>{
  const dt=Math.min(.034,Math.max(.001,(now-(last.current||now))/1000||.016));last.current=now;
  const t=targets();let moving=false;const instant=state.current.reduced;
  bodies.current.forEach((b,i)=>{
   const tg=t[i];
   if(instant){b.off=tg.off;b.lift=tg.lift;b.ang=0;b.offV=b.liftV=b.angV=0;return;}
   const prevV=b.offV;
   b.offV+=((tg.off-b.off)*190-b.offV*24)*dt;b.off+=b.offV*dt;
   b.liftV+=((tg.lift-b.lift)*220-b.liftV*26)*dt;b.lift+=b.liftV*dt;
   const acc=(b.offV-prevV)/dt; // inércia: o trilho anda, a barra do vestido fica para trás
   b.angV+=(-b.ang*58-b.angV*3.1+acc*.0016)*dt;b.ang+=b.angV*dt;
   if(b.ang>11){b.ang=11;b.angV*=-.4}else if(b.ang<-11){b.ang=-11;b.angV*=-.4}
   if(Math.abs(tg.off-b.off)>.15||Math.abs(b.offV)>.6||Math.abs(tg.lift-b.lift)>.15||Math.abs(b.ang)>.03||Math.abs(b.angV)>.12)moving=true;
  });
  paint();
  if(moving)raf.current=requestAnimationFrame(step);else{raf.current=0;last.current=0;}
 },[paint,targets]);

 const wake=useCallback(()=>{if(!raf.current){last.current=0;raf.current=requestAnimationFrame(step);}},[step]);

 useEffect(()=>()=>{cancelAnimationFrame(raf.current);raf.current=0;last.current=0;},[]);
 useEffect(()=>{wake();},[hovered,selected,geo,wake]);

 useLayoutEffect(()=>{
  const el=scrollerRef.current;if(!el)return;
  const update=()=>{const next=measure(el.clientWidth,Math.max(n,1));setGeo(g=>g.rackW===next.rackW&&g.itemH===next.itemH&&g.slot===next.slot?g:next);};
  update();const ro=new ResizeObserver(update);ro.observe(el);return()=>ro.disconnect();
 },[n]);
 useLayoutEffect(()=>{paint();},[geo,paint]);

 /* Balanço provocado pelo cursor: quem estiver sob o mouse recebe o impulso do movimento horizontal. */
 const onPointerMove=(e:ReactPointerEvent<HTMLDivElement>)=>{
  if(e.pointerType!=='mouse'||state.current.reduced)return;
  const box=e.currentTarget.getBoundingClientRect();const x=e.clientX-box.left,y=e.clientY-box.top,t=performance.now();
  const p=pointer.current;pointer.current={x,y,t};if(!p)return;
  const dt=Math.max(8,t-p.t);const vx=(x-p.x)/dt;const g=state.current.geo;
  if(y<g.rodY||y>g.rodY+g.itemH)return;
  const reach=g.slot*.75;let hit=false;
  bodies.current.forEach((b,i)=>{const dist=Math.abs(restX(i)+b.off-x);if(dist<reach){const lever=(y-g.rodY)/g.itemH;b.angV+=-vx*42*(1-dist/reach)*(.35+lever);hit=true;}});
  if(hit)wake();
 };
 const onPointerLeave=()=>{pointer.current=null;};

 /* No celular, arrastar a arara faz todas as peças balançarem levemente. */
 const onScroll=()=>{
  const el=scrollerRef.current;if(!el||state.current.reduced)return;const t=performance.now();const p=lastScroll.current;lastScroll.current={x:el.scrollLeft,t};
  if(!p||t-p.t>120)return;const v=(el.scrollLeft-p.x)/Math.max(8,t-p.t);
  bodies.current.forEach(b=>{b.angV+=v*9;});wake();
 };

 const choose=(index:number,scroll=true)=>{
  const next=Math.max(0,Math.min(n-1,index));setSelected(next);
  const el=scrollerRef.current;const g=state.current.geo;
  if(scroll&&el&&g.scroll){el.scrollTo({left:Math.max(0,restX(next)-el.clientWidth/2),behavior:state.current.reduced?'auto':'smooth'});}
 };
 const onKeyDown=(e:ReactKeyboardEvent<HTMLDivElement>)=>{
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=Math.max(0,Math.min(n-1,(hovered??selected)+(e.key==='ArrowLeft'?-1:1)));choose(next);setHovered(null);const btn=e.currentTarget.querySelectorAll<HTMLButtonElement>('.arara-slot')[next];btn?.focus({preventScroll:true});}
  else if(e.key==='Home'||e.key==='End'){e.preventDefault();const next=e.key==='Home'?0:n-1;choose(next);e.currentTarget.querySelectorAll<HTMLButtonElement>('.arara-slot')[next]?.focus({preventScroll:true});}
 };

 const current=rack[selected]||rack[0];
 const focusIndex=hovered??selected;const focusDress=rack[focusIndex];
 const contact=current?whatsapp(phone,dressMessage(current)):'';
 if(!n)return null;
 const stageH=geo.rodY+geo.itemH+46;
 const rodInset=Math.round(geo.pad*.42);

 return <div className="campaign-rack-wrap arara" style={{'--arara-item-h':geo.itemH+'px','--arara-rod-y':geo.rodY+'px'} as CSSProperties}>
  <div className="atelier-rack-head"><span>ACERVO DO ATELIÊ</span><span>{geo.scroll?'ARRASTE A ARARA PARA O LADO':'PASSE O MOUSE PELOS CABIDES'}</span></div>
  <div className="arara-board">
   <div className="arara-scroller" ref={scrollerRef} onScroll={onScroll}>
    <div className="arara-rack" role="group" aria-label="Arara de vestidos. Use as setas do teclado para escolher um modelo." style={{width:geo.rackW,height:stageH}} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown}>
     <div className="arara-rod" style={{left:rodInset,right:rodInset,top:geo.rodY}} aria-hidden="true"><i className="arara-flange arara-flange-l"/><i className="arara-cap arara-cap-l"/><span className="arara-tube"/><i className="arara-cap arara-cap-r"/><i className="arara-flange arara-flange-r"/></div>
     {rack.map((dress,i)=>{const c=cutout(dress);const w=Math.round(geo.itemH*c.ratio);const active=i===focusIndex;
      return <div key={dress.id} className={'arara-item'+(active?' is-active':'')+(i===selected?' is-selected':'')} ref={el=>{itemRefs.current[i]=el;}} style={{top:geo.rodY-7,zIndex:active?40:i===selected?30:10+(i%2?1:0)}} aria-hidden="true">
       <span className="arara-drop" style={{animationDelay:reduced?'0s':Math.min(i*.06,.6)+'s'}}><img src={src(c.path)} alt="" width={w} height={geo.itemH} style={{width:w,height:geo.itemH}} loading={i<6?'eager':'lazy'} decoding="async" draggable={false}/></span>
      </div>;})}
     {rack.map((dress,i)=><button key={dress.id} id={'arara-'+dress.id} type="button" aria-pressed={i===selected} className="arara-slot" style={{left:restX(i)-geo.slot/2,width:geo.slot,top:geo.rodY-10,height:geo.itemH+10}}
       aria-label={`${dress.name} — ${dress.color}, ${dress.style}`}
       onPointerEnter={e=>{if(e.pointerType==='mouse'){state.current.touch=false;setHovered(i);}}}
       onPointerLeave={e=>{if(e.pointerType==='mouse')setHovered(h=>h===i?null:h);}}
       onPointerDown={e=>{if(e.pointerType!=='mouse')state.current.touch=true;}}
       onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))setHovered(i);}} onBlur={()=>setHovered(h=>h===i?null:h)}
       onClick={()=>choose(i,state.current.touch)}/>)}
     <div className="arara-caption" ref={captionRef} style={{top:geo.rodY+geo.itemH+8}} aria-hidden="true"><span>{focusDress?.name}</span></div>
    </div>
   </div>
   <div className="arara-actions">
    <a className="arara-pill" href={contact} target="_blank" rel="noopener noreferrer">CONSULTAR DISPONIBILIDADE</a>
    <span className="arara-count" aria-live="polite">{String(selected+1).padStart(2,'0')} / {String(n).padStart(2,'0')}</span>
   </div>
   <div className="arara-marquee" aria-hidden="true"><div className="arara-marquee-track">{[0,1].map(k=><span key={k}>{[...MARQUEE,...MARQUEE].map((t,j)=><em key={j}>{t}<b>•</b></em>)}</span>)}</div></div>
  </div>
  {current?<motion.aside key={current.id} className="rack-detail" initial={reduced?false:{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:reduced?0:.3}} aria-live="polite"><div><p className="eyebrow">MODELO EM DESTAQUE</p><h2><TextEffect key={current.id}>{current.name}</TextEffect></h2><div className="rack-detail-color"><i style={{background:SWATCH[current.color]||'#887766'}}/><span>{current.color} · {current.style}</span></div><p className="rack-detail-copy">{current.description}</p><div className="rack-detail-meta"><span>Tecido<strong>{current.fabric||'Consulte a equipe'}</strong></span><span>Disponibilidade<strong>Consulte para sua data</strong></span></div><small className="demo-note">Preço fictício para demonstração</small></div><div className="rack-detail-actions"><p>Locação · valor demonstrativo <strong>{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(current.rentalPrice)}</strong></p><p>Tamanhos <strong>{current.sizes.length?current.sizes.join(', '):'consulte a equipe'}</strong></p><Link className="rack-detail-link" href={'/vestido/'+current.id}>VER DETALHES <ArrowRight size={17}/></Link><a className="rack-detail-whatsapp" href={contact} target="_blank" rel="noopener noreferrer">CONSULTAR NO WHATSAPP <ArrowUpRight size={15}/></a></div></motion.aside>:null}
 </div>;
}
