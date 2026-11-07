# Plano de reorganização da arquitetura por página

> **Tipo:** plano operacional de refatoração e documento de continuidade entre conversas/assistentes.  
> **Estado atual:** EM ANDAMENTO — Etapas 0 (Preflight) a 6 (Consolidação e documentação) concluídas. Próxima etapa: Etapa 7 (Validação final e relatório). Pendências técnicas registradas separadamente: contraste do formulário /contato e erro ScrollTrigger.refresh() no console de /projetos.
> **Commit de implementação da Etapa 5 (07/11/2026):** `955108a5939e76b957be88fff1d97d27c6f0c1bc` (`refactor(layout): mover Footer compartilhado para layouts`). Unit Tests #243 e Code Splitting #45 passaram.
> **Última análise estrutural:** 07/11/2026.  
> **Repositório:** \`kleber-goncalves/portfolio-kg\`.  
> **Branch exclusiva de trabalho:** \`feat/separacao-paginas\`.  
> **Commit-base analisado:** \`a76466a2d14c7e26e0ad699f2cfc5131c906e0ae\`.
> **HEAD validado após a conclusão da Etapa 1 (07/11/2026):** dfe832b958b5306ba1d2dc70b054e2840ddcc278.
> **HEAD validado após a conclusão da Etapa 2 (07/11/2026):** 780af1acb653f7714622a6683cba6dc2cc3d0b1d.
> **HEAD validado no Preflight da Etapa 3 (07/11/2026):** f650ff2865ca7a64c9c9b6f2e19296ee2212c8be.
> **HEAD após a movimentação da Etapa 3 (07/11/2026):** 5f04d7cf0ceacfe497f0f2db0fe10d5de51ff303.
> **HEAD verificado antes desta atualização documental (07/11/2026):** 8bae313c6fb958e912e730d24feeffb936628a15.
> **HEAD verificado antes do fechamento da Etapa 3 (07/11/2026):** 36b903194e81f6fd49d5dd1bb9d77d39fd0bc3da.
> **Commit de implementação da Etapa 4 (07/11/2026):** `19d6dc58ec5fe45c1462d2666ed778b400f28086` (`refactor(contato): organizar módulos por página`).
> **HEAD registrado imediatamente após o commit de código da Etapa 4 e antes das atualizações documentais:** `5b2b5bc0d0c141dd0cea9dd78d925173217a5d4b`. Sempre confirme o HEAD atual antes de uma nova alteração.

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


> **Nota de leitura:** os caminhos listados no mapeamento inicial das seções 4 e 6 registram a localização de origem observada antes da reorganização. Eles são mantidos como histórico/auditoria das movimentações. Para caminhos atuais, imports e árvore final, use os resultados das etapas concluídas e o `docs/AI_CONTEXT.md`.
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

O Footer compartilhado agora fica em `src/layouts/Footer.jsx`, fora das pastas de páginas. Há uma única implementação, carregada por `DeferredLayoutSection` via `React.lazy()` na Home e nas páginas internas.

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
- \`test-code-splitting.yml\`: DeferredProjects, ProjetoDesktop, carrossel, seções de Sobre, Footer, dados e layouts lazy; o filtro monitora `src/layouts/Footer.jsx` após a movimentação.
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


### Resultado da Etapa 2 — Sobre (07/11/2026)

**Estado: CONCLUÍDA.** Os módulos exclusivos da página Sobre foram organizados em sua pasta, com imports lazy preservados e automações atualizadas.

**Arquivos movidos para src/pages/sobre/:**

- **layouts (4):** SobreHero.jsx, Competencia.jsx, DiferenciaisTeste.jsx e Formacao.jsx.
- **components (3):** Card1-teste.jsx, card2.jsx e MinhaTrajetoria.jsx.
- **data (1):** eventosTrajetoria.js.
- **styles (4):** sobreHeroPortrait.css, formationCard.css, editorialCard.css e editorialCard2.css.

Total: 12 arquivos movidos. Sobre.jsx permaneceu como entrada da página e passou a importar layouts/SobreHero.jsx. Os imports dos layouts para componentes, dados e estilos locais continuaram relativos às pastas irmãs.

**Imports e carregamento diferido:**

- SobreHero passou a importar GlobeIcon e OptimizedImage dos diretórios globais, usando o CSS local styles/sobreHeroPortrait.css.
- DeferredLayoutSection.jsx permaneceu global e teve os três imports React.lazy atualizados para src/pages/sobre/layouts/Competencia.jsx, DiferenciaisTeste.jsx e Formacao.jsx.
- Competências, Diferenciais e Formação continuam carregados sob demanda; não foram convertidos em imports estáticos.
- Footer permanece compartilhado e será tratado na Etapa 5.

**Workflows atualizados:**

- minha-trajetoria-scroll.yml: paths para MinhaTrajetoria e Formacao atualizados; referência de HeroSectionTransition alinhada ao novo caminho da Home.
- test-code-splitting.yml: paths dos três layouts atualizados e monitoramento adicionado para a entrada Sobre, SobreHero, componentes, dados e CSS da página.
- optimize-project-images.yml: caminho de SobreHero atualizado para src/pages/sobre/layouts/SobreHero.jsx.

**Commits da Etapa 2:**

- 3db81bb — movimentação dos 12 módulos, atualização dos imports lazy e filtros dos workflows.
- acbc906 — estabilização do teste Menu Desktop: a restauração de scroll aguarda a altura real do documento em vez de depender de atraso fixo de 300 ms.
- O HEAD atual inclui sincronização automática do AI_CONTEXT; conferir o HEAD antes da próxima gravação.

**Validações aprovadas:**

| Verificação | Execução | Resultado |
|---|---|---|
| Unit Tests (testes, ESLint e build) | #232 — [run 42417166919](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42417166919) e #233 — [run 42417419520](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42417419520) | Aprovadas |
| Deferred Section and Project Code Splitting | #43 — [run 42417166986](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42417166986) | Aprovada |
| Minha Trajetória Scroll Progress (Full/Reduced) | #50 — [run 42417166924](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42417166924) | Aprovada |
| Optimize project images | #37 — [run 42417167018](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42417167018) | Aprovada |
| Menu Desktop Reduced Visibility | #53 — [run 42417419497](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42417419497) | Aprovada |
| AI Context — Synchronize | #232 — [run 42417419594](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42417419594) | Aprovada |

**Acessibilidade e SEO:** Accessibility and SEO Audit #206 ([run 42417167022](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42417167022)) passou Lighthouse mobile/desktop e não encontrou erros estáticos de SEO, semântica ou interação. O Axe registrou zero grupos de violação em /sobre — desktop, mobile e estados de menu incluídos. A auditoria global ainda falhou por contraste no formulário /contato: texto #656565 sobre #0D0D0D, razão 3,33:1. A pendência é restrita ao Contato, já existia no baseline e não foi alterada nesta etapa.

**Observação fora do escopo:** o teste Menu Desktop voltou a registrar mensagens de console de ScrollTrigger.refresh() no catálogo /projetos (TypeError ao ler restart), comportamento já identificado na análise anterior. Os cenários de visibilidade e restauração do scroll passaram no run #53. Reavaliar a origem na Etapa 3, sem misturar o problema à movimentação de Sobre.

**Decisões preservadas:**

- DeferredLayoutSection.jsx permanece global porque atende mais de uma página.
- CompetenciaItem.jsx não foi movido: não foi confirmado como dependência direta das seções atuais. Não excluir sem auditoria global.
- Footer.jsx permanece em sua localização atual até a etapa de layouts compartilhados.
- Nenhuma lógica visual ou funcional de Sobre foi reescrita; somente organização e caminhos foram alterados.


### Resultado do Preflight da Etapa 3 — Projetos (07/11/2026)

**Registro histórico: Preflight CONCLUÍDO no commit f650ff2.** Naquele momento, a árvore foi conferida na branch feat/separacao-paginas e a movimentação ainda não havia começado. A execução posterior está registrada em “Resultado parcial da implementação da Etapa 3 — Projetos”.

**Arquivos e destino planejado:**

- src/pages/projetos/Projetos.jsx permanece como entrada da rota.
- src/components/ProjetoCatalogo.jsx será movido para src/pages/projetos/layouts/ProjetoCatalogo.jsx.
- src/data/projetosCatalogo.js será movido para src/pages/projetos/data/projetosCatalogo.js.
- Não há necessidade identificada de criar components/ para Projetos nesta etapa, pois o catálogo não contém componentes filhos exportados como módulos separados.

**Imports a atualizar após a movimentação:**

- Projetos.jsx: importar o catálogo pelo caminho local ./layouts/ProjetoCatalogo.
- ProjetoCatalogo.jsx: o import de projetosCatalogo.js passa a usar ../data/projetosCatalogo (subpastas layouts/ e data/ são irmãs).
- ProjetoCatalogo.jsx: os módulos globais precisam continuar globais, com caminhos relativos ajustados a partir de pages/projetos/layouts/: uiSfx.js em ../../../utils/uiSfx; tecnologias.js em ../../../data/tecnologias; MagneticExternalLinkHover.jsx em ../../../components/MagneticExternalLinkHover; lenisControl.js em ../../../utils/lenisControl; useResponsive.js em ../../../hooks/useResponsive.

**Dependências compartilhadas confirmadas:**

- src/data/tecnologias.js é usado pela composição de projetos da Home e pelo catálogo completo; permanecer em src/data/.
- src/components/MagneticExternalLinkHover.jsx é usado pelo preview da Home e pelo catálogo; permanecer em src/components/.
- src/hooks/useResponsive.js e src/utils/uiSfx.js / lenisControl.js continuam globais.
- projetosCatalogo.js contém os dados do catálogo completo e é específico da rota /projetos; não misturar com os dados de seis projetos do preview da Home em pages/home/layouts/ProjetosTeste2.jsx.

**Workflows identificados para atualizar:**

- .github/workflows/test-code-splitting.yml: adicionar monitoramento para src/pages/projetos/Projetos.jsx, src/pages/projetos/layouts/ProjetoCatalogo.jsx e src/pages/projetos/data/projetosCatalogo.js. O workflow já monitora tecnologias.js compartilhado.
- .github/workflows/menu-desktop-reduced.yml: adicionar monitoramento para src/pages/projetos/layouts/ProjetoCatalogo.jsx, pois o teste visita /projetos e cobre o menu/scroll na rota.
- .github/workflows/accessibility-seo.yml e workflows genéricos que observam src/** já cobrem os novos caminhos; não ampliar filtros genéricos sem necessidade.
- A inspeção dirigida não encontrou necessidade de alterar scripts de otimização de imagem: o catálogo não contém assets originais próprios nem interfere nos caminhos de public/_optimized/.

**Risco conhecido a acompanhar nesta etapa:**

- Menu Desktop Reduced #53 passou nos cenários de navegação/reload, mas o log ainda registrou o erro conhecido em /projetos: ScrollTrigger.refresh() lança TypeError ao ler restart durante mudança do catálogo. Esse erro é anterior à movimentação de ProjetoCatalogo e não deve ser atribuído automaticamente ao novo caminho. Ao validar a etapa, conferir o log novamente e decidir separadamente se o defeito exige correção funcional ou apenas registro.
- A auditoria global de acessibilidade ainda tem o baseline de contraste no formulário /contato (#656565 sobre #0D0D0D, 3,33:1); não misturar essa correção com a movimentação de Projetos.

**Limites confirmados durante aquele Preflight:** main e dev permaneceram intocadas; não havia PR aberto; nenhum arquivo de Projetos foi movido naquele momento.


### Resultado da Etapa 3 — Projetos (07/11/2026)

**Estado: CONCLUÍDA em 07/11/2026.** A implementação estrutural foi registrada no commit `5f04d7c` (`refactor(projetos): organizar catálogo por página`). O build, testes, ESLint, Code Splitting, Menu Desktop e Lighthouse foram validados. O Axe encontrou falha apenas no formulário `/contato`, sem violações nas rotas `/projetos` e `/sobre`; isso permanece como baseline separado. O HEAD após sincronizações documentais foi conferido antes desta atualização.

**Arquivos reorganizados:**

- `src/components/ProjetoCatalogo.jsx` foi movido para `src/pages/projetos/layouts/ProjetoCatalogo.jsx`.
- `src/data/projetosCatalogo.js` foi movido para `src/pages/projetos/data/projetosCatalogo.js`.
- `src/pages/projetos/Projetos.jsx` permanece como entrada e agora importa `./layouts/ProjetoCatalogo`.
- O catálogo importa seus dados por `../data/projetosCatalogo` e ajusta os caminhos relativos dos módulos globais.

**Dependências compartilhadas preservadas:**

- `src/data/tecnologias.js` continua global, pois é usado pela Home e pelo catálogo completo.
- `src/components/MagneticExternalLinkHover.jsx` continua global, pois é compartilhado entre o preview da Home e a rota `/projetos`.
- `src/hooks/useResponsive.js`, `src/utils/uiSfx.js` e `src/utils/lenisControl.js` continuam globais.
- O preview de seis projetos da Home (`src/pages/home/layouts/ProjetosTeste2.jsx`) permanece separado do catálogo completo de Projetos.

**Workflows atualizados no commit `5f04d7c`:**

- `test-code-splitting.yml` monitora a entrada Projetos, o novo layout do catálogo e o novo arquivo de dados.
- `menu-desktop-reduced.yml` monitora os novos caminhos do catálogo e dos dados.
- Não foi necessário alterar o otimizador de imagens: a movimentação não incluiu assets originais.

**Validação registrada até o momento:**

| Verificação | Execução | Estado observado |
|---|---|---|
| Unit Tests (testes, ESLint e build) | #236 — [run 42418184125](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42418184125) e #237 — [run 42418379608](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42418379608) | Aprovadas |
| AI Context — Synchronize | #235 — [run 42418184146](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42418184146) | Aprovada |
| Deferred Section and Project Code Splitting | #44 — [run 42418184096](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42418184096) | Aprovada em mobile/desktop |
| Menu Desktop Reduced Visibility | #54 — [run 42418184102](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42418184102) | Aprovada nos cenários do menu/reload; o log ainda registra erro de ScrollTrigger em /projetos |
| Accessibility and SEO Audit | #207 — [run 42418184158](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42418184158) | Lighthouse mobile/desktop aprovados; Axe sem violações em `/projetos` e `/sobre`; falha global restrita a contraste em `/contato` |

**Problema conhecido confirmado novamente:** Menu Desktop #54 passou nos cenários de navegação/reload, porém seu log ainda registra, durante reload direto de `/projetos`, a mensagem “Não foi possível atualizar os ScrollTriggers após mudar a página de projetos” seguida de `TypeError: Cannot read properties of undefined (reading 'restart')` em `ScrollTrigger.refresh()`. O teste passou apesar do erro de console. O comportamento já havia sido identificado antes da movimentação; tratá-lo como pendência técnica independente e não atribuí-lo automaticamente ao novo caminho.

**Etapa concluída:** o Preflight e a implementação da Etapa 4 — Contato foram concluídos. A falha Axe conhecida do formulário permanece fora do escopo da movimentação estrutural; qualquer correção visual deve ser tratada em mudança isolada. O erro ScrollTrigger em `/projetos` também permanece como item técnico separado. A próxima atividade é o Preflight da Etapa 5 — Footer compartilhado.


### Resultado da Etapa 4 — Contato (07/11/2026)

**Estado: CONCLUÍDA.** A movimentação estrutural foi aplicada na branch `feat/separacao-paginas`, no commit `19d6dc58ec5fe45c1462d2666ed778b400f28086` (`refactor(contato): organizar módulos por página`). A execução automatizada AI Context — Synchronize #239 atualizou o snapshot, sem alteração de `main` ou `dev`.

**Arquivos movidos:**

- `src/components/MagneticSubmitButton.jsx` → `src/pages/contato/components/MagneticSubmitButton.jsx`.
- `src/utils/contactSchema.js` → `src/pages/contato/utils/contactSchema.js`.
- `src/utils/contactSubmission.js` → `src/pages/contato/utils/contactSubmission.js`.
- Os testes `Contato.test.jsx`, `contactSchema.test.js` e `contactSubmission.test.js` passaram de `src/utils/test/` para `src/pages/contato/__tests__/`.

**Imports atualizados:** `Contato.jsx` passou a consumir os módulos locais; o teste de integração passou a referenciar `InteriorPageLayout` global e `Contato.jsx` pelos caminhos relativos novos; os dois testes unitários passaram a importar os utilitários locais.

**Documentação:** os dois documentos técnicos em `src/docs/` e `docs/BASIN_FORM_SETUP.md` tiveram seus caminhos e comandos de teste alinhados à estrutura nova. `docs/AI_CONTEXT.md` e este plano registram a arquitetura atual e a próxima etapa. O README foi inspecionado e não continha referências aos arquivos movidos, portanto não exigiu alteração.

**Validação:** Unit Tests #240 (run `42420299177`) aprovou 66 testes em 6 arquivos, ESLint (0 erros; 5 avisos existentes) e build. Menu Desktop Reduced #55 (run `42420299130`) passou pelos cenários Full/Reduced e reload direto/reload nas quatro rotas; o log continua reportando o erro preexistente de `ScrollTrigger.refresh()` em `/projetos`. A auditoria Accessibility and SEO integra a validação global da Etapa 7. A execução iniciada no commit de código foi cancelada por um push documental posterior; conferir a execução mais recente antes de declarar a Etapa 7 concluída. A pendência de contraste conhecida em `/contato` permanece separada da movimentação de arquivos.

**Comportamento preservado:** nenhuma regra Zod, validação HTML, chave de campo Basin, integração HTTP, texto/mensagem, estado de submit ou animação do botão foi reescrita. `MagneticExternalLink.jsx` e `InteriorPageLayout.jsx` permanecem globais. Nenhum envio real ao Basin foi realizado.

---
### Resultado do Preflight da Etapa 5 — Footer compartilhado (07/11/2026)

**Preflight CONCLUÍDO.** HEAD confirmado em `0b05d60e9093f73527adb61a2a34bcb5e03b970e` antes da movimentação. A varredura de 146 arquivos textuais em `src/`, `scripts/`, `.github/workflows/`, `docs/` e README encontrou o uso de execução do Footer centralizado em `DeferredLayoutSection.jsx`; Home e páginas internas consomem a configuração `section="footer"`. O script E2E `scripts/test-code-splitting.mjs` já verificava o chunk `Footer-` e o carregamento adiado na rota Sobre. O workflow específico que monitorava o arquivo tinha apenas o caminho antigo em seu filtro.

**Decisão:** mover somente `src/layout/Footer.jsx` para `src/layouts/Footer.jsx`. Os imports relativos internos (`../styles/loopText.css`, `../components/MagneticExternalLink` e `../utils/lenisControl`) permanecem corretos porque os dois diretórios são irmãos no mesmo nível de `src/`. Não alterar a lógica de data/hora, links, GSAP/ScrollTrigger, animações, dimensões ou conteúdo do rodapé.

### Resultado da Etapa 5 — Footer compartilhado (07/11/2026)

**Estado: CONCLUÍDA.** Implementação no commit `955108a5939e76b957be88fff1d97d27c6f0c1bc` (`refactor(layout): mover Footer compartilhado para layouts`).

**Alterações aplicadas:**

- `src/layout/Footer.jsx` foi movido integralmente para `src/layouts/Footer.jsx`; não foi criada uma segunda implementação. O diretório antigo `src/layout/` ficou sem arquivos rastreados.
- `src/components/DeferredLayoutSection.jsx`: o `React.lazy()` da configuração `footer` agora importa `../layouts/Footer`, mantendo o carregamento adiado.
- `.github/workflows/test-code-splitting.yml`: o filtro de caminhos passou a observar `src/layouts/Footer.jsx`.
- `scripts/test-code-splitting.mjs`: além de confirmar que o chunk `Footer-` não entra no carregamento inicial, o teste agora rola até o footer da Home, confirma que o chunk é carregado, verifica uma única tag `<footer>` na Home e na rota Sobre, e preserva a checagem do carregamento tardio na rota Sobre.
- `README.md` e `src/docs/efeito-magnetico-motion.md`: caminhos e responsabilidades atualizados.

**Validações aprovadas:**

| Verificação | Execução | Resultado |
|---|---|---|
| Unit Tests (Vitest, ESLint e build) | #243 — [run 42422769203](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42422769203) | Aprovada; 66 testes, 0 erros ESLint e build concluído |
| Deferred Section and Project Code Splitting | #45 — [run 42422769208](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42422769208) | Aprovada em mobile (390px) e desktop (1365px); Footer inicial ausente e carregamento tardio verificado na Home/Sobre |
| AI Context — Synchronize | #242 — [run 42422769230](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42422769230) | Aprovada |

**Decisões preservadas:** `InteriorPageLayout.jsx` continua global e não renderiza outro Footer diretamente; a seção `section="footer"` é a única forma de inserir o componente compartilhado em Home e páginas internas. A auditoria Accessibility/SEO #210 continua como validação global separada; não foram feitas mudanças visuais nem correções na pendência conhecida de contraste do formulário `/contato`.

---
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

**CONCLUÍDA em 07/11/2026.** Os 12 arquivos exclusivos foram movidos, os imports lazy preservados e os workflows afetados atualizados. Resultado e evidências em “Resultado da Etapa 2 — Sobre”.

### Etapa 3 — Projetos

**CONCLUÍDA em 07/11/2026.** O catálogo da rota `/projetos` e seus dados foram realocados, imports atualizados e workflows específicos ajustados. A validação de build, testes, lint, Code Splitting, Menu Desktop e Lighthouse está registrada em “Resultado da Etapa 3 — Projetos”; a falha Axe global restringiu-se ao contraste do formulário `/contato`.

### Etapa 4 — Contato

**CONCLUÍDA em 07/11/2026.** O botão, os dois utilitários e os três testes foram movidos para `src/pages/contato/`; imports da página e dos testes atualizados. A descoberta dos testes foi confirmada pelo Vitest: 66 testes totais passaram (15 schema, 7 submissão HTTP e 9 integração de Contato). A lógica Basin/Zod permaneceu inalterada.

### Etapa 5 — Layout compartilhado

**CONCLUÍDA em 07/11/2026.** Footer movido para `src/layouts/Footer.jsx`, import lazy atualizado em `DeferredLayoutSection.jsx`, filtro de Code Splitting corrigido e teste E2E ampliado para verificar carregamento tardio na Home e Sobre, com uma única instância em cada rota.

### Etapa 6 — Consolidação e documentação

- Atualizar todos os caminhos restantes em scripts, workflows e testes E2E.
- Atualizar README e narrativa do AI_CONTEXT.
- Confirmar que `src/layout/` foi removido da árvore Git após a movimentação do Footer e que os módulos compartilhados estão em `src/layouts/`.
- `src/layout/` não existe mais na árvore Git após a movimentação do Footer; diretórios vazios não são versionados pelo Git. Preservar arquivos legados que ainda tenham referências.
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
- [x] Etapa 2 — Sobre reorganizado e seções lazy validadas (07/11/2026; Unit Tests #233, Code Splitting #43, Trajetória #50 e Menu Desktop #53 aprovados).
- [x] Etapa 3 — Catálogo de Projetos reorganizado e preview da Home preservado (07/11/2026; Unit Tests #236/#237, Code Splitting #44 e Menu Desktop #54 aprovados; Axe #207 sem violações em /projetos e /sobre).
- [x] Etapa 4 — Contato reorganizado e testes encontrados (07/11/2026; Unit Tests #240 e Menu Desktop #55 aprovados; 66 testes unitários, lint sem erros e build aprovados).
- [x] Etapa 5 — Footer compartilhado movido e sem duplicação (07/11/2026; Unit Tests #243 e Code Splitting #45 aprovados; chunk adiado e instância única verificados em mobile/desktop).
- [x] Etapa 6 — Scripts, workflows, README e AI_CONTEXT consolidados (07/11/2026; busca final em 158 arquivos textuais, caminhos obsoletos do README corrigidos e `src/layout/` ausente da árvore).
- [ ] Etapa 7 — Testes, lint, build, Actions e smoke tests revisados.
- [ ] Relatório final entregue ao usuário; nenhum PR/merge feito sem autorização.

**Última etapa concluída:** Etapa 6 — Consolidação e documentação (Etapas 0 a 5 também concluídas).  
**Etapa em andamento:** nenhuma; Etapa 7 — Validação final e relatório é a próxima.  
**Próxima atividade ao retomar:** consultar as execuções mais recentes de GitHub Actions, confirmar `npm test`, `npm run lint` e `npm run build`, revisar a auditoria Accessibility/SEO e realizar smoke tests de `/`, `/projetos`, `/sobre` e `/contato` quando o navegador estiver disponível.

## 12. Instruções para continuidade em uma nova conversa

O próximo assistente deve:

1. Abrir o repositório \`kleber-goncalves/portfolio-kg\` na branch \`feat/separacao-paginas\`.
2. Ler \`docs/AI_CONTEXT.md\` e este documento completo antes de editar.
3. Verificar o HEAD atual; o commit-base registrado é apenas o ponto da análise de 07/11/2026, não uma autorização para resetar a branch.
4. Conferir se houve commits ou alterações posteriores e atualizar o plano mentalmente/documentalmente conforme a árvore real.
5. Retomar pela primeira etapa ainda não concluída. Etapas 0 a 6 estão concluídas; a próxima ação é executar a Etapa 7 — validação final e relatório.
6. Executar uma etapa por vez, mantendo este documento atualizado com o que foi movido, o commit correspondente, as validações executadas e os problemas encontrados.
7. Informar claramente o que foi concluído, o que falhou e qual é a próxima etapa. Não repetir perguntas já respondidas neste documento.
8. Não abrir PR, não fazer merge e não alterar \`main\` ou \`dev\` sem solicitação expressa do usuário.

**Mensagem de retomada sugerida:**  
“Retome a reorganização da arquitetura por página no repositório kleber-goncalves/portfolio-kg, branch feat/separacao-paginas. Leia integralmente docs/AI_CONTEXT.md e docs/PLANO-REORGANIZACAO-ARQUITETURA-POR-PAGINA.md, confira o HEAD atual e execute a Etapa 7 — Validação final e relatório. Etapas 0 a 6 estão concluídas. Não refaça as etapas anteriores, não altere main/dev e não abra PR ou faça merge sem autorização.”
