import type { Metadata } from 'next';
import './globals.css';
import './fashion.css';
export const metadata:Metadata={title:{default:'Atheliê Márcio Moura · Vestidos para celebrar',template:'%s · Atheliê Márcio Moura'},description:'Locação de vestidos para madrinhas, formandas, debutantes e festas em Lavras, MG. Explore a coleção e solicite seu atendimento.',icons:{icon:'/favicon.svg'},openGraph:{title:'Atheliê Márcio Moura',description:'O seu momento. O seu vestido.',locale:'pt_BR',type:'website'}};
export default function Layout({children}:{children:React.ReactNode}){const business={'@context':'https://schema.org','@type':'ClothingStore',name:'Atheliê Márcio Moura',description:'Locação de vestidos de festa, madrinhas, formandas e debutantes em Lavras, MG.',telephone:'+55 35 99142-7253',sameAs:['https://www.instagram.com/atheliermarciomoura/'],address:{'@type':'PostalAddress',streetAddress:'Rua Chagas Dória, 102, Loja 101',addressLocality:'Lavras',addressRegion:'MG',postalCode:'37200-042',addressCountry:'BR'}};return <html lang="pt-BR"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(business)}}/>{children}</body></html>;}

