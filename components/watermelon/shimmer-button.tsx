'use client';
// Adapted from Watermelon UI Shimmer Button (MIT).
// Original: https://registry.watermelon.sh/r/shimmer-button.json
import Link from 'next/link';
import type {ButtonHTMLAttributes,ReactNode} from 'react';
export function ShimmerButton({children,className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>){return <button className={'wm-shimmer '+className} data-component="watermelon-shimmer-button" {...props}><span>{children}</span><i aria-hidden="true"/></button>;}
export function ShimmerLink({children,className='',href}:{children:ReactNode;className?:string;href:string}){return <Link href={href} className={'wm-shimmer '+className} data-component="watermelon-shimmer-link"><span>{children}</span><i aria-hidden="true"/></Link>;}
