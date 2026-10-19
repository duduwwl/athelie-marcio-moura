'use client';
// Adapted from Watermelon UI Continuous Tabs (MIT).
// Original: https://registry.watermelon.sh/r/continuous-tabs.json
// The animated active element retains its active-selection role; decorative demo styling removed.
import {LayoutGroup,motion,useReducedMotion} from 'motion/react';
import {useId} from 'react';
export function ContinuousTabs({tabs,activeId,onChange}:{tabs:{id:string;label:string}[];activeId:string;onChange:(id:string)=>void}){
const id=useId(),reduced=useReducedMotion();
return <LayoutGroup id={id}><nav className="wm-continuous-tabs" aria-label="Categorias de vestidos" data-component="watermelon-continuous-tabs">{tabs.map(tab=><button key={tab.id} type="button" aria-pressed={activeId===tab.id} onClick={()=>onChange(tab.id)} className={activeId===tab.id?'active':''}>{activeId===tab.id?<motion.span className="wm-active-selection" layoutId="active-pill" transition={reduced?{duration:0}:{type:'spring',stiffness:380,damping:30,mass:.9}}/>:null}<motion.span layout={reduced?false:'position'} className="wm-tab-label">{tab.label}</motion.span></button>)}</nav></LayoutGroup>;
}
