# Plano de reorganização da arquitetura por página

> **Tipo:** plano operacional de refatoração e documento de continuidade entre conversas/assistentes.  
> **Estado atual:** EM ANDAMENTO — Etapas 0 (Preflight) e 1 (Home) concluídas; Etapa 2 (Sobre) é a próxima etapa, ainda não iniciada.
> **Última análise estrutural:** 07/11/2026.  
> **Repositório:** \`kleber-goncalves/portfolio-kg\`.  
> **Branch exclusiva de trabalho:** \`feat/separacao-paginas\`.  
> **Commit-base analisado:** \`a76466a2d14c7e26e0ad699f2cfc5131c906e0ae\`.
> **HEAD validado após a conclusão da Etapa 1 (07/11/2026):** dfe832b958b5306ba1d2dc70b054e2840ddcc278.

## 1. Objetivo

Reorganizar o código para que cada página concentre seus próprios layouts, componentes, dados, estilos, assets e testes quando esses arquivos forem exclusivos dela. A intenção é reduzir a dispersão atual entre \`src/components/\`, \`src/layout/\`, \`src/data/\`, \`src/styles/\` e \`src/utils/\`, tornando mais simples localizar, entender, testar e manter cada funcionalidade.

O trabalho é **estrutural**. Deve preservar o comportamento funcional e visual existente, o roteamento, os limites de carregamento sob demanda, as animações, o modo Full/Reduced, o SEO, a acessibilidade, o formulário Basin e os caminhos públicos dos arquivos gerados.

Este documento é a fonte operacional para executar e retomar a tarefa. O \`docs/AI_CONTEXT.md\` contém o resumo e aponta para este plano.

## 2. Estado inicial e regras de segurança

Na análise de 07/11/2026:

- \`feat/separacao-paginas\` estava em \`a76466a2d14c7e26e0ad699f2cfc5131c906e0ae\`.
- A branch estava 375 commits à frente de \`dev\` e 379 à frente de \`main\`, sem commits atrás, conforme a comparação feita antes deste documento.
- Não havia Pull Request aberto para essa branch.
- **Estado no momento da criação do plano:** nenhum arquivo de código havia sido movido; a autorização inicial era apenas registrar o planejamento. As movimentações posteriores estão documentadas nos resultados das etapas abaixo.
- \`main\` é a branch de produção e \`dev\` é a branch de desenvolvimento. Ambas devem permanecer intactas durante a refatoração.


### Resultado da Etapa 0 — Preflight (07/11/2026)

- **HEAD confirmado:** `c8f8efd6ac15093e0dafb3122c24ad6c9f728d53`.
- **Integridade da árvore:** árvore recursiva completa, sem truncamento; 273 entradas totais, 99 arquivos de código/estilo dentro de `src/`, 17 workflows e 19 scripts de automação.
- **Mudanças concorrentes:** comparação entre o commit que registrou o plano (`d5f2653b0cd87d7673bcec9baadb6f49f80e21cd`) e o HEAD atual encontrou apenas uma alteração em `docs/AI_CONTEXT.md`, gerada pela sincronização automática. Nenhum arquivo de código-fonte mudou desde a criação do plano.
- **Documentação:** o plano e a referência no `AI_CONTEXT.md` estão presentes e legíveis na branch atual.
- **Composição da Home confirmada:** `Home.jsx` consome `HeroSectionTransition`, `DeferredProjects` e o `DeferredLayoutSection` global. `HeroSectionTransition` conecta `HeroTeste2` e `Logo2`; estes carregam sob demanda as variações desktop/mobile do Hero, da stack e dos projetos em destaque. A organização pode preservar os limites lazy existentes.
- **Dependências compartilhadas que permanecem globais:** `OptimizedImage`, `GlobeIcon`, `PortfolioDesktopHeader`, `MenuMobile`, `MagneticExternalLinkHover`, `useResponsive`, `navigation.js`, `tecnologias.js`, `lenisControl.js`, `uiSfx.js` e `uiSfxEvents.js`. `Socials`, `DotField`, `FlowingMenu`, `logoLoop` e `ProjetoCard` pertencem à composição da Home.
- **Assets:** os seis arquivos originais de projeto são importados diretamente por `src/layout/ProjetosTeste2.jsx`. A movimentação para `pages/home/assets/` fica condicionada à busca global final de referências no início da Etapa 1; se houver qualquer outro consumidor, manter os assets compartilhados em local global.
- **CSS da Home:** `looptextHero.css` e `heroParallax.css` são importados pelo Hero desktop; `LogoLoop.css` é importado pelo LogoLoop mobile. `DotField.css` não tem import direto identificado em `DotField.jsx`; não mover nem excluir sem rastrear outras referências.
- **GitHub Actions:** os filtros de caminhos e branches que precisam ser atualizados na Etapa 1 foram mapeados em `logo-loop-performance.yml`, `menu-mobile-overlay.yml`, `minha-trajetoria-scroll.yml`, `mobile-ui-sfx-slider.yml`, `socials-panel-performance.yml`, `test-code-splitting.yml` e `menu-desktop-reduced.yml`. `optimize-project-images.yml` já inclui a branch de trabalho, mas seus caminhos de assets/hero precisam ser alinhados se houver movimentação.
- **Validações disponíveis:** Unit Tests #221 concluiu com sucesso no commit `d5f2653` ([execução](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42414505551)); AI Context — Synchronize #220 também concluiu com sucesso ([execução](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42414505535)). Essas execuções antecedem o commit automático de sincronização de contexto, que não alterou código. A falha conhecida da auditoria de contraste Accessibility/SEO continua como baseline preexistente.
- **Limites confirmados:** nenhuma movimentação de código, alteração visual/funcional, PR ou merge foi realizado durante o Preflight. `main` e `dev` permanecem fora do escopo.

**Regras obrigatórias para a execução:**

1. Trabalhar somente em \`feat/separacao-paginas\`.
2. Não fazer merge, rebase, cherry-pick ou push para \`main\`/ \`dev\` sem solicitação expressa.
3. Não abrir PR nem fazer merge ao concluir a reorganização sem autorização posterior.
4. Antes de cada etapa, conferir o HEAD atual da branch. Se ele for diferente do commit-base acima, ler os commits e a árvore atualizados e reconciliar este plano com o estado real; não presumir que os caminhos continuam iguais.
5. Não usar force push, não apagar histórico e não sobrescrever commits que chegaram por automações.
6. Não alterar lógica, conteúdo, estilos ou comportamento por conveniência durante uma simples movimentação. Ajustes funcionais identificados devem ser registrados e tratados separadamente, salvo correção estritamente necessária para a compilação.
7. Não apagar componentes ou estilos apenas por parecerem antigos ou não usados. Exigir busca de referências no repositório inteiro e evidência suficiente antes de propor qualquer remoção.
8. Preservar imports dinâmicos e carregamento lazy. Não transformar módulos sob demanda em imports estáticos durante a reorganização.
9. Não afirmar que testes, build, navegador ou Actions passaram sem realmente executar e conferir os resultados.

## 3. Estrutura-alvo

A proposta é manter os diretórios globais existentes para módulos compartilhados, sem criar uma camada \`src/shared/\` nesta tarefa. As pastas dentro de cada página devem existir quando houver arquivos reais para elas; não criar diretórios vazios apenas para uniformizar a árvore.

\`\`\`text
src/
├── pages/
│   ├── home/
│   │   ├── Home.jsx
│   │   ├── layouts/
│   │   ├── components/
│   │   ├── data/
│   │   ├── assets/
│   │   └── styles/
│   ├── sobre/
│   │   ├── Sobre.jsx
│   │   ├── layouts/
│   │   ├── components/
│   │   ├── data/
│   │   └── styles/
│   ├── projetos/
│   │   ├── Projetos.jsx
│   │   ├── layouts/
│   │   └── data/
│   └── contato/
│       ├── Contato.jsx
│       ├── components/
│       ├── utils/
│       └── __tests__/
├── components/          # componentes globais/compartilhados
├── layouts/             # layouts compartilhados
├── hooks/               # hooks compartilhados
├── utils/               # utilitários compartilhados
├── data/                # dados compartilhados
├── styles/              # estilos realmente compartilhados
├── assets/              # assets não exclusivos de uma página
├── generated/           # metadados gerados e consumidos globalmente
├── docs/
├── App.jsx
├── App.css
└── main.jsx
\`\`\`

A árvore é um destino conceitual, não uma ordem para criar cada pasta. Por exemplo, Contato não precisa de \`layouts/\` enquanto não tiver um layout exclusivo extraído.

## 4. Mapeamento dos arquivos por página

O mapeamento abaixo foi confirmado pela inspeção dos imports e da composição atual. Durante a execução, repetir a busca de referências antes de cada lote de movimentação.

### 4.1 Home

**Permanecem na raiz da página:** \`src/pages/home/Home.jsx\`.

**Layouts/composições exclusivas planejadas para \`src/pages/home/layouts/\`:**

- \`src/components/HeroSectionTransition.jsx\`
- \`src/layout/HeroTeste2.jsx\`
- \`src/components/HeroDesktop.jsx\`
- \`src/components/HeroMobile.jsx\`
- \`src/layout/Logo2.jsx\`
- \`src/layout/SeclogsDesktop.jsx\`
- \`src/layout/SeclogsMobile.jsx\`
- \`src/layout/ProjetosTeste2.jsx\`
- \`src/components/ProjetoDesktop.jsx\`
- \`src/components/ProjetoCarouselMobile.jsx\`

**Componentes internos planejados para \`src/pages/home/components/\`:**

- \`src/components/DeferredProjects.jsx\`
- \`src/components/DotField.jsx\`
- \`src/components/Socials.jsx\`
- \`src/components/FlowingMenu.jsx\`
- \`src/components/logoLoop.jsx\`
- \`src/components/ProjetoCard.jsx\`

**Dados exclusivos planejados para \`src/pages/home/data/\`:**

- \`src/data/seclogsDesktop.data.jsx\`
- \`src/data/seclogsMobile.data.jsx\`

**Assets:** verificar referências e mover \`src/assets/projetos/**\` para \`src/pages/home/assets/projetos/**\` se a busca confirmar que são usados exclusivamente pelo preview da Home. Caso algum outro consumidor real seja encontrado, não mover até decidir a localização compartilhada correta. Atualizar o script e o workflow de otimização de imagens se o diretório for movido.

**Estilos exclusivos candidatos a mover para \`src/pages/home/styles/\`:**

- \`src/styles/looptextHero.css\`
- \`src/styles/heroParallax.css\`
- \`src/styles/LogoLoop.css\`

Verificar \`DotField.css\`: o componente \`DotField.jsx\` não apresentou import direto desse arquivo na análise. Não mover nem excluir sem verificar importações globais, CSS importado indiretamente e referências em outras páginas.

### 4.2 Sobre

**Permanecem na raiz:** \`src/pages/sobre/Sobre.jsx\`.

**Layouts exclusivos para \`src/pages/sobre/layouts/\`:**

- \`src/pages/sobre/SobreHero.jsx\` (mover para dentro de \`layouts/\`)
- \`src/layout/Competencia.jsx\`
- \`src/layout/DiferenciaisTeste.jsx\`
- \`src/layout/Formacao.jsx\`

**Componentes exclusivos para \`src/pages/sobre/components/\`:**

- \`src/components/Card1-teste.jsx\`
- \`src/components/card2.jsx\`
- \`src/components/MinhaTrajetoria.jsx\`

**Dados exclusivos para \`src/pages/sobre/data/\`:**

- \`src/data/eventosTrajetoria.js\`

**Estilos exclusivos candidatos para \`src/pages/sobre/styles/\`:**

- \`src/styles/sobreHeroPortrait.css\`
- \`src/styles/formationCard.css\`
- \`src/styles/editorialCard.css\`
- \`src/styles/editorialCard2.css\`

\`src/components/CompetenciaItem.jsx\` não apareceu como dependência direta de \`Competencia.jsx\` na inspeção inicial. Fazer uma busca global por referências e manter sem alterações caso não haja relação comprovada. Não excluir.

### 4.3 Projetos

**Permanece na raiz:** \`src/pages/projetos/Projetos.jsx\`.

**Layout exclusivo para \`src/pages/projetos/layouts/\`:**

- \`src/components/ProjetoCatalogo.jsx\` (catálogo completo da rota \`/projetos\`).

**Dados exclusivos para \`src/pages/projetos/data/\`:**

- \`src/data/projetosCatalogo.js\`.

**Não confundir os dois recursos de projetos:**

- \`ProjetosTeste2.jsx\` é a seção de seis projetos em destaque na Home.
- \`ProjetoCatalogo.jsx\` é o catálogo da rota \`/projetos\`, atualmente alimentado por \`projetosCatalogo.js\`.

**Permanecem compartilhados:**

- \`src/data/tecnologias.js\`, usado tanto no preview da Home quanto no catálogo.
- \`src/components/MagneticExternalLinkHover.jsx\`, usado pelo preview da Home e pelo catálogo.
- \`src/hooks/useResponsive.js\`.
- \`src/utils/uiSfx.js\` e \`src/utils/lenisControl.js\`.

Não alterar paginação, filtros, animações, modo Reduced ou sincronização de ScrollTrigger.

### 4.4 Contato

**Permanece na raiz:** \`src/pages/contato/Contato.jsx\`.

**Componente exclusivo para \`src/pages/contato/components/\`:**

- \`src/components/MagneticSubmitButton.jsx\`.

**Utilitários exclusivos para \`src/pages/contato/utils/\`:**

- \`src/utils/contactSchema.js\`
- \`src/utils/contactSubmission.js\`

**Testes exclusivos para \`src/pages/contato/__tests__/\`:**

- \`src/utils/test/Contato.test.jsx\`
- \`src/utils/test/contactSchema.test.js\`
- \`src/utils/test/contactSubmission.test.js\`

A configuração do Vitest encontrada usa o padrão \`src/**/*.test.{js,jsx}\`; os testes em \`pages/contato/__tests__/\` devem continuar cobertos pelo glob, mas isso precisa ser confirmado pela execução real.

**Permanecem compartilhados:**

- \`src/components/MagneticExternalLink.jsx\`, utilizado pelo Contato e Footer.
- O layout interno \`src/layouts/InteriorPageLayout.jsx\`.

Preservar nomes de campos Basin, endpoint \`VITE_BASIN_FORM_ENDPOINT\`, validação Zod/HTML, mensagens, estados e comportamento do submit. Não fazer envio real para o Basin como parte de uma validação automatizada sem autorização.

## 5. Módulos compartilhados e arquivos que não devem ser movidos por associação superficial

Manter globais, salvo descoberta de novas referências que prove o contrário:

- \`src/components/DeferredLayoutSection.jsx\`: usado por Home, Sobre e layout interno; mantém a responsabilidade global de carregar seções e Footer sob demanda.
- \`src/layouts/InteriorPageLayout.jsx\`: compartilhado pelas páginas internas.
- \`src/components/MenuMobile.jsx\` e \`src/components/PortfolioDesktopHeader.jsx\`: utilizados em mais de uma composição/rota.
- \`src/components/PortfolioNavigation.jsx\`, componentes de menu, preloader, scroll, cursor, controles de som e reset global.
- \`src/components/OptimizedImage.jsx\` e \`src/components/GlobeIcon.jsx\`: compartilhados por composições de páginas diferentes.
- \`src/components/MagneticExternalLink.jsx\` e \`src/components/MagneticExternalLinkHover.jsx\`: reutilizados em mais de uma página.
- \`src/data/navigation.js\`, \`src/data/tecnologias.js\` e \`src/data/seoRoutes.json\`.
- Hooks globais em \`src/hooks/\`.
- Utilitários globais: \`experienceMode.js\`, \`lenisControl.js\`, \`uiSfx.js\` e \`uiSfxEvents.js\`.
- \`src/generated/imageMetadata.json\`: continua global, pois o componente compartilhado \`OptimizedImage\` consome metadados de diferentes imagens.
- \`public/_optimized/**\`: manter os arquivos e URLs públicos gerados. Não alterar nomes nem caminhos de saída apenas por mover os originais.
- \`docs/\`, \`src/docs/\`, scripts de manutenção e arquivos globais de configuração.

O Footer é compartilhado: mover \`src/layout/Footer.jsx\` para \`src/layouts/Footer.jsx\`, não para uma pasta de página.

Arquivos legados/candidatos a auditoria — por exemplo \`Card.2-teste.jsx\`, \`EditorialCard.jsx\`, \`MagicCard.jsx\`, \`NavbarDesktop.jsx\`, \`card.jsx\`, \`cards.jsx\`, \`jubtAvats.jsx\` e estilos sem uso aparente — não devem ser movidos ou apagados no mesmo lote sem busca global e justificativa.

## 6. Imports e dependências que precisam ser atualizados

Após movimentar arquivos, revisar todos os imports relativos dentro dos arquivos movidos, além de quem os importa. Não confiar apenas em substituições de texto.

Pontos de atenção já identificados:

1. \`src/components/DeferredLayoutSection.jsx\` mantém \`React.lazy()\` para Competência, Diferenciais, Formação e Footer. Atualizar para os novos caminhos das páginas e \`src/layouts/Footer.jsx\`, mantendo lazy loading.
2. \`src/components/DeferredProjects.jsx\` será movido para Home e seu import lazy de \`ProjetosTeste2\` deverá apontar para o novo local.
3. \`src/pages/home/Home.jsx\` deverá importar as composições Home de seus diretórios novos, sem perder as props de transição, prontidão e modo de experiência.
4. \`src/pages/sobre/Sobre.jsx\` deverá apontar para \`./layouts/SobreHero\`.
5. \`src/pages/projetos/Projetos.jsx\` deverá apontar para o catálogo em \`./layouts/ProjetoCatalogo\`.
6. \`src/pages/contato/Contato.jsx\` deverá importar botão e utilitários da pasta local da página.
7. Atualizar CSS imports dentro de cada arquivo movido; arquivos CSS importados de componentes também mudam de caminho.
8. Atualizar testes do Contato para importar o componente e utilitários dos novos caminhos.
9. Atualizar qualquer importação encontrada por busca global, inclusive scripts, workflows, configurações e documentação.

Revisar explicitamente os caminhos de \`import()\` dinâmico e \`lazy(() => import(...))\`; um build simples não substitui a verificação do carregamento real dos chunks.

## 7. Scripts e GitHub Actions

### Script de otimização de imagens

Se os assets originais forem movidos para \`src/pages/home/assets/projetos/\`, atualizar em \`scripts/optimize-project-images.mjs\`:

- \`inputRoot\`, para o novo diretório de originais;
- \`mobileHeroPath\`, para o novo local de \`HeroMobile.jsx\`.

Manter inalterados \`optimizedRoot = public/_optimized\` e \`metadataPath = src/generated/imageMetadata.json\`, a menos que uma necessidade comprovada exija outra decisão.

### Filtros de caminhos e branches dos workflows

Revisar todos os 17 workflows existentes. Os seguintes têm referências específicas a caminhos de origem que podem mudar e exigem revisão:

- \`optimize-project-images.yml\`: assets da Home, SobreHero e Hero desktop/mobile.
- \`test-code-splitting.yml\`: DeferredProjects, ProjetoDesktop, carrossel, seções de Sobre, Footer, dados e layouts lazy.
- \`logo-loop-performance.yml\`: LogoLoop, CSS, SeclogsMobile e dados mobile.
- \`menu-mobile-overlay.yml\`: Socials e HeroMobile.
- \`minha-trajetoria-scroll.yml\`: MinhaTrajetoria, Formação e Hero.
- \`mobile-ui-sfx-slider.yml\`: Socials e carrossel de projetos.
- \`socials-panel-performance.yml\`: Socials e Heroes.
- \`menu-desktop-reduced.yml\`: revisar os caminhos se algum arquivo monitorado for movido.
- \`accessibility-seo.yml\`: já monitora \`src/**\`; verificar se os demais filtros continuam corretos.

Os workflows de análise de bundle, runtime coverage, scroll e Lighthouse que usam \`src/**\` já cobrem os novos caminhos, mas ainda devem ser inspecionados para eventuais referências pontuais e filtros de branch.

Nem todos os workflows estão atualmente configurados para disparar em \`feat/separacao-paginas\`. Durante o planejamento de validação, decidir explicitamente quais devem ganhar essa branch no gatilho \`push.branches\` e quais serão executados por \`workflow_dispatch\`. Não ampliar todos os gatilhos indiscriminadamente. \`unit-tests.yml\` já executa em push para qualquer branch.

Depois de atualizar workflows, verificar o YAML e conferir no GitHub Actions quais execuções realmente foram disparadas.

## 8. Documentação a atualizar após a implementação

- \`README.md\`: rever arquitetura, responsabilidades, árvore de diretórios e caminhos dos módulos. Não deixar a documentação descrevendo \`src/layout/\` como local genérico de páginas.
- \`docs/AI_CONTEXT.md\`: atualizar os caminhos no texto narrativo e registrar a arquitetura concluída. Preservar os marcadores/seção gerada automaticamente; o workflow \`ai-context.yml\` e \`scripts/update-ai-context.mjs\` sincronizam o snapshot.
- Este arquivo: atualizar o estado de PLANEJADO para EM ANDAMENTO/CONCLUÍDO e marcar as etapas somente depois de implementadas e validadas.
- Outros documentos: buscar referências aos caminhos antigos e editar somente quando estiverem desatualizados. Não reescrever documentos sem relação com a estrutura.

### Resultado da Etapa 1 — Home (07/11/2026)

**Estado: CONCLUÍDA.** A organização da Home foi aplicada na branch feat/separacao-paginas; build, testes unitários, lint, code splitting e workflows específicos foram validados.

**Arquivos movidos para src/pages/home/:**

- **layouts (10):** HeroSectionTransition.jsx, HeroTeste2.jsx, HeroDesktop.jsx, HeroMobile.jsx, Logo2.jsx, SeclogsDesktop.jsx, SeclogsMobile.jsx, ProjetosTeste2.jsx, ProjetoDesktop.jsx e ProjetoCarouselMobile.jsx.
- **components (6):** DeferredProjects.jsx, DotField.jsx, Socials.jsx, FlowingMenu.jsx, logoLoop.jsx e ProjetoCard.jsx.
- **data (2):** seclogsDesktop.data.jsx e seclogsMobile.data.jsx.
- **styles (3):** LogoLoop.css, looptextHero.css e heroParallax.css.
- **assets (6 imagens):** os seis originais passaram de src/assets/projetos/ para src/pages/home/assets/projetos/.

Total: 21 arquivos de código/dados/estilos e 6 assets originais realocados. src/pages/home/Home.jsx permaneceu como entrada e teve imports apontados para os novos diretórios. Os caminhos públicos em public/_optimized/ e os metadados em src/generated/imageMetadata.json foram preservados.

**Dependências e automação atualizadas:**

- Imports relativos e imports dinâmicos/lazy da composição Home, inclusive ProjetoDesktop e ProjetoCarouselMobile.
- scripts/optimize-project-images.mjs: novo inputRoot em src/pages/home/assets/projetos e novo caminho de HeroMobile.jsx.
- Filtros de caminhos/branch em optimize-project-images.yml, logo-loop-performance.yml, menu-mobile-overlay.yml, minha-trajetoria-scroll.yml, mobile-ui-sfx-slider.yml, socials-panel-performance.yml, test-code-splitting.yml e menu-desktop-reduced.yml.
- Seis workflows específicos também passaram a observar src/pages/home/layouts/ProjetosTeste2.jsx, dependência do bundle da Home, para reexecutarem quando esse módulo mudar.
- Os testes E2E de code splitting, menu mobile e trajetória foram alinhados às rotas separadas e aos seletores corretos. A lógica funcional dos componentes da Home não foi reescrita.

**Commits de implementação/correção da Etapa 1:**

- 076329d — reorganização inicial de arquivos e assets da Home.
- 15d27a1 — correção de imports lazy da composição dos projetos.
- fb864cc e 9b108db — teste de code splitting alinhado à rota /sobre e medição de chunks isolada por página.
- 6a535bd — filtros de workflows alinhados à composição atual da Home.
- 9c621f4 — teste do menu mobile alinhado ao reset de scroll entre rotas.
- d1b363c e d1be7a6 — teste de trajetória apontado para /sobre e seletor desktop sem ambiguidade.
- O HEAD atual inclui sincronizações automáticas de AI_CONTEXT.md; conferir o HEAD novamente antes de qualquer nova gravação.

**Validações aprovadas:**

| Verificação | Execução | Resultado |
|---|---|---|
| Unit Tests (testes, ESLint e build) | #230 — [run 42416373732](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42416373732) | Aprovada |
| Deferred Section and Project Code Splitting | #42 — [run 42415782514](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42415782514) | Aprovada |
| Menu Mobile Overlay and Scroll Lock | #46 — [run 42416150108](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42416150108) | Aprovada |
| Menu Desktop Reduced Visibility | #51 — [run 42415950580](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42415950580) | Aprovada |
| Minha Trajetória Scroll Progress (Full/Reduced) | #49 — [run 42416373637](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42416373637) | Aprovada |
| Socials Panel First Open Performance | #42 — [run 42415950463](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42415950463) | Aprovada |
| Mobile UI Sound Interactions | #20 — [run 42415950448](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42415950448) | Aprovada |
| LogoLoop Visibility Performance | #20 — [run 42415950426](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42415950426) | Aprovada |
| Optimize project images | #36 — execução disparada pela reorganização | Aprovada |
| AI Context — Synchronize | #229 — [run 42416373679](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42416373679) | Aprovada |

**Falha de baseline fora do escopo:** Accessibility and SEO Audit #205 ([run 42415418318](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42415418318)) compilou o projeto e passou Lighthouse mobile/desktop, SEO estático, semântica e interações. O Axe reprovou grupos de contraste no formulário de Contato: texto #656565 sobre #0D0D0D, razão aproximada 3,33:1. Essa falha já existia antes da refatoração da Home, é independente dos arquivos movidos e permanece registrada como pendência separada; não foi corrigida nesta etapa.

**Decisões preservadas:**

- DeferredLayoutSection.jsx continua global porque atende Home, Sobre e páginas internas.
- A Home mantém o preview com seis projetos (ProjetosTeste2); ele não foi misturado com o catálogo da rota /projetos.
- OptimizedImage, MenuMobile, PortfolioDesktopHeader, hooks/utils globais, dados compartilhados e imageMetadata.json continuam globais.
- src/styles/DotField.css não foi movido: não havia import direto confirmado no componente e não foi justificada alteração.
- Nenhum componente legado foi removido apenas por parecer não utilizado.


## 9. Sequência recomendada de execução

Cada etapa deve terminar com uma revisão dos arquivos alterados e verificação de referências antes de avançar. Preferir commits pequenos e temáticos na mesma branch, com mensagens Conventional Commits.

### Etapa 0 — Preflight

- Confirmar branch atual e HEAD.
- Ler o AI_CONTEXT e este plano.
- Comparar a árvore atual com o commit-base e listar mudanças posteriores.
- Fazer busca global de imports, lazy imports, CSS imports, referências em scripts, workflows, testes e docs.
- Confirmar se \`src/assets/projetos\` é exclusivo da Home.
- Não iniciar movimentações se houver mudanças concorrentes não compreendidas.

### Etapa 1 — Home

**CONCLUÍDA em 07/11/2026.** Arquivos, imports, assets, script de otimização e filtros de workflows reorganizados. Resultado e evidências de CI registrados em “Resultado da Etapa 1 — Home”.

### Etapa 2 — Sobre

Mover os layouts, componentes, dados e CSS exclusivos. Atualizar \`Sobre.jsx\`, os imports internos e os imports lazy em \`DeferredLayoutSection.jsx\`. Validar o carregamento das seções de Competências, Diferenciais e Formação.

### Etapa 3 — Projetos

Mover \`ProjetoCatalogo.jsx\` e \`projetosCatalogo.js\` para a página Projetos. Atualizar imports e o workflow de code splitting. Confirmar que o preview da Home continua separado e funcional.

### Etapa 4 — Contato

Mover botão, utilitários e os três testes. Atualizar imports relativos. Confirmar que o Vitest descobre todos os testes e que a lógica Basin/Zod permanece inalterada.

### Etapa 5 — Layout compartilhado

Mover Footer para \`src/layouts/Footer.jsx\`. Atualizar a configuração lazy em \`DeferredLayoutSection.jsx\` e conferir Home e páginas internas. Não duplicar Footer.

### Etapa 6 — Consolidação e documentação

- Atualizar todos os caminhos restantes em scripts, workflows e testes E2E.
- Atualizar README e narrativa do AI_CONTEXT.
- Revisar se \`src/layout/\` ficou vazio ou contém algum arquivo legitimamente compartilhado/legado.
- Remover diretórios vazios apenas quando não houver arquivos restantes; não apagar arquivos legados sem auditoria.
- Executar busca final por caminhos antigos.

### Etapa 7 — Validação e relatório

Executar os comandos locais disponíveis no projeto:

- \`npm test\`
- \`npm run lint\`
- \`npm run build\`

Depois validar os workflows aplicáveis e, quando disponíveis, os cenários de navegador:

- Acesso direto e navegação SPA para \`/\`, \`/projetos\`, \`/sobre\` e \`/contato\`.
- Atualização/reload em rota interna com a rolagem restaurada.
- Carregamento dos módulos lazy, incluindo as seções de Sobre e o preview da Home.
- Modo Full e Reduced, menu desktop/mobile e efeitos de scroll.
- Carregamento de imagens otimizadas e integridade de \`imageMetadata.json\`.
- Catálogo de Projetos, filtros e paginação.
- Renderização, validação e estados do formulário Contato sem realizar envio real não autorizado.

## 10. Baseline conhecido de validações

Na inspeção de 07/11/2026, os resultados recentes disponíveis incluíam:

- Unit Tests, run \`#220\`: concluído com sucesso; o run estava associado ao commit de código \`17b76cf77f200221501052948b62c8732b2a8d9c\`, pai do HEAD de documentação analisado.
- AI Context — Synchronize, run \`#219\`: concluído com sucesso.
- Accessibility and SEO Audit, run \`#203\`: falhou por contraste de texto. A análise anterior identificou texto \`#656565\` sobre \`#0D0D0D\`, com razão aproximada de 3,33:1, abaixo do alvo de 4,5:1 para texto normal.

Essa falha de acessibilidade é **baseline preexistente** e não deve ser atribuída à reorganização sem evidência. Registrar separadamente se ela continuar presente. Não misturar correção de contraste ou outra melhoria funcional nesta refatoração sem manter a mudança isolada e documentada.

Resultados de CI são específicos de commit e data. Antes de concluir, consultar as execuções mais recentes, não reutilizar os estados acima como se fossem validação da nova estrutura.

## 11. Checklist de acompanhamento

Marcar somente após a conclusão real de cada etapa:

- [x] Etapa 0 — Preflight e revalidação da árvore atual (07/11/2026; HEAD `c8f8efd`).
- [x] Etapa 1 — Home reorganizada e imports/automação validados (07/11/2026; Unit Tests #230, Code Splitting #42 e workflows específicos aprovados).
- [ ] Etapa 2 — Sobre reorganizado e seções lazy validadas.
- [ ] Etapa 3 — Catálogo de Projetos reorganizado e preview da Home preservado.
- [ ] Etapa 4 — Contato reorganizado e testes encontrados.
- [ ] Etapa 5 — Footer compartilhado movido e sem duplicação.
- [ ] Etapa 6 — Scripts, workflows, README e AI_CONTEXT atualizados.
- [ ] Etapa 7 — Testes, lint, build, Actions e smoke tests revisados.
- [ ] Relatório final entregue ao usuário; nenhum PR/merge feito sem autorização.

**Última etapa concluída:** Etapa 1 — Home (Etapa 0 também concluída).  
**Etapa em andamento:** nenhuma; Etapa 2 — Sobre ainda não iniciada.  
**Próxima atividade ao retomar:** executar o Preflight da Etapa 2, confirmar HEAD/árvore atual e iniciar a movimentação de Sobre conforme o mapeamento da seção 4.2. Não refazer a Home.

## 12. Instruções para continuidade em uma nova conversa

O próximo assistente deve:

1. Abrir o repositório \`kleber-goncalves/portfolio-kg\` na branch \`feat/separacao-paginas\`.
2. Ler \`docs/AI_CONTEXT.md\` e este documento completo antes de editar.
3. Verificar o HEAD atual; o commit-base registrado é apenas o ponto da análise de 07/11/2026, não uma autorização para resetar a branch.
4. Conferir se houve commits ou alterações posteriores e atualizar o plano mentalmente/documentalmente conforme a árvore real.
5. Retomar pela primeira caixa ainda desmarcada no checklist. As Etapas 0 e 1 estão concluídas; a próxima é a Etapa 2 — Sobre.
6. Executar uma etapa por vez, mantendo este documento atualizado com o que foi movido, o commit correspondente, as validações executadas e os problemas encontrados.
7. Informar claramente o que foi concluído, o que falhou e qual é a próxima etapa. Não repetir perguntas já respondidas neste documento.
8. Não abrir PR, não fazer merge e não alterar \`main\` ou \`dev\` sem solicitação expressa do usuário.

**Mensagem de retomada sugerida:**  
“Retome a reorganização da arquitetura por página no repositório \`kleber-goncalves/portfolio-kg\`, branch \`feat/separacao-paginas\`. Leia integralmente \`docs/AI_CONTEXT.md\` e \`docs/PLANO-REORGANIZACAO-ARQUITETURA-POR-PAGINA.md\`, confira o HEAD e as mudanças posteriores ao commit-base e continue pela primeira etapa não concluída do checklist. Não refaça a análise do zero, não altere \`main\`/\`dev\` e não abra PR ou faça merge sem autorização.”
