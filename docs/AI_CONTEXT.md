# KLEBER DEV — Contexto técnico para IAs

> Documento de continuidade do projeto. Leia este arquivo antes de propor mudanças, especialmente em um chat novo. Ele registra a intenção do produto, a arquitetura conhecida, as decisões em vigor, os testes, os problemas identificados e as próximas etapas. O snapshot automatizado no fim é gerado pelo GitHub Actions.

## 1. Instruções para a IA que assumir o projeto

1. Leia este documento por inteiro antes de editar o código.
2. Confirme o estado atual na branch e no commit do repositório. A seção automatizada indica a revisão usada pelo processo de sincronização; commits posteriores podem existir.
3. Trate o código atual como fonte de verdade para o comportamento implementado. Este documento ajuda a entender contexto, mas pode estar desatualizado entre atualizações.
4. Não confunda funcionalidade **implementada**, problema **observado**, decisão **vigente** e ideia **planejada**. As páginas `/sobre`, `/projetos` e `/contato` são uma proposta arquitetural discutida, não rotas já implementadas no estado analisado.
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
- **Forma atual:** aplicação React de página única, com seções e âncoras. O projeto inclui `BrowserRouter`, mas o `App.jsx` analisado não define rotas dedicadas para Home, Sobre, Projetos e Contato.

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

### Plano discutido, ainda não tratado como implementado

Há uma proposta para reorganizar o portfólio em quatro páginas:

- `/` — Home: Hero, projetos em destaque, breve apresentação/CTA e footer.
- `/projetos` — catálogo completo dos projetos.
- `/sobre` — trajetória, formação, competências e diferenciais.
- `/contato` — formulário funcional para enviar uma mensagem.

A proposta deve ser avaliada e implementada em uma mudança planejada, preservando a identidade visual. Antes de criar essas páginas, definir contratos de rota, conteúdo, títulos SEO, hierarquia dos headings, navegação, foco e testes. Não implementar um formulário que apenas simule sucesso: é necessário definir um destino real de envio, como uma função serverless ou serviço apropriado, junto com validação, estados de sucesso/erro e proteção contra spam.

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
- `src/App.jsx`: composição principal; Preloader, CursorTrail, SmoothScroll, link para pular ao conteúdo, Hero e seções carregadas sob demanda.
- `src/layout/`: seções principais (Hero, tecnologias/Seclogs, competências, projetos, diferenciais, formação e footer).
- `src/components/HeroSectionTransition.jsx`: controla a transição Hero/Stack e o comportamento do menu desktop associado à rolagem.
- `src/components/DeferredLayoutSection.jsx`: carregamento diferido das seções usando `IntersectionObserver` e carregamento dinâmico.
- `src/components/DeferredProjects.jsx`: carregamento diferido da seção de projetos.
- `src/components/HeroDesktop.jsx` e `src/components/HeroMobile.jsx`: composições do Hero por contexto de viewport.
- `src/components/MenuDesktop.jsx` e `src/components/MenuMobile.jsx`: navegação específica para desktop/mobile.
- `src/components/OptimizedImage.jsx`: componente de imagem responsiva com metadados, `srcSet`, dimensões reservadas e placeholder opcional.
- `src/components/ProjetoDesktop.jsx` e `src/components/ProjetoCarouselMobile.jsx`: apresentações de projetos diferentes para desktop e mobile.
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
- Existem testes especializados para persistência, refresh, slider mobile, painel Socials e interações do carrossel.
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

Ao adicionar rotas:
- Cada rota pública precisa de um `<h1>` único e informativo, títulos/metadados adequados e links reais com `href`.
- Verificar navegação por teclado, foco após mudança de rota, botão de voltar/avançar e carregamento direto/reload de cada URL.
- Atualizar sitemap/canonical/OG com URLs consistentes.
- Confirmar rewrites/fallbacks da Vercel para deep links.
- Se SEO por rota for importante, avaliar prerenderização; hoje o HTML inicial é uma raiz React vazia para o conteúdo da aplicação.

## 12. GitHub Actions, scripts e ambiente de desenvolvimento

O repositório possui workflows de auditoria e scripts especializados. A relação atual é gerada automaticamente ao fim deste documento, para evitar uma lista duplicada e desatualizada.

Checks locais previstos pelo `package.json`:
```bash
npm ci
npm run lint
npm run build
npm run preview
```

Para testes com Playwright, alguns workflows instalam ferramentas de forma temporária e instalam Chromium. Consulte cada workflow antes de executar seu script isoladamente.

Notas importantes:
- `package.json` declara `dev`, `build`, `lint` e `preview`; não declara `npm test` na revisão analisada.
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
2. **Controles sonoros:** verificar consistência entre texto visível e nome acessível dos botões, com teste dedicado.
3. **Bundle:** avaliar imports de GSAP/ScrollTrigger e módulos grandes; medir o ganho antes de refatorar.
4. **HTML inicial/SEO por rota:** se houver migração para páginas dedicadas, avaliar prerenderização e metadados por URL.
5. **CI:** incluir/confirmar validação geral de lint/build em pull requests e testar os critérios de falha dos workflows. A presença dos scripts não prova que todos sejam executados no evento correto.
6. **Testes unitários:** não havia comando `npm test` na configuração analisada; considerar testes unitários para lógica isolada além dos testes Playwright.
7. **Segurança de dependências:** avaliar auditoria das dependências e boas práticas de permissões de Actions, sem presumir que exista uma vulnerabilidade concreta.
8. **Nomes de arquivos:** nomes como `HeroTeste2.jsx` e `ProjetosTeste2.jsx` podem merecer uma renomeação planejada se forem componentes consolidados; atualizar imports e validar build/testes.
9. **Documentação de porta:** resolver a divergência entre a porta 3000 em `vite.config.js` e 5173 em partes da documentação.

## 15. Prioridades sugeridas

1. Resolver e revalidar o LCP desktop com relatórios comparáveis.
2. Corrigir e testar os nomes acessíveis dos controles sonoros.
3. Fortalecer o fluxo geral de validação para pull requests (lint, build e checks relevantes).
4. Planejar a arquitetura de rotas e o conteúdo de Home, Projetos, Sobre e Contato antes de separar as páginas.
5. Implementar formulário de contato com envio real e proteção contra spam.
6. Depois da mudança de rotas, atualizar metadados/sitemap, testar deep links, foco, teclado, Reduced, Lighthouse e Axe.
7. Continuar otimizando o bundle somente a partir de evidências e sem quebrar animações ou experiência mobile.

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

- **Commit de código analisado:** `31cfd36126cf7c0b34f90747bba5d1fa4aa334e6`
- **Data do commit analisado:** 2026-10-22T14:28:11-03:00
- **Mensagem do commit:** ci: adicionar workflow de testes unitários
- **Branch de referência desta execução:** main
- **Versão declarada do projeto:** portfolio-kg@0.0.0
- **Scripts npm declarados:** 7
- **Dependências de runtime:** 15
- **Dependências de desenvolvimento:** 12
- **Workflows encontrados:** 17
- **Scripts de automação encontrados:** 18

### Scripts npm

| Comando | Definição |
|---|---|
| `npm run dev` | `vite --host` |
| `npm run build` | `vite build` |
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
- `src/styles/`
- `src/utils/`

### Oito commits recentes até o commit analisado

| Commit | Data | Mensagem |
|---|---|---|
| `31cfd36` | 2026-10-22 | ci: adicionar workflow de testes unitários |
| `2bae8bc` | 2026-10-22 | docs(ai-context): atualizar snapshot automaticamente |
| `8ef66f2` | 2026-10-22 | feat: add testing framework and implement tests for experience mode functionality |
| `b745a62` | 2026-10-21 | docs(ai-context): atualizar snapshot automaticamente |
| `b5031b0` | 2026-10-21 | docs(readme): documentar contexto técnico para IAs |
| `e9feb12` | 2026-10-21 | docs(ai-context): atualizar snapshot automaticamente |
| `e53b348` | 2026-10-21 | ci(ai-context): sincronizar contexto técnico em commits e pull requests |
| `7c63cb5` | 2026-10-21 | docs(ai-context): documentar estado e arquitetura atual do portfólio |

<!-- END AUTO-GENERATED SECTION -->
