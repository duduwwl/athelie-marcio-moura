'use client';

import {motion,useReducedMotion} from 'motion/react';

type Props={children:string;className?:string;delay?:number};

export function TextEffect({children,className,delay=0}:Props){
 const reduced=useReducedMotion();
 return <motion.span className={className} aria-label={children} initial={reduced?'visible':'hidden'} whileInView="visible" viewport={{once:true,amount:.65}} variants={{hidden:{},visible:{transition:{staggerChildren:.008,delayChildren:delay}}}}>
  {Array.from(children).map((character,index)=><motion.span key={index} aria-hidden="true" variants={{hidden:{opacity:0,y:7,filter:'blur(2px)'},visi