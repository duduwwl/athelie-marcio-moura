import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const root=fileURLToPath(new URL('.',import.meta.url));
export default defineConfig({
  root:path.join(root,'static-app'),
  base:'/athelie-marcio-moura/',
  publicDir:path.join(root,'public'),
  plugins:[react()],
  resolve:{alias:[
    {find:/^next\/link$/,replacement:path.join(root,'static-app/Link.tsx')},
    {find:/^next\/dynamic$/,replacement:path.join(root,'static-app/dynamic.tsx')},
  ]},
  build:{outDir:path.join(root,'_site'),emptyOutDir:true},
});
