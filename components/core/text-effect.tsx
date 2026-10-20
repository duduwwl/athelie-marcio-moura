'use client';

import {motion,useReducedMotion} from 'motion/react';

type Props={children:string;className?:string;delay?:number};

export function TextEffect({children,className,delay=0}:Props){
 const reduced=useReducedMotion();
 return <motion.span className={className} aria-label={children} initial={reduced?'visible':'hidden'} whileInView="visible" viewport={{once:true,amount:.65}} variants={{hidden:{},visible:{transition:{staggerChildren:.008,delayChildren:delay}}}}>
  {children.split(/(\s+)/).map((part,partIndex)=>/^\s+$/.test(part)?<span key={partIndex} aria-hidden="true" style={{whiteSpace:'pre-wrap'}}>{part}</span>:<span key={partIndex} aria-hidden="true" style={{display:'inline-block',whiteSpace:'nowrap'}}>{Array.from(part).map((character,index)=><motion.span key={index} variants={{hidden:{opacity:0,y:7,filter:'blur(2px)'},visible:{opacity:1,y:0,filter:'blur(0px)',transition:{duration:.22,ease:'easeOut'}}}} style={{display:'inline-block'}}>{character}</motion.span>)}</span>)}
 </motion.span>;
}

