import Atelier from '../components/atelier';
import {loadCatalog} from '../lib/server-catalog';
export const dynamic='force-dynamic';
export default async function Page(){return <Atelier path="/" initialData={await loadCatalog()}/>;}

