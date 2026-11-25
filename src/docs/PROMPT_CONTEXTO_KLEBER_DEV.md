# PROMPT DE CONTEXTO — KLEBER DEV / PORTFOLIO-KG

> **Instrução para o novo chat:** leia este documento inteiro e use-o como contexto inicial de trabalho. Continue o projeto a partir do estado real do GitHub, sem presumir que hashes, branches, workflows ou arquivos permaneçam iguais. Este documento foi revisado em **07 de novembro de 2026**. Os registros de branch e workflows datados de outubro são históricos; `docs/AI_CONTEXT.md` e o estado vivo do GitHub são as referências técnicas prioritárias. Antes de editar código, confira novamente o repositório e os resultados mais recentes do GitHub Actions.

---

## 1. Seu papel e a maneira de trabalhar

Você está dando continuidade ao projeto **KLEBER DEV**, um portfólio pessoal autoral de desenvolvimento web. O usuário é o dono do projeto e espera que você o ajude a investigar, implementar e validar alterações reais, com prioridade para código correto, experiência visual consistente, responsividade, acessibilidade e desempenho.

O usuário prefere respostas em português do Brasil, diretas, práticas e explicadas de forma amigável para quem está aprendendo. Ele acompanha código e entende melhor quando lê exemplos existentes do que quando precisa escrever tudo do zero. Ao trabalhar tecnicamente, explique o que foi mudado, por que foi necessário e quais validações realmente passaram. Não use palavras como “concluído”, “validado” ou “passou” sem uma evidência concreta.

**Comece as respostas com “Ok Sr.Kleber,”**, respeitando a preferência registrada. Não gaste a conversa repetindo este prompt; assuma o contexto e avance na tarefa pedida.

### Regras inegociáveis

1. **Não presuma uma branch padrão.** Trabalhe somente na branch explicitamente indicada/autorizada pelo usuário para a tarefa atual. Se a branch não estiver clara, confirme o estado atual do GitHub e use o contexto da conversa; não migre automaticamente para `dev` ou `main`.
2. **Preserve `main` e `dev` por padrão.** Não escreva, faça merge, rebase, cherry-pick, deploy ou sincronização nessas branches sem pedido explícito. Branches de feature também não são autorização permanente: confirme a branch vigente em cada nova tarefa. `feat/responsividadeFull` aparece neste documento apenas como referência histórica de responsividade, não como branch de trabalho.
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

## 3. Repositório, branches e estado de referência

Repositório: [kleber-goncalves/portfolio-kg](https://github.com/kleber-goncalves/portfolio-kg)

Portfólio público indicado no README: [https://kleber-goncalves-dev.vercel.app/](https://kleber-goncalves-dev.vercel.app/)

### Regra operacional vigente

- A branch de trabalho deve ser a indicada/autorizada pelo usuário na tarefa atual. Não existe regra geral de usar `dev` por padrão.
- Na sequência documental e na correção recente do MenuDesktop, a branch autorizada e conferida em 07/11/2026 foi `feat/separacao-paginas`. O head consultado durante esta revisão era `82c46f4f9a6c4f7204d64b48bbd0746ac04e5d34`; esse SHA é uma fotografia daquele momento, não uma autorização permanente nem substituto de nova consulta.
- Não altere `main` ou `dev` sem pedido explícito. Não faça merge, deploy, cherry-pick, rebase ou sincronização entre branches por iniciativa própria.
- Antes de qualquer gravação, consulte o head remoto da branch autorizada, leia os arquivos nessa mesma ref e crie o commit usando o SHA esperado. Se o head mudar, releia os arquivos e reconcilie as alterações antes de continuar.
- Depois de gravar, confirme o commit, a ref, os arquivos resultantes e os workflows associados ao SHA correto.

### Registros históricos de 19/10/2026 — não usar como estado atual

Os dados abaixo preservam a origem do trabalho e não devem orientar a escolha de branch em tarefas futuras.

- `dev` tinha o SHA `28b30550fde834a73ee39cafe4570a0f0e2292bf`; o registro descrevia um merge que incorporou a alteração de `SoundControls` e o commit `af0a2b686993ecac5f89c0bb5bb67c3fc301fef7` de configuração da porta 3000.
- `main` tinha o SHA `6abb4d1b81e2ed70329d3102fe47ae709b320a97`. Na comparação da época, `dev` e `main` estavam divergentes; isso não deve ser tratado como comparação atual.
- `feat/responsividadeFull` tinha o SHA `9401de3c57de98e6642eb6a938e7187c07ace289` e aparecia 43 commits atrás de `dev`, sem commits exclusivos naquela comparação.
- Os previews de Vercel registrados anteriormente para `dev` e `feat/responsividadeFull` podem ter mudado; consulte os workflows/aliases antes de usá-los.

### Rotina segura ao editar pelo GitHub

Use a integração/conector do GitHub para ler/gravar arquivos, comparar commits/branches e conferir Actions. Foram utilizados, entre outros:

- `mcp__GitHub__fetch_file` para ler arquivos de uma branch específica.
- `mcp__GitHub__fetch` para consultar commits, árvores, branches e Actions.
- `mcp__GitHub__create_blob`, `mcp__GitHub__create_tree` e `mcp__GitHub__create_commit` para alterações atômicas em múltiplos arquivos.
- `mcp__GitHub__update_ref` com SHA esperado para atualizar a branch sem sobrescrever uma alteração remota concorrente.

**Nunca use hashes memorizados para mover uma branch.** Confirme o head remoto imediatamente antes de gravar e use a atualização protegida com o SHA esperado.


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

### Inventário histórico de workflows (19/10/2026)

Os nomes abaixo foram observados em `.github/workflows/` naquele momento. A lista é uma referência histórica; confira a branch atual e os arquivos YAML antes de supor que todos os workflows ou gatilhos continuam iguais:

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

### Resultado histórico de Actions — 19/10/2026

Os resultados abaixo pertencem ao SHA e à branch daquela data; não representam o estado atual do repositório:

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

### Resultado recente relacionado ao MenuDesktop — 07/11/2026

Os resultados abaixo foram consultados na branch `feat/separacao-paginas`, para o código do commit `faace481bb61554f3ebd89d2a789f26359fde6f3`:

| Workflow | Resultado |
|---|---|
| [Unit Tests — run 42406728366](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42406728366) | Sucesso em testes unitários, ESLint e build. |
| [Menu Desktop Reduced Visibility — run 42406728373](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42406728373) | Sucesso: troca Full → Reduced, reload da Home com scroll restaurado e reload direto com scroll restaurado em `/projetos`, `/sobre` e `/contato`. |
| [AI Context — Synchronize — run 42406728393](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42406728393) | Sucesso. |
| [Accessibility and SEO Audit — run 42406728425](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/42406728425) | Lighthouse mobile e desktop passaram; Axe falhou por contraste dos números dos campos de Contato (3,33:1, abaixo de 4,5:1). |

Durante o teste Menu Desktop, o console também registrou um erro não investigado de `ScrollTrigger.refresh()` em `/projetos` (`Cannot read properties of undefined (reading 'restart')`). O cenário de visibilidade do menu passou apesar desse log; não declarar a falha de ScrollTrigger como corrigida.

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

## 7. Estado corrente e como continuar

### Estado confirmado na revisão de 07/11/2026

- A separação de páginas mantém as rotas `/`, `/projetos`, `/sobre` e `/contato`.
- A correção de visibilidade do MenuDesktop foi implementada no commit [`506429c`](https://github.com/kleber-goncalves/portfolio-kg/commit/506429c39e09f77371e0ef2e8d2c2a3df7781217): `InteriorPageLayout` encaminha o cabeçalho real por callback ref; o `App.jsx` registra o `IntersectionObserver` depois que o cabeçalho lazy existe. A Home preserva a lógica baseada em `HeroSectionTransition`.
- O Playwright que passou no run 42406728373 confirmou a visibilidade do botão flutuante após reload com scroll restaurado nas três páginas internas e na Home. O atributo `data-menu-desktop-trigger` identifica o botão desktop sem confundi-lo com o MenuMobile oculto.
- **Pendência de investigação:** o teste de `/projetos` registrou erro de `ScrollTrigger.refresh()` com leitura de `restart` em valor indefinido. O menu passou; a causa de ScrollTrigger permanece aberta.
- **Pendência de acessibilidade:** o run 42406728425 passou no Lighthouse mobile/desktop, mas falhou em Axe por contraste 3,33:1 nos números dos campos da página Contato. A auditoria apontou `#656565` sobre `#0D0D0D`, com texto de 14px; o ajuste visual ainda não foi feito.
- A branch autorizada nessa sequência foi `feat/separacao-paginas`. Reconfirme a branch atual em cada novo pedido. Não presuma que `dev` seja a branch padrão e não altere `main` ou `dev` sem autorização explícita.

### Próximos cuidados técnicos

- Para mudanças no MenuDesktop, execute `.github/workflows/menu-desktop-reduced.yml` e confira o Playwright em reload das quatro páginas/rotas cobertas.
- Investigue separadamente o erro de `ScrollTrigger.refresh()` em Projetos antes de alterar GSAP, timelines ou gatilhos.
- Corrija o contraste do formulário de Contato em uma tarefa própria, preservando a identidade visual e reexecutando Axe.
- Continue diferenciando teste automatizado em Chromium, auditoria Lighthouse/Axe, inspeção visual manual e validação em dispositivo físico. Um não substitui o outro.

### Referência técnica anterior: UI/SFX

A seção 4 conserva o contexto técnico construído para `uiSfx`, Socials, carrossel e controles de som. Esse conteúdo continua útil quando a tarefa envolver esses componentes, mas não descreve a última alteração nem determina a branch de trabalho atual.

### Regra para a próxima conversa

Leia primeiro `docs/AI_CONTEXT.md`, confirme o estado remoto e a branch autorizada para o pedido mais recente, depois leia os arquivos e workflows específicos envolvidos. Não trate este prompt ou os registros históricos abaixo como substitutos da fonte de código atual.

---

## 8. Resumo para iniciar o trabalho rapidamente

- **Projeto:** KLEBER DEV, portfólio em React + Vite + JavaScript/JSX + Tailwind CSS 4.
- **Referência principal para continuidade:** `docs/AI_CONTEXT.md`; este prompt complementa o contexto histórico e técnico, mas não é a autoridade sobre branch, SHA, scripts ou status dos workflows.
- **Branch da sequência documentada em 07/11/2026:** `feat/separacao-paginas`. Confirme o head atual e a autorização a cada tarefa; não assuma `dev` como padrão.
- **MenuDesktop:** correção de montagem do observador após o cabeçalho lazy implementada; regressão Playwright passou no run 42406728373.
- **Testes de código:** Unit Tests, ESLint e build passaram no run 42406728366.
- **Acessibilidade:** Lighthouse mobile/desktop passou; Axe ainda acusa contraste insuficiente na numeração do formulário de Contato (run 42406728425).
- **ScrollTrigger:** existe erro observado de `refresh()` em `/projetos`; causa não investigada.
- **Branch policy:** não alterar `main` ou `dev` sem solicitação explícita; não realizar merge/deploy/sincronização por iniciativa própria.
- **Stack e ferramentas:** GSAP/ScrollTrigger, Lenis, Motion, Vitest/jsdom, Playwright e GitHub Actions; consulte os arquivos reais antes de assumir versões ou comportamentos.

**Continue a partir do pedido mais recente do usuário e valide cada afirmação nos arquivos e Actions do SHA correspondente.**
