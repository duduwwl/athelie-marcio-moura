import Atelier from '../../components/atelier';
import type {Metadata} from 'next';
import {env} from 'cloudflare:workers';
import {loadCatalog} from '../../lib/server-catalog';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata>{
 const {slug}=await params;const names:Record<string,string>={colecao:'Coleção de vestidos para alugar em Lavras',sobre:'Sobre o ateliê',contato:'Contato e localização em Lavras',agendamento:'Agendar atendimento',favoritos:'Meus favoritos',solicitar:'Solicitar locação',privacidade:'Política de privacidade',admin:'Administração'};
 if(slug[0]==='vestido'&&slug[1]){const db=(env as unknown as {DB:D1Database}).DB;const row=await db.prepare('SELECT data FROM dresses WHERE id=? AND published=1').bind(slug[1]).first<{data:string}>();if(row){const d=JSON.parse(row.data);return {title:d.name,description:d.description,openGraph:{title:d.name,description:d.description}};}}
 return {title:names[slug[0]]||'Página não encontrada',robots:['admin','favoritos','solicitar','agendamento'].includes(slug[0])?{index:false,follow:false}:undefined};
}
export default async function Page({params}:{params:Promise<{slug:string[]}>}){const p=await params;return <Atelier path={'/'+p.slug.join('/')} initialData={await loadCatalog()}/>;}
