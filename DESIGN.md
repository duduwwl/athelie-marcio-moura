# Redesign editorial — Atheliê Márcio Moura

Referências fixadas antes da implementação: [Alaïa](https://www.maison-alaia.com/) para cabeçalho preto e campanha fotográfica dominante; [KHAITE](https://khaite.com/) para contenção da navegação; [TOTEME](https://toteme.com/) para descoberta de coleção e itens salvos. Produtos e fotografias vêm do [Instagram oficial](https://www.instagram.com/atheliermarciomoura/).

Skills utilizadas: Refero Design e Sites; boas práticas React e verificação. O serviço de pesquisa Refero retornou NO_SUBSCRIPTION; a pesquisa utilizou as referências oficiais e o material de composição, tipografia e acessibilidade da skill.

## Decisões implementadas

- Campanha em colunas assimétricas com fotos verticais no enquadramento original, Bodoni Moda e interface Manrope. Fundo claro, bordas finas e cabeçalho preto; o título leva direto ao atendimento de prova no ateliê.
- Distribuição exclusiva das onze fotografias entre campanha, seleção, tecidos e Instagram. Diretório de ocasiões sem imagens. Imagens novas configuradas no painel também passam por deduplicação. Imagem única no produto não gera miniatura repetida.
- Catálogo regular de três colunas para comparar peças; duas no celular, com busca, filtros e favoritos existentes.
- Entrada curta da campanha, transições de categorias e indicadores com Motion. O conteúdo de todas as seções permanece visível mesmo se a observação de rolagem falhar; animações respeitam prefers-reduced-motion e a lente desativa em toque.

## Componentes efetivamente integrados

[Watermelon UI](https://ui.watermelon.sh/api/docs): fontes oficiais obtidas de https://registry.watermelon.sh/r/carousel-navigator.json, continuous-tabs.json e shimmer-button.json. Cópias originais em vendor/watermelon; adaptações em components/watermelon. Carousel Navigator controla o Embla real; Continuous Tabs controla categorias; Shimmer Button/Link é usado em chamadas e formulário. Motion está instalado como dependência. Licença MIT oficial copiada para vendor/watermelon/LICENSE.

[Canvas UI Glass](https://canvasui.dev/docs): fonte oficial https://canvasui.dev/r/glass-react.json em components/canvasui/Glass.tsx. A lente é montada sob demanda na foto de tecido em computadores com ponteiro fino. O componente oferece fallback DOM/WebGL em navegadores sem html-in-canvas; não são ativadas flags experimentais. Licença informada pelo fornecedor: MIT + Commons Clause, uso em produto permitido, redistribuição comercial como biblioteca vedada.

## Rastreabilidade das imagens

Cada URL abaixo usa o prefixo https://www.instagram.com/atheliermarciomoura/reel/ e termina com /.

| Arquivo WebP | Publicação | Características informadas |
|---|---|---|
| terracota | DeXgbG7PQRA | Crepe francês, sereia, ombro a ombro, fenda |
| capa-esmeralda | DeMKJyrBG_n | Verde esmeralda, capa assimétrica e laço |
| marinho | DeSXnYwP1Ho | Azul-marinho, ombro único, drapê, jabôs e fenda |
| fucsia | DduihtBvFQ1 | Fúcsia, alfaiataria corseletada e fenda |
| sereia-esmeralda | DeID802vOuF | Crepe francês, sereia, ombro a ombro, fenda |
| serenity-capa | Dd7Tj5IPzvz | Azul serenity, capa fixa, saia fluida, fenda |
| serenity-georgette | Dd334tLp60r | Crepe georgette, azul serenity, sobreposição, fenda |
| terracota-jabos | DdxI_z2PpVW | Terracota, ombro único, drapê, jabôs |
| oliva | DdpRURdPgDJ | Acetinado, verde oliva, ombro único, pala e fenda |
| zibeline | Ddeb2P3BF6f | Zibeline, verde esmeralda, tomara que caia, drapê e fenda |
| drape | Del1Ru-BT7N | Drapê egípcio, pala frontal; tom/tecido sujeitos a confirmação |

Não foram importadas as 4.408 publicações do perfil. Foi feita uma curadoria de 11 modelos para iniciar o catálogo, com acesso normal às publicações visíveis e sem sincronização por scraping.
