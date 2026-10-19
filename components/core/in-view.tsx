'use client';
import {useRef,type ReactNode} from 'react';
import {motion,useInView,useReducedMotion,type Transition,type Variants} from 'motion/react';

type InViewProps={children:ReactNode;className?:string;delay?:number;viewOptions?:{margin?:string;amount?:number;once?:boolean};variants?:Variants;transition?:Transition};

/** Scroll entrance that starts visible until IntersectionObserver reports its first measurement. */
export function InView({children,className,delay=0,viewOptions,variants,transition}:InViewProps){
 const ref=useRef<HTMLDivElement>(null);const reduced=useReducedMotion();const inView=useInView(ref,{once:viewOptions?.once??true,amount:viewOptions?.amount??.08,margin:viewOptions?.margin as `${number}px`|`${number}%`|undefined,initial:true});
 const states=variants||{hidden:{opacity:0,y:24,scale:.985,filter:'blur(4px)'},visible:{opacity:1,y:0,scale:1,filter:'blur(0px)'}};
 return <motion.div ref={ref} className={className} initial={false} animate={reduced||inView?'visible':'hidden'} variants={states} transition={reduced?{duration:0}:transition||{duration:.65,delay,ease:[.2,.65,.3,1]}}>{children}</motion.div>;
}
