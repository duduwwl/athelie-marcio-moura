# Atheliê Márcio Moura

Website de moda festa e locação de vestidos, com catálogo persistente, administração protegida e solicitações reais.

## O que está implementado

- Página editorial, catálogo com busca e filtros de categoria, cor, tamanho, modelo e recebimento de consultas; ordenação e carregamento progressivo.
- Páginas individuais com galeria, miniaturas, ampliação e navegação por toque quando houver mais de uma foto cadastrada.
- Favoritos no navegador, sem cadastro, e compartilhamento da seleção por WhatsApp.
- Solicitações de locação, contato e atendimento, com validação no cliente e servidor, consentimento, protocolo e status de espera.
- Administração: cadastro/edição/arquivamento/publicação de vestidos, múltiplas fotos, destaques, categorias, cores, tamanhos, conteúdo, galeria e contatos.
- Agenda com confirmação manual, cancelamento e bloqueio de horários. Dois atendimentos não podem ser confirmados no mesmo horário.
- WhatsApp com mensagens preenchidas, Instagram por curadoria manual, Google Maps, privacidade, metadados por página, sitemap, robots e dados estruturados locais.
- WebP, lazy loading, foco visível, menu modal acessível, redução de movimento e apresentação responsiva.

Não há cobrança automática, reserva instantânea, preços presumidos ou horários anunciados como disponíveis.

## Arquitetura

React 19 + TypeScript no padrão App Router, executado com Vinext no Cloudflare Workers pela hospedagem Sites. O starter preserva a integração de publicação Sites. CSS próprio; ícones Lucide usados em ações. Banco Cloudflare D1; imagens enviadas ao Cloudflare R2; validação Zod.

O catálogo é renderizado no servidor e sincronizado após alterações administrativas. Os favoritos usam localStorage versionado. Solicitações nunca são guardadas apenas no navegador.

Tabelas: dresses, inquiries, settings, blocks, slots e rate_limits. Categorias, cores, tamanhos, fotos e detalhes são campos estruturados dos vestidos/configurações. Não há cadastro de clientes.

## Iniciar localmente

Requisitos: Node 22.13+ e npm.

1. Execute `npm ci`.
2. Crie `.dev.vars` com `ADMIN_EMAILS=seedy@sites.test` apenas para a identidade fictícia local do starter.
3. Execute `npm run build`.
4. Aplique a migração local:

```powershell
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_yielding_night_nurse.sql
```

5. Execute `npm run dev`. O endereço padrão é http://127.0.0.1:5173.
6. Abra /admin e entre pela autenticação de testes local. A seleção verificada de 11 modelos é gravada automaticamente no primeiro carregamento, por uma rotina de inicialização idempotente fora das migrações. O botão de importação administrativa permite recuperar registros iniciais sem sobrescrever edições.

Se o atalho npm não existir no PATH, o dev e o build também podem ser executados diretamente com `node scripts/run-framework.mjs dev` e `node scripts/run-framework.mjs build`, após instalar as dependências.

## Banco, fotos e publicação

`.openai/hosting.json` mantém a identidade do Site e declara os bindings DB e BUCKET. Sites provisiona D1 e R2 e aplica as migrações durante a publicação. O banco local é separado do banco publicado.

Publique pelo fluxo Sites: compilar, verificar, sincronizar a fonte Git, empacotar o artefato compilado e publicar uma versão salva. A publicação inicial é privada, para revisão pelo proprietário. Não altere a audiência como parte de uma atualização de código.

Mudanças de schema devem gerar uma migração nova com `npm run db:generate`. Não reescreva uma migração já aplicada.

## Administração e segurança

- /admin usa o login ChatGPT fornecido por Sites.
- Configure ADMIN_USER_IDS com os identificadores estáveis de usuários desse Site, ou ADMIN_EMAILS com os emails exatos autorizados. Valores são configurados no servidor da hospedagem.
- O proprietário desta entrega foi autorizado pelo email da conta de Sites. Isso não concede permissão a outros visitantes.
- Cada operação administrativa verifica a identidade novamente no servidor; ocultar a interface não é a proteção.
- Escritas exigem a mesma origem. Dados são validados por Zod e consultas SQL são parametrizadas.
- JPEG, PNG e WebP são validados por assinatura e MIME; limite de 8 MB por arquivo. SVG não é aceito.
- Formulários possuem honeypot e limite persistente de requisições. O identificador de origem é resumido por hash por janela.
- Segredos, dados locais e .dev.vars não integram o repositório/artefato publicado.
- A privacidade prevê contato com o ateliê para correção/exclusão de dados. O gestor deve definir a rotina operacional de retenção e revisão.

## Conteúdo real e pendências

A seleção inicial contém 11 modelos apresentados nas publicações do próprio Instagram do ateliê, acessadas pelo navegador. Os nomes são descrições editoriais; códigos IG identificam publicações e não são códigos de estoque fornecidos pela loja. Cada produto mantém o link de origem.

Tamanhos, preços, condições, disponibilidade por data e horários não foram inferidos. Todos os modelos começam sob consulta. Não existem depoimentos, números de clientes ou história de empresa inventados.

As imagens foram obtidas das capas das publicações acessíveis, convertidas para WebP, preservando as cores e proporções e removendo somente faixas pretas externas quando presentes. Para ampliar a resolução e adicionar vistas, substitua-as pelos originais no painel.

A categoria Debutantes está preparada; nenhum modelo foi marcado nessa categoria sem uma publicação correspondente. A galeria de ocasiões é identificada como inspiração. Cadastre o acervo específico para ampliar essa categoria.

A integração automática de Instagram não foi ativada: a galeria é editável manualmente. Uma sincronização futura exige acesso oficial e permissões Meta, não scraping.

WhatsApp abre uma mensagem para a pessoa enviar; o site não envia mensagens em seu nome. As solicitações são registradas no painel. Não foi configurado disparo de email, aviso automático ao celular ou serviço externo de agenda.

## Verificações

`node node_modules/typescript/bin/tsc --noEmit` e build de produção.

`node scripts/test-api.mjs` executa testes de integração exclusivamente contra localhost. Requer banco local com a seleção inicial e servidor ativo. Ele cria dados de teste locais e pode consumir o limite temporário de formulários. Não o aponte para produção.

20 verificações de API passaram: autenticação, acesso anônimo, catálogo persistente, edição persistente, validação de foto publicada, consentimento, data passada, gravação pendente, idempotência, confirmação, conflito de agenda, liberação por cancelamento, bloqueio, rejeição de horário bloqueado, arquivo inseguro, upload R2, leitura de imagem, origem de escrita e rate limit.

No navegador: busca por terracota, filtro de cor, favoritos após recarga, menu mobile, página de produto, ampliação, formulário de locação e confirmação de recebimento. Revisão de largura de 320 a 2560 px e console.

Veja DESIGN.md para decisões visuais e a origem de cada imagem.
