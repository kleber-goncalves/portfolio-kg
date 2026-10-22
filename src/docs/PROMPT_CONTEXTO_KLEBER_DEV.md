# PROMPT DE CONTEXTO — KLEBER DEV / PORTFOLIO-KG

> **Instrução para o novo chat:** leia este documento inteiro e use-o como contexto inicial de trabalho. Continue o projeto a partir do estado real do GitHub, sem presumir que hashes, branches, workflows ou arquivos permaneçam iguais. Este documento registra o estado confirmado em **19 de outubro de 2026**. Antes de editar código, confira novamente o repositório e os resultados mais recentes do GitHub Actions.

---

## 1. Seu papel e a maneira de trabalhar

Você está dando continuidade ao projeto **KLEBER DEV**, um portfólio pessoal autoral de desenvolvimento web. O usuário é o dono do projeto e espera que você o ajude a investigar, implementar e validar alterações reais, com prioridade para código correto, experiência visual consistente, responsividade, acessibilidade e desempenho.

O usuário prefere respostas em português do Brasil, diretas, práticas e explicadas de forma amigável para quem está aprendendo. Ele acompanha código e entende melhor quando lê exemplos existentes do que quando precisa escrever tudo do zero. Ao trabalhar tecnicamente, explique o que foi mudado, por que foi necessário e quais validações realmente passaram. Não use palavras como “concluído”, “validado” ou “passou” sem uma evidência concreta.

**Comece as respostas com “Ok Sr.Kleber,”**, respeitando a preferência registrada. Não gaste a conversa repetindo este prompt; assuma o contexto e avance na tarefa pedida.

### Regras inegociáveis

1. **Trabalhe somente na branch `dev` por padrão.** O histórico mostra que as últimas alterações deste trabalho foram feitas em `dev`. Não altere `main` em hipótese alguma sem um pedido explícito do usuário. Não faça deploy, merge, cherry-pick, rebase ou sincronização entre branches sem entender o efeito e obter autorização quando a mudança ultrapassar a tarefa pedida.
2. **Não escreva na branch `feat/responsividadeFull` sem pedido explícito.** Ela deve ser considerada uma branch histórica de responsividade; no estado confirmado em 19/10/2026, estava 43 commits atrás de `dev` e sem commits exclusivos em relação ao histórico de `dev`.
3. Antes de mudar qualquer arquivo, consulte sua versão atual no GitHub, o contexto do componente, os utilitários relacionados e os testes/workflows que o cobrem. Não edite baseado apenas em snippets antigos, memória ou neste prompt.
4. Faça a menor alteração coerente possível. Evite refatorações amplas, reescritas de arquivos grandes, trocas de arquitetura ou mudanças de estilo não solicitadas.
5. Preserve React com **JavaScript e JSX**. Não introduza TypeScript (`.ts`/`.tsx`) nem migre o projeto para outra stack.
6. Preserve as convenções de design existentes. Não transforme o site num template genérico, dashboard SaaS, interface futurista, glassmorphism ou experiência com neon/gradientes gratuitos. Não introduza emojis na UI como substituto de ícones.
7. Não remova animações, cues sonoros, acessibilidade, analytics, SEO, carregamento adiado ou otimizações só para simplificar código. Investigue primeiro por que existem e quais testes dependem deles.
8. Não adicione dependências sem necessidade demonstrada. Use as bibliotecas já instaladas e os padrões existentes.
9. Não permita sons automáticos no carregamento. Não desbloqueie/inicialize áudio fora de uma interação confiável do usuário. Não deixe listeners duplicados ou múltiplos sons disparando para um único gesto.
10. Não suponha que uma execução cancelada do Actions significa falha de código. Confira se houve novo push e se os workflows mais recentes para o SHA atual terminaram com sucesso.
11. Nunca force-push, nunca mova uma ref para um SHA antigo e nunca sobrescreva mudanças de outra pessoa. Se o SHA da branch mudar durante a implementação, releia a ref e o arquivo antes de tentar outra escrita.
12. Não diga que testou localmente se apenas consultou o GitHub Actions. Diferencie build, testes automatizados, inspeção de diff e verificação visual real em navegador.

---

## 2. Identidade, propósito e direção visual do projeto

### Objetivo

**KLEBER DEV** é o portfólio pessoal do usuário. Seu propósito é apresentar projetos, tecnologias, competências, diferenciais, formação e trajetória profissional a recrutadores, equipes técnicas, clientes e outros desenvolvedores. O site também é um laboratório técnico: serve para demonstrar decisões de arquitetura e design, efeitos visuais, responsividade, performance, acessibilidade, SEO e validação automatizada.

A proposta não é simplesmente listar tecnologias. A interface deve mostrar como a experiência foi construída, por que escolhas técnicas foram feitas e como o usuário organiza e apresenta seu trabalho.

### Conteúdo e estrutura

É uma aplicação de página única com seções ligadas por navegação/âncoras. Entre os componentes e áreas importantes estão:

- **Hero desktop/mobile:** identidade de abertura, texto, elementos visuais e transição para a página.
- **Tecnologias e ferramentas:** representação visual do ecossistema técnico.
- **Competências:** áreas e habilidades técnicas.
- **Projetos:** apresentação visual dos projetos com descrições, tecnologias, imagens e links.
- **Diferenciais:** apresentação da forma de trabalhar e dos pontos fortes.
- **Formação / nível técnico e Minha Trajetória:** formação e evolução do usuário.
- **Menu desktop e menu mobile:** navegação, transições e opções Full/Reduced.
- **Socials:** botão/painel de redes sociais; no mobile, seu acionamento e arraste são parte dos testes de interação.
- **Rodapé e contato:** retorno ao início e acesso a perfis externos.
- **Controles de som (`uiSfx`):** integração sonora de interações, com preferências persistentes e controle de volume.

### Stack confirmada no `package.json` de `dev`

- React 19 + React DOM.
- JavaScript / JSX, com Vite 8.
- Tailwind CSS 4.
- GSAP, `@gsap/react` e ScrollTrigger para animações e interações vinculadas ao scroll.
- Lenis para integração de rolagem suave.
- Motion (`motion/react`) para algumas animações de componentes/estados.
- Swiper para o carrossel de projetos no mobile.
- Lucide React para ícones.
- `uisfx` (`^0.4.0`) usando o pacote sonoro **Zen**.
- Playwright nos testes automatizados de navegador do GitHub Actions.
- Lighthouse CI e Axe para auditorias de performance, SEO e acessibilidade.
- Sharp nos scripts/workflow de geração de imagens WebP responsivas.
- Deploy e previews na Vercel.

Scripts principais do `package.json`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

As rotinas de CI usam Node.js 24. O usuário trabalha em Windows 11 num Lenovo IdeaPad 3, então prefira validar código com workflows já existentes, evitar instruções locais desnecessariamente pesadas e explicar comandos passo a passo quando forem úteis.

### Direção visual

A estética é **editorial, escura, minimalista e técnica**, com identidade própria. O ritmo visual vem de tipografia marcante, linhas, números, espaçamento, recortes e movimento. Evite aparência de template pronto ou componentes genéricos sem relação com a linguagem do portfólio.

Paleta predominante:

| Token       | Hex       | Uso aproximado          |
| ----------- | --------- | ----------------------- |
| Obsidian    | `#0D0D0D` | Fundo principal         |
| Carbon      | `#151515` | Superfícies secundárias |
| Graphite    | `#242424` | Bordas e divisórias     |
| Ivory       | `#F2F0EC` | Texto principal         |
| Steel       | `#8B8B8B` | Texto secundário        |
| Bronze      | `#A87852` | Destaques               |
| Warm Bronze | `#C49A78` | Hover e realces         |
| Champagne   | `#D8C2AA` | Acentos mais claros     |

Famílias tipográficas documentadas no projeto: DM Mono, Space Grotesk e Bebas Neue. Confira os tokens CSS atuais antes de mudar fontes ou cores.

### Responsividade e modos de experiência

A responsividade não consiste apenas em diminuir a versão desktop. Há composições/componentes específicos para desktop e mobile, com foco em interação touch e uso de espaço. `src/hooks/useResponsive.js` centraliza características responsivas do viewport, orientação e entrada/interação.

Existem dois modos principais de experiência:

- **Full:** experiência visual mais completa, com os efeitos e interações disponíveis.
- **Reduced:** reduz efeitos contínuos ou interações de maior custo, mas não significa remover toda animação ou retirar a personalidade visual.

A preferência é persistida e também deve considerar `prefers-reduced-motion`. Não modifique o modo Reduced sem executar as validações de menu, scroll, animações e trajetória nos dois modos.

---

## 3. Repositório, branches e estado confirmado

Repositório: [kleber-goncalves/portfolio-kg](https://github.com/kleber-goncalves/portfolio-kg)

Portfólio público indicado no README: [https://kleber-goncalves-dev.vercel.app/](https://kleber-goncalves-dev.vercel.app/)

Preview usado pelo workflow para `dev`: `https://portfolio-kg-git-dev-kleber-goncalves-s-projects.vercel.app/`

Preview configurado para `feat/responsividadeFull`: `https://portfolio-kg-git-feat-respon-0847d0-kleber-goncalves-s-projects.vercel.app/`

### `dev` — branch de trabalho

Em 19/10/2026, o head confirmado era:

- **SHA:** `28b30550fde834a73ee39cafe4570a0f0e2292bf`
- [Commit](https://github.com/kleber-goncalves/portfolio-kg/commit/28b30550fde834a73ee39cafe4570a0f0e2292bf)
- Mensagem: `Merge branch 'dev' of https://github.com/kleber-goncalves/portfolio-kg into dev`

O merge preservou o commit de `SoundControls` descrito abaixo. Seu outro pai incluiu `af0a2b686993ecac5f89c0bb5bb67c3fc301fef7`, com a mensagem `fix(config): update server port to 3000 for consistency`.

### `main` — não tocar

Em 19/10/2026:

- **SHA:** `6abb4d1b81e2ed70329d3102fe47ae709b320a97`
- [Branch main](https://github.com/kleber-goncalves/portfolio-kg/tree/main)

A comparação `main...dev` estava **divergente**: `dev` tinha 35 commits exclusivos e estava 2 commits atrás de `main`; merge base `f89bbdf8a69795d67ec331de68552c43dbf24e7d`. Isso não autoriza sincronizar as branches automaticamente. A regra prática continua: **todas as alterações solicitadas neste fluxo ficam em `dev`; `main` permanece intocada.** Antes de cada tarefa nova, confirme se houve atualização remota.

### `feat/responsividadeFull` — branch de referência/histórico de responsividade

Em 19/10/2026:

- **SHA:** `9401de3c57de98e6642eb6a938e7187c07ace289`
- [Commit da branch](https://github.com/kleber-goncalves/portfolio-kg/commit/9401de3c57de98e6642eb6a938e7187c07ace289)
- Mensagem: `ci(actions): support main, dev and feature branch`
- A comparação contra `dev` mostrava `feat/responsividadeFull` como ancestral/atrasada em 43 commits, com **0 commits exclusivos** na comparação feita naquele momento.

Essa branch foi usada para organizar a experiência responsiva/full e contém uma alteração histórica de workflows para reconhecer `main`, `dev` e a branch de feature. Não a trate como branch de trabalho atual nem copie seus arquivos por cima de `dev`: ela está defasada em relação às alterações recentes de sons, testes e performance. Atualize os dados consultando o GitHub se essa branch virar parte explícita da tarefa.

### Rotina segura ao editar pelo GitHub

Use a integração/conector do GitHub disponível ao ChatGPT para ler arquivos, comparar commits/branches, gravar alterações e conferir Actions. No trabalho recente, foram usados comandos do conector através de `functions.exec`, especialmente:

- `mcp__GitHub__fetch_file` para ler o arquivo de uma branch específica.
- `mcp__GitHub__search_branches` / listagem de branches para localizar refs.
- `mcp__GitHub__fetch` para consultar endpoints públicos do GitHub, incluindo commits, comparações e Actions.
- `mcp__GitHub__update_file` para alterações simples de um arquivo na branch `dev`.
- Para alterações atômicas de múltiplos arquivos, use a sequência cuidadosa de blobs/árvore/commit/update-ref, com SHA esperado, se as funções disponíveis permitirem.
- `mcp__GitHub__fetch_commit` e `mcp__GitHub__get_commit_combined_status` para inspecionar commit/status.

**Antes de escrever:** buscar a branch `dev` atual, buscar o arquivo na ref `dev`, conferir o SHA do conteúdo, inspecionar diff e paths. **Depois de escrever:** confirmar o novo commit, ref `dev`, arquivo resultante e os runs dos workflows com o SHA correto. Nunca use um SHA memorizado para mover uma branch sem verificar o head mais recente e usar uma atualização protegida por SHA esperado.

---

## 4. Foco principal desta sequência: `uiSfx` e os efeitos sonoros

O foco recente é manter os efeitos sonoros de interface consistentes, acessíveis, compatíveis com desktop e touch e seguros diante das restrições de autoplay dos navegadores. A ideia é adicionar feedback sonoro a interações intencionais sem deixar o som intrusivo, sem reproduzir áudio sozinho e sem carregar desnecessariamente código de áudio na entrada inicial.

### Arquivos centrais

- `src/utils/uiSfx.js` — motor/integrador central de som, preferências, volume, desbloqueio do áudio e listeners de hover/interação.
- `src/utils/uiSfxEvents.js` — pequena ponte por evento customizado para permitir que componentes solicitem um cue sem importar diretamente o motor completo.
- `src/components/SoundControls.jsx` — controles de desktop: ativar/desativar e abrir o ajuste de volume.
- `src/components/SoundToggle.jsx` — botão reutilizado para ativar/desativar som, incluindo contexto do menu mobile.
- `src/components/SoundVolumeSliderMobile.jsx` — slider de volume usado no menu mobile; tem atenção especial a `MotionValue` para atualizar o preenchimento sem provocar renders React a cada frame/valor.
- `src/components/MenuMobile.jsx` — abertura do menu e carregamento sob demanda do slider mobile.
- `src/components/Socials.jsx` — painel social, abertura/fechamento e botão arrastável.
- `src/components/ProjetoCarouselMobile.jsx` — carrossel de projetos e som ao arrastar/deslizar.
- Testes: `scripts/test-mobile-socials-ui-sfx.mjs`, `scripts/test-mobile-ui-sfx-slider.mjs` e `scripts/test-ui-sfx-refresh.mjs`.

### Como `uiSfx` funciona

O projeto usa `uisfx` (`^0.4.0`) e o pack `zen`.

Em `src/utils/uiSfx.js` estão o singleton do player e a lógica de preferências, volume e unlock. Alguns comportamentos importantes do código atual:

- A preferência de ativação é guardada em `localStorage` (`kleber-dev:ui-sounds-enabled`). Se não houver preferência salva, o padrão é ativado; se o storage falhar, a interface continua funcionando com o padrão sem bloquear o site.
- Preferência de volume é persistida por `kleber-dev:ui-sounds-volume`; a versão/migração usa `kleber-dev:ui-sounds-volume-v2-migrated`.
- Chave de preferências internas do player: `kleber-dev:ui-sfx`.
- Volume de referência padrão atual: **200%**; máximo da interface: **800%**. Isso não significa volume físico linear garantido: o utilitário aplica uma amplificação ao volume padrão de cada cue e limita o ganho efetivo por cue a `1`.
- Valores de volume inválidos são ignorados; valores usados são arredondados e limitados entre 0 e 800.
- Há lógica de migração de versões anteriores que tinham escala de até 100%, para dobrar o valor salvo ao migrar para a escala nova, respeitando o máximo.
- O ganho principal do player fica em `1`; a amplificação por cue é calculada usando `createRecipe("zen", cue).defaultVolume`, multiplicada pela configuração atual e limitada a `1`.
- A preferência de ativação e a de volume emitem eventos customizados e podem ser sincronizadas via `storage` entre contextos/abas.
- Ao desligar os sons, o motor é parado, o unlock pendente é invalidado e o player é desabilitado.
- Ao ligar, `toggleUiSounds()` tenta desbloquear o `AudioContext`; se o unlock não tiver sucesso, mantém o som desativado em vez de prometer um som que não funcionará.
- Há controle por geração/token da Promise de desbloqueio para evitar que uma tentativa velha interfira em uma tentativa nova.
- Hover é delegado: há um seletor de elementos interativos, são considerados elementos que têm estado visual de hover/foco declarado, e o cue `hover` é disparado apenas para mouse/caneta (`pointerType` mouse/pen), não para toques.
- O handler central do evento `kleber-dev:ui-sfx-request` recebe cues solicitados pelos componentes. É preciso garantir que essa ponte/listener seja anexada uma única vez, não uma vez por render ou por cada componente.

Em `src/utils/uiSfxEvents.js`, `requestUiSound(cue)` verifica se existe `window` e se o cue é string, então emite `CustomEvent("kleber-dev:ui-sfx-request", { detail: { cue } })`. Esse desacoplamento foi adotado deliberadamente para que componentes não puxem o módulo de áudio inteiro e não aumentem os chunks compartilhados sem necessidade.

### Regras críticas do áudio no mobile

Os navegadores podem bloquear o Web Audio se o contexto for criado/desbloqueado cedo demais. O código atual foi ajustado após um caso em que o Chrome em emulação mobile não iniciava o áudio se o `AudioContext` fosse construído no `pointerdown` de touch.

Preserve estas regras:

1. Não iniciar áudio ao carregar ou recarregar a página.
2. Não criar/desbloquear contexto de áudio simplesmente ao abrir o menu, se os sons estiverem desligados.
3. No mobile touch, não assumir que `pointerdown` é o gesto de ativação aceito pelo navegador. A implementação atual procura desbloquear após gesto confiável (por exemplo, em `pointerup` com fallback em `click`/teclado conforme a lógica central).
4. Um cue solicitado enquanto o unlock está pendente pode aguardar a Promise e tocar apenas se o contexto estiver realmente em estado de execução e os sons ainda estiverem ativados.
5. Desligar o som invalida unlocks pendentes, para que um áudio antigo não comece depois de desligado.
6. A primeira interação confiável depois de um reload deve conseguir tocar o som sem exigir que o usuário desligue e ligue novamente o controle.
7. O volume deve continuar salvando/recuperando mesmo quando os efeitos estão desligados, sem iniciar fontes de áudio.
8. Não disparar hover sonoro em touch.
9. Não espalhar imports diretos e listeners de `uiSfx` por dezenas de componentes quando a ponte central já atende ao caso.
10. Evitar cues repetidos demais durante drag. Use limites medidos por deslocamento/tempo, mantendo feedback perceptível sem disparar um som por pixel.

### Cues e comportamento de interação

O projeto usa cues Zen como:

- `hover` — hover visual em controles compatíveis.
- `expand` / `collapse` — abrir e fechar menus/painéis.
- `open` / `close` — abrir e fechar popover/controle de volume.
- `forward` / `back` — feedback de navegação usado em certos fluxos.
- `toggle-on` — confirmação ao ativar som.
- `volume-change` — preview sonoro ao ajustar volume.
- `drag-start` — sinal aplicado ao início/movimento de determinados arrastes.

Essa lista é representativa dos usos recentes; confirme todos os usos no código antes de mudar nomes ou assumir que cada cue está associado a um único componente.

### Histórico recente de mudanças em `uiSfx`

A sequência recente, em ordem aproximada, explica por que a implementação está assim:

- Integração da biblioteca `uisfx` com o pack Zen e efeitos de hover na interface.
- Refinos na detecção de classes de hover e classes `group-hover` dinâmicas.
- Cues `expand`/`collapse` em painéis e ajuste dos links magnéticos.
- Ajustes na preferência/volume padrão e persistência.
- Separação dos pedidos de cue via `src/utils/uiSfxEvents.js`, evitando que cada componente importe o player completo.
- Correção para registrar a ponte/listener de cues apenas uma vez.
- Correção do unlock no mobile para começar áudio após uma interação reconhecida pelo navegador.
- Estabilização do teste que simula swipe touch e registra estado do AudioContext.
- Carregamento preguiçoso do slider de volume mobile quando o menu abre.
- Som durante o arraste do botão do Socials, mantendo os cues que já existiam ao abrir/fechar o painel.
- Agrupamento visual dos dois botões do `SoundControls` desktop numa única peça visual.

Commits recentes relevantes:

| SHA curto | Mensagem                                                            |
| --------- | ------------------------------------------------------------------- |
| `b9abc77` | `perf(ui-sfx): decouple component cues from shared chunks`          |
| `c83ec81` | `fix(ui-sfx): register component cue bridge once`                   |
| `4a29c8c` | `fix(ui-sfx): unlock audio after mobile touch activation`           |
| `5691c91` | `test(ui-sfx): stabilize touch swipe diagnostics`                   |
| `324d73a` | `perf(mobile): lazy-load sound volume slider on menu open`          |
| `1a6b1de` | `feat(socials): play sound while dragging social button`            |
| `7d75135` | `style(sound-controls): unify desktop sound buttons`                |
| `af0a2b6` | `fix(config): update server port to 3000 for consistency`           |
| `28b3055` | merge de `dev` para `dev`, com as alterações anteriores preservadas |

### Alteração mais recente do desktop `SoundControls` — já feita

Pedido do usuário: no desktop, fazer o botão do volume e o de ligar/desligar som parecerem **um mesmo componente**, porque antes tinham bordas, espaço e fundos separados.

Arquivo: `src/components/SoundControls.jsx`

Commit da alteração: [7d7513558d273e99f85e523b4c5f7785fa1bbabd](https://github.com/kleber-goncalves/portfolio-kg/commit/7d7513558d273e99f85e523b4c5f7785fa1bbabd)

Estado presente em `dev` no SHA atual `28b30550fde834a73ee39cafe4570a0f0e2292bf`:

- O wrapper externo agora tem a única borda/fundo do grupo: `inline-flex`, `rounded-sm`, `border border-graphite/90`, `bg-obsidian/75`, com hover na borda bronze.
- Os dois botões internos não têm bordas ou fundos próprios permanentes.
- Foi removido o `gap-1.5` entre eles; estão lado a lado como controle segmentado.
- O hover dos botões usa fundo suave (`hover:bg-graphite/35`) e texto ivory, mantendo foco visível e estados disabled.
- A lógica de habilitar/desabilitar sons, abrir/fechar volume, salvar volume, labels acessíveis, `aria-pressed`, `aria-expanded`, `aria-controls`, animação do chevron e o painel com `Slider05` foi preservada.
- A versão do arquivo na branch de trabalho atual foi conferida depois da alteração e contém esse agrupamento.

Não recrie a alteração do zero nem reverta a borda compartilhada. Se o usuário reportar algo visualmente incorreto, confira o arquivo e a versão renderizada antes de alterar; o pedido original era união visual, não mudança de função.

### Alteração do botão arrastável do Socials — já feita

Arquivo: `src/components/Socials.jsx`

Commit: [1a6b1decdecca2f48670860d734161c02a7f1026](https://github.com/kleber-goncalves/portfolio-kg/commit/1a6b1decdecca2f48670860d734161c02a7f1026)

O botão do Socials emite `drag-start` durante o movimento, sem tocar um cue para cada pixel. O cálculo usa limite de deslocamento de 24 px e intervalo mínimo de 180 ms entre disparos. A abertura do painel continua com `expand` e o fechamento com `collapse`.

O teste `scripts/test-mobile-socials-ui-sfx.mjs` simula movimento em múltiplos frames e confirma que os sons começaram **antes do pointer/touch release**, além de conferir abertura/fechamento e swipe do carrossel. A execução bem-sucedida do workflow de Mobile UI Sound Interactions no commit `1a6b1de` reportou os cenários: sem autoplay, expand, collapse, som durante o drag do Socials e drag-start no carrossel; `sourceStarts: 6`, `audioContexts: 1`, resultado `passed`.

### Carregamento tardio do slider mobile — já feito

Commit: [324d73a43b9666f5964b6057cf8dd028814cdc7a](https://github.com/kleber-goncalves/portfolio-kg/commit/324d73a43b9666f5964b6057cf8dd028814cdc7a)

`SoundVolumeSliderMobile` foi transformado em import lazy em `MenuMobile.jsx`, sendo carregado com `Suspense` ao abrir o menu em que é usado. Isso reduz o JavaScript inicial sem prejudicar o fluxo do slider. Em medições de CI daquele estágio, o JS inicial foi de aproximadamente 342,8 KiB para 299,8 KiB, e a mediana de Lighthouse Performance passou de 84 para 87. Trate esses números como referência histórica daquele teste, não como medição atual garantida; consulte artifacts de Actions se precisar dos valores atuais.

---

## 5. GitHub Actions: validações obrigatórias e interpretação

O projeto depende de GitHub Actions para validar alterações com build, Playwright, Lighthouse, análise de bundle, checagens de desempenho e auditorias. As workflows podem usar triggers por branch, por caminho alterado e `workflow_dispatch`. Alguns são cancelados por `concurrency` quando um commit mais recente inicia outro run.

### Como validar toda alteração

1. Identifique os arquivos alterados e os workflows cujo filtro `paths` cobre esses arquivos. Leia o próprio YAML antes de decidir que um teste foi disparado.
2. Após o commit, confirme o head de `dev` e copie o SHA exato. Não use somente o run mais novo do repositório: ele pode pertencer a outra branch ou outro commit.
3. Na aba Actions, procure runs cujo `head_sha` corresponda ao SHA da mudança/ao head atual da branch. Confirme status final (`completed`) e conclusão (`success`).
4. Diferencie falhas, cancelamentos e ausência de execução. Se um run foi cancelado porque o próximo commit iniciou o mesmo workflow, verifique o run correspondente ao commit atual.
5. Examine logs, não apenas o círculo verde, nos testes relacionados a uma mudança sonora, um painel ou um bug específico.
6. Se o usuário pedir explicitamente para validar visualmente, o teste automatizado não substitui inspeção de navegador/screenshot. Diga com clareza quando ainda não houve verificação visual manual.
7. Depois de uma alteração de UI/SFX, no mínimo confira `npm run build` via workflow relevante e os testes comportamentais apropriados. Evite lançar um build local pesado no notebook do usuário sem necessidade, pois Actions já oferece ambiente limpo.

### Workflows existentes em `dev`

Os nomes abaixo foram observados em `.github/workflows/` em 19/10/2026. Confirme os YAMLs antes de supor os gatilhos exatos:

| Workflow / arquivo                                                          | Principal objetivo                                                                                                                                                 |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Analyze JavaScript Bundle` — `analyze-js-performance.yml`                  | Produz treemap/relatório de tamanho dos chunks JavaScript.                                                                                                         |
| `Analyze Unused JavaScript` — `analyze-js-runtime-coverage.yml`             | Analisa JavaScript não utilizado/runtime coverage; verificar seu script e artifact ao analisar peso/execução de JS.                                                |
| `Accessibility and SEO Audit` — `accessibility-seo.yml`                     | Build, Lighthouse mobile/desktop, Axe/Playwright na página e em estados interativos.                                                                               |
| `Desktop Scroll Interaction Performance` — `desktop-scroll-performance.yml` | Mede comportamento de scroll, intervalos entre frames e long tasks.                                                                                                |
| `Lighthouse Experience Mode Comparison` — `lighthouse-experience-modes.yml` | Executa medidas isoladas do modo Full e Reduced (três execuções cada no YAML observado), compara medianas.                                                         |
| `Lighthouse Performance` — `lighthouse-performance.yml`                     | Build e auditoria Lighthouse na preview Vercel da branch atual.                                                                                                    |
| `LogoLoop Visibility Performance` — `logo-loop-performance.yml`             | Pausa/retoma loop de logos e valida viewport/tab visibility/reduced motion.                                                                                        |
| `Menu Desktop Reduced Visibility` — `menu-desktop-reduced.yml`              | Verifica visibilidade/interação do hambúrguer desktop no modo Reduced após switch/refresh.                                                                         |
| `Menu Mobile Overlay And Scroll Lock` — `menu-mobile-overlay.yml`           | Verifica sobreposição do menu mobile e bloqueio de scroll.                                                                                                         |
| `Minha Trajetoria Scroll Progress` — `minha-trajetoria-scroll.yml`          | Confirma que a linha/progresso acompanha scroll nos modos Full e Reduced.                                                                                          |
| `Mobile UI Sound Interactions` — `mobile-ui-sfx-slider.yml`                 | Testa slider mobile, som durante arrastes no Socials, carrossel, persistência e unlock mobile.                                                                     |
| `Optimize project images` — `optimize-project-images.yml`                   | Usa Sharp para gerar variantes WebP/metadata e pode commitar arquivos gerados na branch do evento. Tome cuidado com esse workflow que possui permissão de escrita. |
| `Socials Panel First Open Performance` — `socials-panel-performance.yml`    | Mede primeira abertura, aberturas seguintes e recursos do painel Socials.                                                                                          |
| `Deferred Section and Project Code Splitting` — `test-code-splitting.yml`   | Valida carregamento adiado das seções e módulos diferentes para desktop/mobile.                                                                                    |
| `UI Sound Preference and Refresh` — `ui-sfx-refresh.yml`                    | Verifica unlock, preferência on/off, persistência após refresh e volume.                                                                                           |

Os testes Playwright geralmente fazem checkout, configuram Node 24, executam `npm ci`, instalam Playwright temporário sem gravá-lo no lockfile, instalam Chromium, validam o build de produção e iniciam um preview local antes de executar os scripts.

### Resultado confirmado dos Actions mais recentes

Em 19/10/2026, os runs que tinham o head SHA atual `28b30550fde834a73ee39cafe4570a0f0e2292bf` terminaram com sucesso:

| Workflow                               | Run                                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| Analyze JavaScript Bundle              | [39146311089](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39146311089) |
| Menu Desktop Reduced Visibility        | [39146311154](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39146311154) |
| Menu Mobile Overlay And Scroll Lock    | [39146311169](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39146311169) |
| Minha Trajetoria Scroll Progress       | [39146311166](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39146311166) |
| Desktop Scroll Interaction Performance | [39146311145](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39146311145) |
| Lighthouse Performance                 | [39146311176](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39146311176) |
| Analyze Unused JavaScript              | [39146311138](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39146311138) |
| Accessibility and SEO Audit            | [39146311102](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39146311102) |

Na alteração de estilo de `SoundControls` (SHA `7d7513558d273e99f85e523b4c5f7785fa1bbabd`), o workflow de preferência de som terminou com sucesso: [UI Sound Preference and Refresh — run 39146134442](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39146134442). Também passaram build/bundle, Lighthouse Performance, scroll desktop e comparação Full/Reduced naquele SHA. Dois runs intermediários (Analyze Unused JavaScript e Accessibility/SEO) foram cancelados quando o commit de merge mais novo começou novos runs; os equivalentes correspondentes ao estado `28b3055` terminaram com sucesso.

No commit `1a6b1de`, o workflow Mobile UI Sound Interactions também terminou com sucesso: [run 39071684452](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/39071684452).

**Interpretação correta:** isso confirma os workflows que efetivamente rodaram nesses SHAs, não uma garantia de que todo aspecto visual foi manualmente inspecionado nem de que nenhuma futura regressão seja possível.

---

## 6. Outras otimizações e testes já implementados

### Code splitting e carregamento sob demanda

- `DeferredProjects.jsx` e outras seções carregadas por demanda evitam montar todos os módulos pesados de uma só vez.
- Os projetos desktop/mobile têm importação condicionada ao viewport por meio de módulos e do hook responsivo.
- O Swiper do mobile não deve ser puxado para o chunk inicial desktop desnecessariamente.
- Depois de carregar seções ou modificar geometria do DOM, verificar a necessidade de atualizar o ScrollTrigger, sem iniciar loops de refresh ou causar trabalho excessivo no scroll.
- Há workflow `Deferred Section and Project Code Splitting` com teste Playwright e tamanho do entry chunk.

### Imagens de projetos e Hero

- As imagens dos projetos em `src/assets/projetos/` receberam tratamento com o componente `OptimizedImage` e workflow/script de otimização.
- Existe `scripts/optimize-project-images.mjs`, workflow `.github/workflows/optimize-project-images.yml`, metadata `src/generated/imageMetadata.json` e geração de variantes em `public/_optimized/`.
- O tratamento foi aplicado a imagens de cards/componentes de projetos e recursos do Hero, incluindo `/logo.svg` para desktop, avatar do GitHub para mobile e `/euNv.png` conforme a implementação anterior.
- O workflow de imagens tem permissão de escrita e pode criar commits de recursos gerados; confira a branch alvo e as diferenças antes de permitir ou repetir uma execução.

### Menu mobile, Reduced e Socials

- Existe workflow de menu mobile para overlay/stacking e bloqueio de scroll (`menu-mobile-overlay.yml`).
- Existe workflow para visibilidade do botão hambúrguer desktop no modo Reduced (`menu-desktop-reduced.yml`).
- A experiência tem que ser verificada nos modos Full e Reduced, após refresh e durante navegação.
- A primeira abertura de Socials é medida pelo workflow `socials-panel-performance.yml`.

### Scroll e animações

- `desktop-scroll-performance.yml` acompanha a interação do scroll desktop. Em validações anteriores, a mediana do intervalo de frames ficou em torno de 16,7 ms, sem long tasks detectadas naquele teste. Não generalize esse número para todos os builds/dispositivos.
- `lighthouse-experience-modes.yml` compara medianas de Full e Reduced com múltiplas execuções isoladas.
- `minha-trajetoria-scroll.yml` verifica o progresso da linha da trajetória nos modos Full e Reduced.
- `logo-loop-performance.yml` verifica o loop em viewport, mudança de aba e reduced motion.

### Acessibilidade e SEO

O repositório já tem metas, canônica, descrição, OG/Twitter, sitemap/robots e dados estruturados documentados no README, além de workflow Lighthouse/Axe. Preserve labels acessíveis, nomes de botões, semântica, foco visível, texto alternativo e preferências de movimento. Ao mudar labels ou estrutura de menus/controles, atualize os testes que localizam elementos por role/name.

---

## 7. O que fazer ao continuar agora

### Estado corrente

O último pedido implementado foi reunir visualmente o botão de ativar/desativar efeitos sonoros e o botão de volume do `SoundControls` desktop. A alteração está em `dev` e permanece no head atual `28b3055`. O workflow de preferências de som associado ao commit da alteração passou. O conjunto de Actions do head atual também foi confirmado como verde para os oito workflows listados na seção 5.

Portanto, **não existe uma falha pendente conhecida nessa alteração visual**. O próximo chat deve primeiro perguntar/interpretar qual é o próximo pedido específico do usuário, mas manter a área atual de atenção como `uiSfx`/interações sonoras e controles, caso o usuário esteja continuando essa sequência.

### Checklist sugerido antes de qualquer próxima mudança de som

- [ ] Buscar estado atual de `dev`, `main`, `feat/responsividadeFull` e mudanças recentes.
- [ ] Ler a versão atual dos componentes envolvidos e `src/utils/uiSfx.js` / `uiSfxEvents.js`.
- [ ] Conferir se o cue já é disparado por listener delegado ou ponte `requestUiSound`; evitar registrar segunda vez.
- [ ] Identificar os comportamentos esperados antes de editar (mouse/pen/touch, primeira interação após reload, som on/off, persistência de volume, sem autoplay).
- [ ] Fazer diff pequeno e revisar que não removeu handlers, atributos ARIA, storage, hooks ou animações.
- [ ] Validar `npm run build` dentro do workflow aplicável.
- [ ] Para mudanças em `Socials`, carrossel ou slider mobile, conferir e rodar `Mobile UI Sound Interactions`.
- [ ] Para mudanças no motor/controles desktop/preferências, conferir `UI Sound Preference and Refresh`.
- [ ] Para alteração no peso dos chunks, conferir `Analyze JavaScript Bundle`, `Analyze Unused JavaScript` e/ou `Deferred Section and Project Code Splitting` conforme os arquivos alterados.
- [ ] Para alteração de layout, scroll, menu ou experiência, executar os workflows específicos listados anteriormente.
- [ ] Confirmar os resultados dos workflows no SHA atual e distinguir sucesso, falha e cancelamento.
- [ ] Confirmar que a alteração foi feita somente em `dev` e que `main` continua no mesmo SHA, a menos que exista autorização explícita diferente.

### Pendências futuras a considerar (não tratar como bugs já confirmados)

Estas são linhas de investigação possíveis, não alegações de que a aplicação está quebrada:

1. Se o usuário pedir confirmação visual, revisar o `SoundControls` no preview de desktop para assegurar que a borda externa compartilhada e o hover deixam os botões perceptivelmente como um único grupo, sem prejudicar foco acessível, hit-area ou responsividade.
2. Se for útil e solicitado, considerar teste visual/DOM específico para o agrupamento do desktop. O workflow `UI Sound Preference and Refresh` já cobre comportamento de preferência/volume, mas isso não significa necessariamente que existe uma asserção automatizada para a estética da borda compartilhada.
3. Continuar monitorando a regra de não autoplay e a primeira interação touch após reload, porque o histórico demonstra que navegadores podem se comportar diferentemente em desktop e emulação mobile.
4. Continuar cuidando do custo inicial de JavaScript, módulos adiados, imagens responsivas, animações de scroll e modo Reduced. Não desfazer otimizações que passaram sem evidência de um benefício concreto.

Não invente uma lista obrigatória de tarefas que não está respaldada por um pedido ou por falha observada. Se o usuário trouxer uma nova mudança, siga a intenção concreta e priorize uma implementação pequena com validação direcionada.

---

## 8. Resumo para iniciar o trabalho rapidamente

- **Projeto:** portfólio pessoal KLEBER DEV, React + Vite + JavaScript/JSX + Tailwind CSS 4; design editorial escuro e bronze.
- **Branch de edição:** `dev`, confirmada em `28b30550fde834a73ee39cafe4570a0f0e2292bf` no registro de 19/10/2026. Reconfirme antes de agir.
- **`main`:** `6abb4d1b81e2ed70329d3102fe47ae709b320a97` naquele momento; **não tocar**.
- **`feat/responsividadeFull`:** `9401de3c57de98e6642eb6a938e7187c07ace289`, ancestral antigo/43 commits atrás de `dev` naquele momento; só trabalhar nela se o usuário pedir.
- **Foco técnico recente:** sistema `uiSfx`, cues Zen, persistência e unlock correto do áudio, som no arraste do Socials, carregamento tardio do slider mobile e agrupamento visual único no `SoundControls` desktop.
- **Última alteração visual:** commit `7d75135` em `src/components/SoundControls.jsx`, incorporado no head de `dev` atual `28b3055`.
- **Socials:** commit `1a6b1de`, cue `drag-start` durante movimento, limite de 24 px e intervalo de 180 ms; `expand`/`collapse` preservados.
- **Mobile slider lazy load:** commit `324d73a`.
- **Ações:** em 19/10/2026, oito workflows do SHA `28b3055` passaram; o `UI Sound Preference and Refresh` do commit `7d75135` também passou. Confira o estado vivo, pois o GitHub muda.
- **Ferramenta usada para trabalhar:** conector GitHub do ChatGPT através de `functions.exec` para ler/gravar arquivos, analisar commits/branches e consultar Actions; GitHub Actions roda build, Playwright, Lighthouse, Axe e análises especializadas.
- **Regra principal:** inspecionar estado atual → fazer alteração mínima em `dev` → revisar diff → esperar/conferir workflows no SHA correto → comunicar exatamente o que passou e o que não foi validado.

**Agora continue a conversa com o pedido mais recente do usuário, sem voltar a perguntar informações respondidas neste documento e sem modificar qualquer branch que ele não autorizou.**
