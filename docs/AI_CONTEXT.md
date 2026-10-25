# KLEBER DEV — Contexto técnico para IAs

> Documento de continuidade do projeto. Leia este arquivo antes de propor mudanças, especialmente em um chat novo. Ele registra a intenção do produto, a arquitetura conhecida, as decisões em vigor, os testes, os problemas identificados e as próximas etapas. O snapshot automatizado no fim é gerado pelo GitHub Actions.

## 1. Instruções para a IA que assumir o projeto

1. Leia este documento por inteiro antes de editar o código.
2. Confirme o estado atual na branch e no commit do repositório. A seção automatizada indica a revisão usada pelo processo de sincronização; commits posteriores podem existir.
3. Trate o código atual como fonte de verdade para o comportamento implementado. Este documento ajuda a entender contexto, mas pode estar desatualizado entre atualizações.
4. Não confunda funcionalidade **implementada**, problema **observado**, decisão **vigente** e ideia **planejada**. As quatro rotas existem. A Home foi preservada; Projetos já tem catálogo, filtros e paginação; Sobre tem Hero próprio e seções de conteúdo; Contato ainda apresenta canais de contato, mas não tem formulário de envio real. Sobre e Contato seguem abertas a refinamento.
5. Preserve a identidade visual, o uso de JavaScript/JSX e os comportamentos do portfólio. Não introduza TypeScript sem solicitação explícita.
6. Faça mudanças pequenas e coesas. Antes de refatorar GSAP, ScrollTrigger, Lenis, carregamento diferido ou UI SFX, estude os fluxos atuais e os testes associados.
7. Não declare testes aprovados sem executar ou consultar as evidências correspondentes. Diferencie testes automatizados em Chromium de validação em dispositivos físicos.
8. Depois de alterar código, rode os checks relevantes e analise o estado dos GitHub Actions. Se a mudança alterar a arquitetura, regras, comportamento, acessibilidade, SEO ou validações, atualize a parte narrativa deste arquivo no mesmo trabalho.
9. Nunca inclua segredos, tokens, credenciais, dados privados ou arquivos de ambiente neste documento.
10. Mantenha este contexto útil para diferentes IAs: prefira instruções explícitas, caminhos reais e fatos verificáveis a referências como “como conversamos anteriormente”.

## 2. Identidade e propósito do projeto

- **Nome visual:** KLEBER DEV.
- **Repositório:** https://github.com/kleber-goncalves/portfolio-kg
- **URL canônica declarada no `index.html`:** https://kleber-goncalves-dev.vercel.app/
- **Hospedagem:** Vercel.
- **Propósito:** portfólio pessoal para apresentar a identidade profissional, competências, diferenciais, formação, trajetória, tecnologias e projetos web.
- **Público principal:** recrutadores, equipes técnicas, clientes potenciais e desenvolvedores que queiram avaliar os trabalhos.
- **Direção:** experiência visual própria, interações cuidadas, responsividade, acessibilidade, SEO técnico e investigação contínua de desempenho. O site não deve ser tratado como um template genérico.
- **Forma atual:** aplicação React com `BrowserRouter` e rotas `/`, `/projetos`, `/sobre` e `/contato`. A Home reúne Hero/Stack, projetos em destaque e footer. Sobre reúne Hero editorial, competências, diferenciais, formação e footer. Projetos já oferece um catálogo independente com filtros e paginação; Contato apresenta canais conhecidos, mas ainda não tem formulário de envio real.

## 3. Estado atual versus plano futuro

### Implementado no código analisado

- Hero com apresentações distintas para desktop e mobile.
- Seção de tecnologias/stack, incluindo composições desktop e mobile.
- Seções de competências, projetos, diferenciais, formação e footer.
- Navegação entre seções, rolagem suave e transições animadas.
- Modo de experiência Full e Reduced.
- Efeitos sonoros em interações de interface e controle de volume.
- Links magnéticos com Motion.
- Otimização de imagens, versões WebP e metadados para `srcSet`.
- Carregamento diferido de seções e divisão de módulos por viewport.
- Auditorias automatizadas de performance, acessibilidade, SEO e comportamentos específicos pelo GitHub Actions.

### Implementação inicial da separação de páginas

- **src/App.jsx** declara as rotas `/`, `/projetos`, `/sobre` e `/contato` com React Router e carrega os componentes de página sob demanda. Também coordena o `RouteTransitionPreloader` por mudança de `location.pathname`; cada página sinaliza quando seu conteúdo essencial está pronto, sem transformar as seções diferidas em dependências da navegação.
- **src/pages/home/Home.jsx** contém apenas `HeroSectionTransition`, `DeferredProjects` e o footer (`DeferredLayoutSection` com `section="footer"`). Competências, diferenciais e formação não devem permanecer na Home.
- **src/pages/sobre/Sobre.jsx** apresenta um Hero editorial próprio por meio de `SobreHero.jsx`, seguido de `DeferredLayoutSection` para competências, diferenciais e formação. O footer legado é carregado ao final; o layout interno não o duplica nesta rota.
- **src/pages/projetos/Projetos.jsx** usa `InteriorPageLayout` e `ProjetoCatalogo.jsx` para apresentar o catálogo completo da rota `/projetos`. O catálogo de 42 projetos fica em `src/data/projetosCatalogo.js`, com categorias, tecnologias, descrições e links; a interface oferece filtros por categoria e linhas inspiradas no modo Reduced de `ProjetoDesktop`, sem o preview flutuante. A listagem usa paginação numerada: apresenta 10 projetos por página, com botões numéricos, anterior/próxima e indicação de página atual. Os botões controlam explicitamente o hover; a troca de página ou categoria limpa o estado visual anterior, enquanto a página atual mantém apenas o destaque de seleção, evitando que a elevação/borda de hover fique presa no botão antigo. Ao mudar de categoria, volta para a página 1. Ao trocar de página, o catálogo rola até o início da lista e atualiza o `ScrollTrigger`; a contagem apresenta o intervalo visível e o total da categoria. O catálogo captura globalmente a posição do ponteiro em dispositivos com mouse/trackpad e recalcula a linha sob o cursor durante scroll e resize, agrupando atualizações via `requestAnimationFrame`; os estados resultantes ativam os efeitos visuais da linha e a prop opcional `isGroupHoverActive` de `MagneticExternalLinkHover`, preservando a interação magnética individual dos links. A mudança de categoria e cada novo lote visível também acionam a atualização do `ScrollTrigger` para recalcular as posições das animações e do footer. Essa página não reutiliza nem altera `ProjetosTeste2.jsx`: a Home mantém seus seis projetos em destaque e o comportamento atual do preview.
- **src/pages/contato/Contato.jsx** permanece inicial: apresenta canais já conhecidos, mas ainda não possui formulário de envio real.
- **src/layouts/InteriorPageLayout.jsx** fornece estrutura comum às páginas internas, sem gerir diretamente os metadados do documento. O SEO global é sincronizado por `src/hooks/useRouteSeo.js`, acionado em `src/App.jsx` pela rota atual. Em desktop, o layout usa `PortfolioDesktopHeader` com o item ativo definido pela rota; em mobile, mantém o cabeçalho compacto e `MenuMobile`. Aceita a prop opcional `heroContent`: quando fornecida, substitui o cabeçalho genérico de eyebrow/título/descrição, evitando duplicar o `h1`; quando omitida, Projetos e Contato mantêm o cabeçalho padrão. Todas as rotas internas carregam automaticamente o footer completo por `DeferredLayoutSection section="footer"`; a Home mantém seu próprio `DeferredLayoutSection section="footer"`.
- O `BrowserRouter` já existia no `src/main.jsx` e foi mantido. A navegação usa uma lista central em `src/data/navigation.js`; os links para `#hero` e `#stack` são tratados como âncoras da Home, enquanto `/projetos`, `/sobre` e `/contato` são rotas.
- **Cabeçalho desktop compartilhado:** `src/components/PortfolioDesktopHeader.jsx` compõe o logo via `OptimizedImage`, `ExperienceDropdown`, `SoundControls` e `PortfolioNavigation`. O modo `placement="hero"` conserva o posicionamento absoluto do Hero; o modo `placement="interior"` usa o conjunto nas páginas internas. `logoRef` e `navRef` continuam sendo encaminhados ao logo e à navegação para preservar as animações GSAP de entrada de `HeroDesktop`.
- **Navegação reutilizável:** `src/components/PortfolioNavigation.jsx` renderiza os itens compartilhados usando `MagneticNavLink`. O estado ativo vem do contexto: seção atual no Hero e rota atual nas páginas internas.
- **Navegação de rotas e âncoras:** `src/hooks/usePortfolioNavigation.js` centraliza os cliques. Ao acionar `#hero` ou `#stack` em uma rota interna, navega primeiro para `/` com `portfolioScrollTarget` no state do Router; `HeroSectionTransition` completa a rolagem quando o conteúdo da Home está pronto.
- **Menu desktop flutuante é separado do cabeçalho horizontal:** `src/components/MenuDesktop.jsx` continua sendo o botão/painel que aparece conforme a rolagem. `App.jsx` o monta sob demanda depois da primeira exibição e coordena a visibilidade pela callback do `HeroSectionTransition` na Home e por `IntersectionObserver` de `[data-route-navigation]` nas páginas internas.
- **Mobile preservado:** o cabeçalho interno mantém uma composição compacta com `MenuMobile`; os controles móveis de som (`SoundToggle` e `SoundVolumeSliderMobile`) continuam no painel mobile, sem renderizar a composição desktop completa em telas pequenas.
- **Hero específico do Sobre:** `src/pages/sobre/SobreHero.jsx` apresenta o texto à esquerda e a fotografia `/euNvEnvt.png` à direita no desktop, mudando para uma coluna no mobile. A borda inferior da seção funciona como linha horizontal de ponta a ponta; o círculo decorativo com `GlobeIcon` fica sobre essa borda, alinhado horizontalmente ao centro do retrato. Seu posicionamento vertical acompanha os diferentes paddings inferiores responsivos, sem atravessar o meio da fotografia. No desktop definido pela variante `b-md` (largura a partir de 48rem, altura acima de 600px e ponteiro fino com hover), o bloco de texto usa `position: sticky`, `top: 6rem` e `align-self: start`, acompanhando a rolagem até o limite inferior da área do retrato. A seção usa `overflow-x-clip` em vez de `overflow-hidden` para evitar que um ancestral bloqueie o sticky; o padding inferior da imagem é removido apenas no desktop para alinhar o limite ao fim visível do retrato. Em celulares e tablets touch, o texto permanece no fluxo normal acima da imagem. Os efeitos de mouse da fotografia são isolados no quadro do retrato: A posição do cursor é capturada globalmente e o spotlight/brilho é recalculado tanto ao mover o ponteiro quanto durante a rolagem, de modo que a luz acompanhe o cursor parado quando o retrato se desloca pela tela. GSAP controla a inclinação 3D sutil com transição suave quando o cursor se move; durante a rolagem, o ângulo é recalculado e aplicado diretamente em relação à posição fixa do ponteiro e à geometria atual do retrato, sem reiniciar um tween a cada quadro. GSAP também controla a elevação quando o cursor entra na área; CSS desenha o spotlight radial e o brilho da borda. As atualizações são agrupadas por requestAnimationFrame. No modo Reduced, o componente não registra listeners nem renderiza essas camadas; telas estreitas, touch e paisagem compacta também ocultam os efeitos. O globo e a borda inferior ficam fora do elemento animado, e o Hero da Home não é modificado. A raiz `#root`, declarada em `index.html`, usa `overflow-x-clip` para conter apenas o eixo horizontal; evitar `overflow-hidden` nos dois eixos é importante porque o `overflow-y: hidden` no ancestral estava impedindo o sticky de acompanhar a rolagem da janela.

### Próximas etapas planejadas

- Revisar periodicamente descrições, categorias e links do catálogo de Projetos; manter `DeferredProjects` na Home como apresentação de destaque independente da listagem paginada da rota `/projetos`.
- Desenvolver a página Contato e criar o formulário somente depois de definir um destino real de envio, incluindo validação, estados de sucesso/erro e proteção contra spam.
- Refinar o conteúdo de Sobre, usando as seções legadas de competências, diferenciais e formação. Avaliar separadamente qualquer futura mudança na trajetória/Hero com testes de regressão GSAP/ScrollTrigger.
- Validar build, lint, testes, navegação por teclado, foco, botão voltar/avançar, carregamento direto/reload das quatro rotas e rewrites da Vercel.
- Validar o `RouteTransitionPreloader` nas quatro rotas em desktop/mobile, incluindo retorno do navegador, links internos para `#hero`/`#stack`, preferência por movimento reduzido e falha no carregamento das imagens essenciais.
- Verificar manualmente carregamento direto/reload das quatro rotas, canonical e aliases/rewrites na Vercel. Avaliar futuramente pré-renderização do corpo React (SSG/SSR): o build atual pré-gera metadados por URL, mas não o DOM completo das páginas.

## 4. Stack tecnológica

A aplicação é JavaScript/JSX, com React e Vite. A lista automática de dependências declaradas está no snapshot abaixo.

Tecnologias principais observadas:

- **React 19 / React DOM:** interface e componentes.
- **Vite:** servidor local e build.
- **Tailwind CSS 4:** estilos, tokens e regras de responsividade.
- **GSAP + ScrollTrigger + `@gsap/react`:** timelines, transições e animações ligadas à rolagem.
- **Lenis:** rolagem suave e integração com ScrollTrigger.
- **Motion for React:** animações spring e links magnéticos.
- **Swiper:** carrossel de projetos na experiência mobile.
- **Lucide React, `@thesvg/react` e `thesvg`:** ícones e elementos gráficos.
- **`uisfx`:** sons semânticos de interface.
- **DotLottie React:** suporte a animações Lottie.
- **Sharp:** criação de versões WebP das imagens.
- **Playwright + Chromium:** automação de navegador para testes e auditorias.
- **Lighthouse CI e Axe:** auditorias automatizadas de performance, SEO e acessibilidade.
- **GitHub Actions:** execução das validações.
- **Vercel:** deploy de produção e previews.

## 5. Arquitetura e arquivos importantes

Estrutura identificada no repositório:

- `src/main.jsx`: inicializa React em `StrictMode` e `BrowserRouter`; inclui mensagem de boas-vindas no console do DevTools.
- `src/App.jsx`: shell global, Preloader, CursorTrail, SmoothScroll, link para pular ao conteúdo, controles globais de UI SFX, chamada de `useRouteSeo(location.pathname)` e definição das quatro rotas com carregamento sob demanda. Rotas desconhecidas ainda redirecionam para `/` via `Navigate`, em vez de mostrar uma página 404 dedicada.
- `src/pages/`: componentes de rota. `home/Home.jsx` contém Hero/Stack, `DeferredProjects` e footer; `sobre/Sobre.jsx` usa `SobreHero.jsx` antes das seções de competências, diferenciais e formação; `projetos/Projetos.jsx` apresenta o catálogo paginado; `contato/Contato.jsx` lista canais de contato, sem formulário de envio real.
- `src/layouts/InteriorPageLayout.jsx`: estrutura compartilhada das rotas internas e navegação principal; aceita `heroContent` opcional para trocar o cabeçalho textual padrão por um Hero específico. Os metadados pertencem ao hook global `src/hooks/useRouteSeo.js`, usado por `src/App.jsx`.
- `src/layout/`: seções principais (Hero, tecnologias/Seclogs, competências, projetos, diferenciais, formação e footer).
- `src/components/HeroSectionTransition.jsx`: controla a transição Hero/Stack e o comportamento do menu desktop associado à rolagem; informa a prontidão da Home após o layout correto, o retrato principal e, no desktop Full, o Stack necessário para medir o pin.
- `src/components/RouteTransitionPreloader.jsx`: preloader de navegação com título e mensagem específica para Início, Projetos, Sobre e Contato. Só encerra após o sinal de prontidão da rota e um tempo mínimo de 600 ms (80 ms em movimento reduzido); bloqueia temporariamente a rolagem e anima a saída. Em `src/App.css`, a camada externa fica opaca desde a montagem para não revelar a rota de destino antes do preloader; a entrada animada fica restrita ao conteúdo interno.
- `src/components/DeferredLayoutSection.jsx`: carregamento diferido das seções usando `IntersectionObserver` e carregamento dinâmico.
- `src/components/DeferredProjects.jsx`: carregamento diferido da seção de projetos.
- `src/components/HeroDesktop.jsx` e `src/components/HeroMobile.jsx`: composições do Hero por contexto de viewport.
- `src/components/MenuDesktop.jsx`: painel flutuante desktop, separado do cabeçalho horizontal da página; sua visibilidade é coordenada pelo `App.jsx` com base no estado da Home ou da navegação da rota interna.
- `src/components/MenuMobile.jsx`: painel de navegação móvel, incluindo controles móveis de som e navegação após a animação de fechamento.
- `src/components/PortfolioDesktopHeader.jsx`: composição desktop reutilizável do logo, Experience, Som e navbar. `placement="hero"` preserva o posicionamento do Hero; `placement="interior"` adapta a composição ao cabeçalho das rotas internas. Encaminha refs usados pelo GSAP.
- `src/components/PortfolioNavigation.jsx`: lista horizontal de links magnéticos que recebe itens, destino ativo e handler de navegação.
- `src/pages/sobre/SobreHero.jsx`: Hero editorial específico da página Sobre, com retrato, apresentação profissional e links para as seções de competências e formação. O retrato `/euNvEnvt.png` usa `OptimizedImage` e sinaliza prontidão quando carrega ou falha, evitando prender a transição indefinidamente.
- `src/hooks/usePortfolioNavigation.js`: handler comum para navegação entre rotas e âncoras da Home, incluindo retorno à Home antes de rolar de uma página interna.
- `src/data/navigation.js`: fonte única dos destinos e rótulos Início, Stack, Projetos, Sobre e Contato.
- `src/data/seoRoutes.json`: fonte única dos títulos, descrições e alternativas da imagem social para as quatro rotas; também define a URL pública usada pelo canonical e sitemap.
- `src/hooks/useRouteSeo.js`: atualiza title, meta description, robots, canonical, Open Graph, Twitter Cards e JSON-LD `WebPage` durante navegação SPA.
- `scripts/generate-seo-routes.mjs`: parte do build de produção; escreve HTML com metadados específicos em `dist/index.html` e `dist/{projetos,sobre,contato}/index.html`, e gera `dist/sitemap.xml`.
- `scripts/audit-accessibility-seo.mjs`: confere os metadados estáticos por rota e executa as checagens semânticas/Axe em desktop e mobile.
- `src/data/projetosCatalogo.js`: catálogo próprio da rota `/projetos`, com 42 registros separados por categoria, tecnologia e links; os filtros e a lista paginada em páginas de 10 projetos, com navegação numérica, são renderizados por `src/components/ProjetoCatalogo.jsx`. O catálogo da página não é a fonte dos destaques da Home.
- `src/components/OptimizedImage.jsx`: componente de imagem responsiva com metadados, `srcSet`, dimensões reservadas e placeholder opcional. `scripts/optimize-project-images.mjs` também gera variantes WebP do retrato de Sobre (`public/euNvEnvt.png`) em `public/_optimized/hero/`, registradas em `src/generated/imageMetadata.json`; o workflow de otimização inclui a branch `feat/separacao-paginas`.
- **Auditoria de imagens em 24/10/2026:** o retrato raster de `SobreHero.jsx` era a única imagem de conteúdo encontrada fora de `OptimizedImage` e foi convertido. O workflow [Optimize project images — run 40142679387, tentativa 2](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/40142679387) concluiu com sucesso e criou as variantes `euNvEnvt-320.webp`, `-640.webp`, `-960.webp` e `-original.webp`, incluindo `srcSet` no metadata gerado. Os `<img>` restantes são logos/ilustrações SVG decorativas, os elementos internos do próprio `OptimizedImage` ou o ramo genérico de `LogoLoop` para itens `src` (os dados atuais do stack usam nós SVG/React, não imagens raster). Não converter automaticamente esses casos: eles não se beneficiam da pipeline WebP e algumas conversões alterariam o layout.
- `src/components/ProjetoDesktop.jsx` e `src/components/ProjetoCarouselMobile.jsx`: apresentações de projetos diferentes para a seção de destaque na Home (desktop e mobile). A página dedicada `/projetos` usa separadamente `src/components/ProjetoCatalogo.jsx` com `src/data/projetosCatalogo.js`, para não modificar a apresentação já existente na Home. No `ProjetoDesktop`, preservar a sensação original do preview: o painel segue o cursor com GSAP em `duration: 1.45`, a bolinha calcula sua posição relativa com `getBoundingClientRect()` e se move em `0.35` s; após 120 ms sem movimento, ela volta ao centro. A tentativa de trocar por `gsap.quickTo`, encurtar as transições e recalcular pela escala foi revertida pelo usuário porque ele prefere o comportamento visual anterior. O possível desalinhamento ocasional permanece como problema a investigar; futuras correções devem preservar o ritmo e a sensação da animação, salvo pedido explícito para alterá-los.
- `src/components/Socials.jsx`: painel de redes sociais.
- `src/components/SoundControls.jsx`, `SoundToggle.jsx` e `SoundVolumeSliderMobile.jsx`: controles de áudio.
- `src/hooks/useResponsive.js`: centraliza a lógica de viewport, dispositivos touch, tablet e paisagem compacta.
- `src/utils/experienceMode.js`: leitura e persistência do modo Full/Reduced.
- `src/utils/uiSfx.js` e `src/utils/uiSfxEvents.js`: integração central dos efeitos sonoros e eventos.
- `src/utils/lenisControl.js`: controles auxiliares de rolagem.
- `src/data/`: dados de trajetória e tecnologias/stack.
- `src/generated/imageMetadata.json`: catálogo gerado de imagens otimizadas.
- `src/docs/`: documentação técnica especializada.
- `scripts/`: automação para análises e testes de navegador.
- `.github/workflows/`: definições de GitHub Actions.
- `public/_optimized/`: variantes otimizadas de imagens.
- `src/assets/projetos/`: imagens originais dos projetos.

A árvore e o conjunto exatos de arquivos podem evoluir; confira o snapshot automatizado e o código da branch atual.

## 6. Identidade visual e design system

A paleta e os tokens observados em `src/App.css` incluem:

| Token/uso | Valor |
|---|---|
| Obsidian / fundo principal | `#0D0D0D` |
| Carbon | `#151515` |
| Graphite | `#242424` |
| Ivory / texto principal | `#F2F0EC` |
| Steel / texto secundário | `#8B8B8B` |
| Bronze / ênfase | `#A87852` |
| Warm bronze / hover | `#C49A78` |
| Champagne / detalhes | `#D8C2AA` |

Tipografias carregadas em `index.html`: **DM Mono**, **Space Grotesk** e **Bebas Neue**.

Princípios de implementação:
- Manter a identidade escura, tipografia e acentos bronze/champagne coerentes.
- Não substituir o design por uma aparência genérica de SaaS, dashboard, neon ou glassmorphism sem uma decisão explícita.
- Validar qualquer mudança responsiva em celulares, tablets, desktop e orientação paisagem.
- Considerar movimento, legibilidade, foco e preferências de movimento reduzido junto com a estética.
- Preferir componentes reutilizáveis quando isso reduz duplicação real; não abstrair apenas por abstrair.

## 7. Responsividade e experiência

`src/hooks/useResponsive.js` avalia largura/altura, orientação paisagem compacta, `(hover: none) and (pointer: coarse)` e breakpoints de layout. Tablets touch mantêm a experiência mobile mesmo em telas maiores. As variantes de desktop/mobile podem usar módulos de projeto e stack diferentes.

Não assuma que largura abaixo de um valor é o único critério de mobile: orientação, touch e altura também influenciam o layout. Teste redimensionamento e mudança de orientação e observe se listeners/observers são removidos corretamente.

## 8. Modo Full/Reduced

O modo é gerenciado em `src/utils/experienceMode.js` e usado pela aplicação/componentes para controlar a intensidade dos efeitos.

- **Full:** preserva a experiência visual/interativa mais completa.
- **Reduced:** diminui principalmente efeitos contínuos ou interativos custosos; não significa obrigatoriamente eliminar toda animação.
- A preferência é armazenada em `localStorage` sob a chave `experienceMode`.
- Se não houver preferência persistida, `prefers-reduced-motion: reduce` pode levar ao modo Reduced.
- A lógica deve continuar resiliente quando `localStorage` não estiver disponível.
- Preservar suporte a teclado e comportamento equivalente nos dois modos.

Os testes de scroll e Lighthouse comparam os modos. Uma melhora em Reduced não prova, por si só, que todos os elementos estão acessíveis ou que todas as interações ficaram mais rápidas.

## 9. UI SFX — efeitos sonoros

A implementação é centralizada em `src/utils/uiSfx.js` e `src/utils/uiSfxEvents.js`, utilizando a dependência `uisfx`.

- O padrão de preferência de som é ativado quando ainda não há valor salvo.
- A preferência e o volume são persistidos no armazenamento local quando possível.
- A interface expõe uma escala de volume de **0 a 800**; esse valor é um parâmetro de controle/ganho, não uma promessa de percepção sonora oito vezes maior.
- O navegador pode exigir interação do visitante para desbloquear áudio. Não presumir que o som pode tocar automaticamente antes da interação.
- Existem scripts de navegador para persistência após refresh, slider mobile, painel Socials e interações do carrossel. Eles validam fluxos integrados e complementam — mas não substituem — os testes unitários do motor de áudio.
- Evitar duplicar o player ou criar lógica de áudio independente em cada componente.
- Controles devem ter nomes acessíveis coerentes com o texto visível, `aria-pressed` apropriado e estados compreensíveis.

Documento detalhado: `src/docs/sistema-de-efeitos-sonoros.md`.

## 10. Imagens e desempenho

O script `scripts/optimize-project-images.mjs` usa Sharp para produzir variantes WebP de larguras diferentes, armazenadas sob `public/_optimized/`, e atualiza `src/generated/imageMetadata.json`. `OptimizedImage.jsx` usa o catálogo para resolver variantes, definir `srcSet`/`sizes` e reservar espaço de layout.

Cuidados:
- Para o retrato/imagem LCP do Hero, priorizar a descoberta e o carregamento, mas evitar preload indiscriminado de imagens fora da primeira tela.
- Conferir o tamanho real transferido e o caminho de renderização; formato WebP sozinho não garante LCP baixo.
- Manter dimensões/ratio para reduzir deslocamentos de layout.
- Usar lazy loading para conteúdo abaixo da dobra e prioridade alta apenas nos recursos realmente essenciais.
- Confirmar se imagens originais são necessárias no bundle ou se podem permanecer acessíveis apenas por URLs em `public/`.
- Ao alterar carregamento ou animação do Hero, testar o início da rolagem, deep link/âncora e a linha da trajetória.

## 11. Acessibilidade e SEO já presentes

Implementações observadas:
- Documento com `lang="pt-BR"`, título e descrição.
- Metadados Open Graph/Twitter e URL canônica no `index.html`.
- Dados estruturados JSON-LD com `Person` e `WebSite`.
- Arquivos `public/robots.txt` e `public/sitemap.xml`.
- Link para pular diretamente ao conteúdo principal e elemento `<main>`.
- Componentes de imagem aceitam texto alternativo; imagens informativas devem ter `alt` descritivo, decorativas podem usar `alt=""`.
- Classes e lógica de movimento reduzido.
- Workflows com Lighthouse mobile/desktop e auditoria Axe com Playwright.

Esses recursos são uma base de implementação, não uma declaração de conformidade integral com WCAG, nem uma garantia de indexação/ranking.

### SEO por rota e auditoria automatizada

- **Fonte única de metadados:** `src/data/seoRoutes.json` mantém título, descrição, texto alternativo da imagem social e URLs-base para `/`, `/projetos`, `/sobre` e `/contato`.
- **SEO durante navegação SPA:** `src/hooks/useRouteSeo.js` atualiza título do documento, description, robots, canonical, Open Graph, Twitter Cards e JSON-LD `WebPage`; `src/App.jsx` aciona o hook a partir de `location.pathname`, sem depender de efeitos separados em cada página.
- **Metadados estáticos por URL:** `scripts/generate-seo-routes.mjs` é executado ao fim de `npm run build`. Ele gera `dist/projetos/index.html`, `dist/sobre/index.html` e `dist/contato/index.html` com título, descrição, canonical, Open Graph/Twitter e JSON-LD específicos. A imagem de preload do Hero é retirada das páginas internas para evitar download desnecessário.
- **Sitemap:** a fonte `public/sitemap.xml` lista as quatro rotas públicas; o build gera `dist/sitemap.xml` a partir da mesma configuração de SEO.
- **Escopo e limite atual:** o script gera HTML estático com metadados por rota, mas não pré-renderiza o DOM completo do React. O conteúdo da página continua dependendo da hidratação JavaScript; o auditor deve manter esse ponto como aviso até uma implementação SSG/SSR de conteúdo ser validada.
- **Auditoria por rota:** `.github/workflows/accessibility-seo.yml` inclui `feat/separacao-paginas`. O script `scripts/audit-accessibility-seo.mjs` valida metadados, canonical, JSON-LD e sitemap nas quatro páginas e executa checagens semânticas/Axe em desktop e mobile. Os botões de paginação anterior, números e próxima página têm `title` descritivo além do nome acessível.
- **Resultado registrado em 24/10/2026:** [Acessibilidade e SEO — Actions run 40140155543](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/40140155543) terminou com sucesso. A auditoria estática contou 81 verificações aprovadas, 1 aviso e 0 erros; Axe encontrou 0 grupos de violações nas páginas e estados examinados. As checagens semânticas passaram para `/`, `/projetos`, `/sobre` e `/contato` em desktop 1440×900 e mobile 390×844: um `<main>`, um `<h1>` visível, botões/links com nome acessível, navegação rotulada, sem botão somente com ícone sem `title` e sem `div[role=button]`.
- **Correções motivadas pelo Axe:** em `src/components/ProjetoCatalogo.jsx`, os números dos filtros e rótulos de categoria receberam contraste de texto mais alto; `src/components/buttonReset.jsx` passou a colocar o atalho flutuante de retorno ao topo dentro de um `<nav aria-label>` nomeado. A auditoria anterior apontou esses problemas como violações e a execução posterior não registrou violações Axe.
- **Avisos não bloqueantes que permanecem:** o relatório ainda aponta que o corpo da página não está pré-renderizado (somente os metadados são estáticos por rota), e a checagem interativa não encontrou um gatilho visível de “Abrir menu” no viewport desktop testado. O segundo é um aviso de interação do script, não uma violação Axe; deve ser revisitado em testes manuais do menu desktop.

### Navegação entre páginas e cabeçalhos

- **Implementado na arquitetura atual:** o cabeçalho desktop compartilhado reúne logo, Experience, controles de som e navbar magnética nas páginas internas e no Hero da Home. A navegação horizontal é distinta do painel desktop flutuante acionado durante a rolagem.
- A lista de links fica em `src/data/navigation.js`; o link ativo usa a seção atual na Home e a rota atual nas páginas internas.
- Nos links Início/Stack clicados em páginas internas, a aplicação volta à Home e aguarda a disponibilidade do conteúdo antes de executar a rolagem para a âncora.
- No mobile, a navegação interna continua usando cabeçalho compacto e `MenuMobile`; os controles de som móveis permanecem no painel mobile.
- O Hero do Sobre tem um único `h1` próprio e ações para as seções já existentes (`#competencias` e `#formacao`); essas ações usam a API central de rolagem em vez de criar novos destinos ou duplicar conteúdo.

As rotas iniciais já foram declaradas; ainda é necessário:
- Verificar manualmente navegação por teclado, leitores de tela, foco após mudança de rota, botão voltar/avançar e carregamento direto/reload de cada URL.
- Confirmar na Vercel que as rotas estáticas geradas são servidas diretamente e que canonical não conflita com redirecionamentos de barra final.
- Avaliar SSG/SSR do conteúdo React se a pré-renderização integral se mostrar necessária; metadados estáticos por rota não significam que o conteúdo do corpo foi pré-renderizado.

## 12. GitHub Actions, scripts e ambiente de desenvolvimento

O repositório possui workflows de auditoria e scripts especializados. A relação atual é gerada automaticamente ao fim deste documento, para evitar uma lista duplicada e desatualizada.

Checks locais previstos pelo `package.json`:
```bash
npm ci
npm test
npm run lint
npm run build
npm run preview
```

Para testes com Playwright, alguns workflows instalam ferramentas de forma temporária e instalam Chromium. Consulte cada workflow antes de executar seu script isoladamente.

Notas importantes:
- `package.json` oferece `npm test` (execução única), `npm run test:watch` (modo observação) e `npm run test:coverage` (cobertura via V8), além de `dev`, `build`, `lint` e `preview`.
- `.github/workflows/unit-tests.yml` executa `npm ci`, `npm test`, `npm run lint` e `npm run build` em todo `push` para branches que contenham o workflow e a infraestrutura de testes; `pull_request` é filtrado para destinos `main` e `dev`. Também oferece execução manual via `workflow_dispatch`. A configuração foi propagada para `main` e `dev`; branches antigas sem esses arquivos precisam sincronizar a infraestrutura antes de executar testes em pushes próprios.
- A suíte unitária usa Vitest/jsdom e tem **32 testes em três arquivos**: `src/utils/test/experienceMode.test.js` (9), `src/utils/test/lenisControl.test.js` (12) e `src/utils/test/uiSfxEvents.test.js` (11). Em 24/10/2026, o workflow [Unit Tests — branch feat/separacao-paginas](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/40140491941) concluiu com sucesso os testes unitários, ESLint e build no commit `d0ff32b`. Esse run valida aquele estado; alterações futuras devem ser verificadas novamente.
- Os workflows atuais usam Node.js 24.
- `vite.config.js` declara porta **3000** e `strictPort: true`; a documentação anterior no README menciona a porta padrão 5173. Verificar/corrigir essa inconsistência antes de depender de uma das portas.
- O fato de um workflow estar verde significa que aquele job passou seus próprios checks. Não substitui testes físicos em aparelho, avaliação manual de acessibilidade ou análise de todos os fluxos.
- As medições do Lighthouse variam por ambiente e execução. Compare runs sob condições semelhantes e examine os artefatos, não só o badge de sucesso.
- Confirme que a URL preview avaliada corresponde ao commit/branch esperados.

## 13. Evidências e achados de auditoria registrados

Na auditoria do repositório e das execuções disponíveis em **21/10/2026**, foram observados estes resultados. São registros datados, não garantias sobre execuções futuras:

- A comparação Lighthouse Full/Reduced teve medianas mobile de **88/100** nos dois modos, com LCP de aproximadamente **3,65 s** em ambos. TBT foi 7 ms no Full e 3 ms no Reduced; CLS foi 0,020 no Full e 0,034 no Reduced.
- O teste automatizado de code splitting passou em viewport mobile de 390 px e desktop de 1365 px, confirmando carregamento diferido de seções e módulos de projetos distintos por viewport.
- O teste desktop de rolagem mostrou menor proporção de intervalos de frame acima de 20 ms no Reduced (mediana de 1,3% contra 4,1% no Full) e menos intervalos acima de 33,3 ms (2 contra 10). A volta ao Hero pelo menu teve medianas aproximadas de 1,45 s no Reduced e 1,33 s no Full.
- O workflow dedicado de acessibilidade/SEO concluiu com sucesso. O script informou ausência de erros SEO estáticos bloqueadores e de violações Axe bloqueadoras, mas registrou avisos: raiz HTML inicial sem conteúdo renderizado e ausência de botão visível chamado “Abrir menu” em um dos viewports auditados.
- Nas duas execuções mobile desse workflow, Lighthouse apresentou performance de 80 e 82, acessibilidade 100 e SEO 100; nas duas execuções desktop, performance foi 48 e 54, acessibilidade 100 e SEO 100. O LCP desktop ficou próximo de 8,0 s nas medições desse workflow.
- O relatório de bundle identificou imports dinâmicos de GSAP/ScrollTrigger ineficazes para divisão de chunks, porque os módulos também são importados estaticamente em vários componentes. A cobertura de runtime indicou código não executado nos percursos automatizados; isso exige investigação antes de remover código.
- Esses dados apontam a necessidade de investigar a descoberta/renderização da imagem LCP no Hero desktop, os imports de animação e os nomes acessíveis dos controles. Evite assumir a causa sem repetir a medição e inspecionar os relatórios completos.

Links dos runs usados naquela auditoria:
- Lighthouse Performance: https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39655100175
- Comparação Full/Reduced: https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39655100207
- Code splitting: https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39655100173
- Bundle analysis: https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39655100091
- Runtime coverage: https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39655100133
- Acessibilidade/SEO: https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39655100252
- Desktop scroll: https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39655100079

## 14. Problemas e oportunidades conhecidos

Trate estes pontos como itens para verificar, não como autorização para fazer mudanças amplas sem testes:

1. **LCP desktop:** em uma auditoria de laboratório, LCP aproximou-se de 8 s. Investigar priorização da imagem e caminho de renderização do Hero antes de mexer no visual.
2. **Controles sonoros:** a auditoria automatizada recente passou nas verificações de nomes acessíveis e botões somente com ícone nas quatro rotas; ainda vale testar manualmente teclado/leitor de tela e confirmar que o nome anunciado comunica claramente a ação de cada controle.
3. **Bundle:** avaliar imports de GSAP/ScrollTrigger e módulos grandes; medir o ganho antes de refatorar.
4. **SEO por rota:** títulos, descriptions, canonical, Open Graph/Twitter, JSON-LD `WebPage` e sitemap por rota já estão implementados e são verificados pelo workflow. O conteúdo React do corpo ainda não é pré-renderizado. Além disso, o wildcard em `src/App.jsx` redireciona caminhos desconhecidos para `/`; avaliar uma página 404 com comportamento apropriado e testar deep links na Vercel.
5. **CI:** o workflow `Unit Tests` passou em testes, ESLint e build na execução de 24/10/2026; `Accessibility and SEO Audit` também passou para as quatro rotas, em desktop/mobile, no run 40140155543. Continuar verificando o resultado real para cada mudança; uma configuração de workflow ou um run antigo não prova o estado de commits futuros.
6. **Testes unitários:** Vitest e jsdom estão configurados; os três arquivos de teste cobrem `experienceMode.js`, `lenisControl.js` e `uiSfxEvents.js`, totalizando 32 casos. A próxima expansão prioritária é criar testes unitários para `uiSfx.js` (estado de áudio, desbloqueio, preferências, volume e limpeza) e `useResponsive.js` (breakpoints, orientação, touch e listeners), orientando o escopo pelo relatório `npm run test:coverage`.
7. **Segurança de dependências:** avaliar auditoria das dependências e boas práticas de permissões de Actions, sem presumir que exista uma vulnerabilidade concreta.
8. **Nomes de arquivos:** nomes como `HeroTeste2.jsx` e `ProjetosTeste2.jsx` podem merecer uma renomeação planejada se forem componentes consolidados; atualizar imports e validar build/testes.
9. **Documentação de porta:** `vite.config.js` declara a porta 3000 e `strictPort: true`; a documentação anterior/README pode mencionar 5173. Resolver essa divergência antes de depender de uma das portas.

## 15. Prioridades sugeridas

1. Resolver e revalidar o LCP desktop com relatórios comparáveis.
2. Corrigir e testar os nomes acessíveis dos controles sonoros.
3. Executar `npm run test:coverage`, registrar a cobertura inicial e ampliar os testes unitários de `uiSfx.js` e `useResponsive.js` com mocks controlados; depois, cobrir outras lacunas reais reveladas pela cobertura.
4. Revisar manualmente os repositórios menores no catálogo de Projetos para confirmar descrições, status e links de demonstração quando houver pouca documentação pública. Manter a fonte de dados da página `/projetos` independente dos seis destaques da Home.
5. Finalizar a página de Contato, definindo serviço/destino real antes do formulário e incluindo validação e proteção contra spam.
6. Refinar conteúdo e layout de Sobre, validando as seções diferidas e o footer.
7. Fazer validação manual de teclado, leitor de tela e foco após navegação; confirmar deep links, canonical e os HTMLs gerados nas quatro rotas na Vercel.
8. Avaliar SSG/SSR do corpo React e uma página 404 para caminhos desconhecidos; os metadados estáticos por rota e o sitemap já estão implementados.

## 16. Regras para registrar futuras alterações neste contexto

- Descreva o que mudou, por que mudou e quais arquivos/decisões foram afetados.
- Marque o estado como **implementado**, **parcial**, **planejado**, **bloqueado** ou **removido**.
- Para correções de bugs, anote o comportamento anterior, a correção e o teste que comprova o resultado.
- Para performance, inclua URL/branch/commit do workflow, dispositivo/viewport, métrica e comparação relevante.
- Para novas rotas, componentes ou dependências, atualize arquitetura e testes.
- Remova informações obsoletas em vez de acumular afirmações contraditórias.
- A seção automatizada informa a revisão, scripts, dependências, workflows, diretórios e commits recentes. Ela não consegue deduzir todas as decisões de produto; atualizações narrativas importantes continuam fazendo parte da revisão do código.

## Snapshot automatizado

<!-- BEGIN AUTO-GENERATED SECTION -->

## Snapshot automatizado do repositório

> Esta seção é gerada por `scripts/update-ai-context.mjs`. Não edite manualmente o conteúdo entre os marcadores.

- **Commit de código analisado:** `3663f3a3e06804a6d78b086c2bb928889d4b3cd8`
- **Data do commit analisado:** 2026-10-24T21:59:18-03:00
- **Mensagem do commit:** fix: evitar flash da rota antes do preloader
- **Branch de referência desta execução:** feat/separacao-paginas
- **Versão declarada do projeto:** portfolio-kg@0.0.0
- **Scripts npm declarados:** 7
- **Dependências de runtime:** 15
- **Dependências de desenvolvimento:** 12
- **Workflows encontrados:** 17
- **Scripts de automação encontrados:** 19

### Scripts npm

| Comando | Definição |
|---|---|
| `npm run dev` | `vite --host` |
| `npm run build` | `vite build && node scripts/generate-seo-routes.mjs` |
| `npm run lint` | `eslint .` |
| `npm run preview` | `vite preview` |
| `npm run test` | `vitest run` |
| `npm run test:watch` | `vitest` |
| `npm run test:coverage` | `vitest run --coverage` |

### Dependências instaladas no projeto

| Pacote | Versão declarada |
|---|---|
| `@gsap/react` | `^2.1.2` |
| `@lottiefiles/dotlottie-react` | `^0.19.16` |
| `@tailwindcss/vite` | `^4.3.3` |
| `@thesvg/react` | `^3.3.1` |
| `gsap` | `^3.15.0` |
| `lenis` | `^1.3.26` |
| `lucide-react` | `^1.37.0` |
| `motion` | `^13.3.0` |
| `react` | `^19.2.8` |
| `react-dom` | `^19.2.8` |
| `react-router-dom` | `^7.18.4` |
| `swiper` | `^14.2.0` |
| `tailwindcss` | `^4.3.3` |
| `thesvg` | `^3.3.1` |
| `uisfx` | `^0.4.0` |

### Dependências de desenvolvimento

| Pacote | Versão declarada |
|---|---|
| `@eslint/js` | `^10.0.1` |
| `@types/react` | `^19.2.17` |
| `@types/react-dom` | `^19.2.3` |
| `@vitejs/plugin-react` | `^6.0.4` |
| `@vitest/coverage-v8` | `^5.0.5` |
| `eslint` | `^10.8.0` |
| `eslint-plugin-react-hooks` | `^7.1.1` |
| `eslint-plugin-react-refresh` | `^0.5.3` |
| `globals` | `^17.7.0` |
| `jsdom` | `^29.1.1` |
| `vite` | `^8.2.0` |
| `vitest` | `^5.0.5` |

### Workflows do GitHub Actions

- `.github/workflows/accessibility-seo.yml` — Accessibility and SEO Audit
- `.github/workflows/ai-context.yml` — AI Context — Synchronize
- `.github/workflows/analyze-js-performance.yml` — Analyze JavaScript Bundle
- `.github/workflows/analyze-js-runtime-coverage.yml` — Analyze Unused JavaScript
- `.github/workflows/desktop-scroll-performance.yml` — Desktop Scroll Interaction Performance
- `.github/workflows/lighthouse-experience-modes.yml` — Lighthouse Experience Mode Comparison
- `.github/workflows/lighthouse-performance.yml` — Lighthouse Performance
- `.github/workflows/logo-loop-performance.yml` — LogoLoop Visibility Performance
- `.github/workflows/menu-desktop-reduced.yml` — Menu Desktop Reduced Visibility
- `.github/workflows/menu-mobile-overlay.yml` — Menu Mobile Overlay And Scroll Lock
- `.github/workflows/minha-trajetoria-scroll.yml` — Minha Trajetoria Scroll Progress
- `.github/workflows/mobile-ui-sfx-slider.yml` — Mobile UI Sound Interactions
- `.github/workflows/optimize-project-images.yml` — Optimize project images
- `.github/workflows/socials-panel-performance.yml` — Socials Panel First Open Performance
- `.github/workflows/test-code-splitting.yml` — Deferred Section and Project Code Splitting
- `.github/workflows/ui-sfx-refresh.yml` — UI Sound Preference and Refresh
- `.github/workflows/unit-tests.yml` — Unit Tests

### Scripts de automação

- `scripts/analyze-js-bundle.mjs`
- `scripts/analyze-js-runtime-coverage.mjs`
- `scripts/audit-accessibility-seo.mjs`
- `scripts/check-reduced-mode-scroll.mjs`
- `scripts/generate-seo-routes.mjs`
- `scripts/lhci-set-experience-mode.cjs`
- `scripts/measure-desktop-scroll-performance.mjs`
- `scripts/optimize-project-images.mjs`
- `scripts/summarize-lighthouse-modes.mjs`
- `scripts/test-code-splitting.mjs`
- `scripts/test-logo-loop-performance.mjs`
- `scripts/test-menu-desktop-reduced.mjs`
- `scripts/test-menu-mobile-overlay.mjs`
- `scripts/test-minha-trajetoria-scroll.mjs`
- `scripts/test-mobile-socials-ui-sfx.mjs`
- `scripts/test-mobile-ui-sfx-slider.mjs`
- `scripts/test-socials-panel-performance.mjs`
- `scripts/test-ui-sfx-refresh.mjs`
- `scripts/update-ai-context.mjs`

### Diretórios principais de `src/`

- `src/assets/`
- `src/components/`
- `src/data/`
- `src/docs/`
- `src/generated/`
- `src/hooks/`
- `src/layout/`
- `src/layouts/`
- `src/pages/`
- `src/styles/`
- `src/utils/`

### Oito commits recentes até o commit analisado

| Commit | Data | Mensagem |
|---|---|---|
| `3663f3a` | 2026-10-24 | fix: evitar flash da rota antes do preloader |
| `986360c` | 2026-10-25 | docs(ai-context): atualizar snapshot automaticamente |
| `c80d8cf` | 2026-10-24 | perf: aumentar tempo minimo do preloader de rotas |
| `89ee590` | 2026-10-24 | docs(ai-context): atualizar snapshot automaticamente |
| `e360843` | 2026-10-24 | docs: registrar resultado da auditoria de imagens |
| `9decca0` | 2026-10-24 | chore(images): generate responsive WebP variants [skip ci] |
| `dcfbdf2` | 2026-10-24 | docs(ai-context): atualizar snapshot automaticamente |
| `6918ba8` | 2026-10-24 | fix: remover variável não utilizada do preloader |

<!-- END AUTO-GENERATED SECTION -->
