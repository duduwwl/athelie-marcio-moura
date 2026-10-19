import {env} from 'cloudflare:workers';
import {defaults,instagramSelection,type Dress,type SiteSettings} from './catalog';
export type PublicCatalog={dresses:Dress[];settings:SiteSettings};
export async function loadCatalog():Promise<PublicCatalog|null>{try{const db=(env as unknown as {DB:D1Database}).DB;
// One-time application data initialization, outside schema migrations. No visitor input.
// A single atomic batch and a marker prevent later restores of archived/removed entries.
const marker=await db.prepare('SELECT id FROM settings WHERE id=?').bind('instagram-import-v1').first();
if(!marker)await db.batch([...instagramSelection.map(d=>db.prepare('INSERT OR IGNORE INTO dresses (id,data,published,created) SELECT ?,?,?,? WHERE NOT EXISTS (SELECT id FROM settings WHERE id=?)').bind(d.id,JSON.stringify(d),1,d.created,'instagram-import-v1')),db.prepare('INSERT OR IGNORE INTO settings (id,data) VALUES (?,?)').bind('instagram-import-v1','{}')]);
const [rows,s]=await Promise.all([db.prepare('SELECT data FROM dresses WHERE published=1 ORDER BY created DESC,id').all<{data:string}>(),db.prepare('SELECT data FROM settings WHERE id=?').bind('site').first<{data:string}>()]);return {dresses:rows.results.map(r=>JSON.parse(r.data)),settings:s?{...defaults,...JSON.parse(s.data)}:defaults};}catch{return null;}}
