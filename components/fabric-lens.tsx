'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import dynamic from 'next/dynamic';
const Glass=dynamic(()=>import('./canvasui/Glass').then(m=>m.Glass));
export function FabricLens({children}:{children:ReactNode}){
const ref=useRef<HTMLDivElement>(null),[enabled,setEnabled]=useState(false);
useEffect(()=>{const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&fine.matches&&!reduced.matches){setEnabled(true);observer.disconnect();}},{rootMargin:'250px'});if(ref.current)observer.observe(ref.current);const update=()=>{if(reduced.matches||!fine.matches)setEnabled(false);else if(ref.current){const r=ref.current.getBoundingClientRect();if(r.top<innerHeight+250&&r.bottom> -250)setEnabled(true);}};reduced.addEventListener('change',update);fine.addEventListener('change',update);return()=>{observer.disconnect();reduced.removeEventListener('change',update);fine.removeEventListener('change',update);};},[]);
return <div ref={ref} className="fabric-lens" data-component="canvas-ui-glass">{enabled?<Glass className="glass-photo" size={85} ior={1.12} depth={10} aberration={0} blur={0} reflection={.3} shine={.35} zoom={1.1} follow={.16}>{children}</Glass>:children}</div>;
}
