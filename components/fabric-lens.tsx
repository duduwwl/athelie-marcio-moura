'use client';
import type {ReactNode} from 'react';
import {motion,useReducedMotion} from 'motion/react';

/** Subtle photo interaction that does not depend on a WebGL canvas. */
export function FabricLens({children}:{children:ReactNode}){
  const reduced=useReducedMotion();
  return <motion.div className="fabric-lens" data-component="motion-photo" whileHover={reduced?undefined:{scale:1.012}} transition={{duration:.35,ease:[.2,.65,.3,1]}}>{children}</motion.div>;
}
