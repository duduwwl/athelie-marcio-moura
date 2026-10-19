import {useEffect,useState,type ComponentType} from 'react';
export default function dynamic<T extends ComponentType<any>>(loader:()=>Promise<unknown>){
  return function LazyComponent(props:Record<string,unknown>){
    const [Component,setComponent]=useState<T|null>(null);
    useEffect(()=>{let active=true;loader().then(mod=>{const value=typeof mod==='function'?mod:(mod&&typeof mod==='object'?('default'in mod?mod.default:Object.values(mod).find(item=>typeof item==='function')):null);if(active&&typeof value==='function')setComponent(value as T);});return()=>{active=false;};},[]);
    const Loaded=Component as ComponentType<any>|null;
    return Loaded?<Loaded {...props}/>:null;
  };
}
