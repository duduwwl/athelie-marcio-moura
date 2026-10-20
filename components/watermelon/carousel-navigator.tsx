'use client';
// Adapted from Watermelon UI Carousel Navigator (MIT).
// Original: https://registry.watermelon.sh/r/carousel-navigator.json
// Adaptations: brand styling, real slide progress, labels, disabled controls, reduced motion.
import {motion,useReducedMotion} from 'motion/react';
import {ArrowLeft,ArrowRight} from 'lucide-react';
interface CarouselNavigatorProps{totalSlides:number;currentIndex:number;onIndexChange:(index:number)=>void;}
export function CarouselNavigator({totalSlides,currentIndex,onIndexChange}:CarouselNavigatorProps){
 const reduced=useReducedMotion();if(totalSlides<2)return null;
 return <motion.div className="wm-carousel-navigator" data-component="watermelon-carousel-navigator">
 <motion.button type="button" aria-label="Vestido anterior" disabled={currentIndex===0} onClick={()=>onIndexChange(currentIndex-1)} whileTap={reduced?undefined:{scale:.9}}>ANTERIOR</motion.button>
 <div className="wm-indicators">{Array.from({length:totalSlides}).map((_,i)=><motion.button key={i} type="button" layout={!reduced} onClick={()=>onIndexChange(i)} aria-label={'Ver vestido '+(i+1)} aria-current={i===currentIndex?'true':undefined} className={i===currentIndex?'active':''} transition={{type:'spring',stiffness:300,damping:30}}><span/>{i===currentIndex?<motion.i initial={reduced?false:{scaleX:0}} animate={{