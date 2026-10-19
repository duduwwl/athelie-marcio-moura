import {createElement,type AnchorHTMLAttributes,type ReactNode} from 'react';

type Props=AnchorHTMLAttributes<HTMLAnchorElement>&{href:string;children?:ReactNode};
function route(href:string){
  if(href==='/')return '#inicio';
  if(href==='/colecao')return '#acervo';
  if(href.startsWith('/colecao?'))return '#acervo';
  if(href==='/favoritos')return '#salvos';
  if(href==='/sobre'||href==='/agendamento'||href==='/contato'||href==='/solicitar')return '#atendimento';
  if(href==='/privacidade')return '#privacidade';
  if(href.startsWith('/vestido/'))return '#vestido-'+href.split('/')[2];
  return href;
}
export default function Link({href,children,onClick,...props}:Props){
  return createElement('a',{...props,href:route(href),onClick:(event:React.MouseEvent<HTMLAnchorElement>)=>{
    onClick?.(event);if(event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    if(href==='/colecao'||href.startsWith('/colecao?')){event.preventDefault();window.dispatchEvent(new CustomEvent('atelier:navigate',{detail:{view:'catalog',category:new URLSearchParams(href.split('?')[1]||'').get('categoria')}}));}
    else if(href==='/favoritos'){event.preventDefault();window.dispatchEvent(new CustomEvent('atelier:navigate',{detail:{view:'favorites'}}));}
    else if(href==='/privacidade'){event.preventDefault();window.dispatchEvent(new CustomEvent('atelier:navigate',{detail:{view:'privacy'}}));}
    else if(href.startsWith('/vestido/')){event.preventDefault();window.dispatchEvent(new CustomEvent('atelier:navigate',{detail:{view:'product',id:href.split('/')[2]}}));}
  }},children);
}
