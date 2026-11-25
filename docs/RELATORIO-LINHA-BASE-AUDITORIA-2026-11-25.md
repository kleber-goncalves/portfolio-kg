# Relatório de linha de base — auditoria multirrota

**Data:** 25/11/2026  
**Branch:** `feat/auditoria-multirota`  
**Escopo:** `/`, `/projetos`, `/sobre`, `/contato`  
**Ambientes:** Lighthouse mobile e desktop; auditorias estáticas; Axe; Playwright.

> Este documento registra resultados medidos antes de qualquer alteração nos componentes da aplicação. Resultados de laboratório não devem ser confundidos com dados de campo.

## 1. Performance — Lighthouse

Foram executadas três medições por rota e por dispositivo. Os valores abaixo são medianas das três execuções. O gate configurado permanece em 60/100.

### Mobile

| Rota | Performance | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| `/` | 83 | 4,36 s | 2,15 s | 37 ms | 0,007 |
| `/projetos` | 76 | 5,02 s | 3,02 s | 72 ms | 0,061 |
| `/sobre` | 70 | 7,50 s | 3,01 s | 41 ms | 0,007 |
| `/contato` | 80 | 4,62 s | 2,85 s | 33 ms | 0,007 |

### Desktop

| Rota | Performance | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| `/` | 59 | 5,39 s | 2,84 s | 113 ms | 0,003 |
| `/projetos` | 59 | 5,00 s | 3,32 s | 78 ms | 0,019 |
| `/sobre` | 58 | 7,70 s | 3,16 s | 44 ms | 0,002 |
| `/contato` | 61 | 4,53 s | 3,00 s | 34 ms | 0,002 |

**Interpretação:**

- Todas as rotas apresentam LCP de laboratório acima de 2,5 s.
- `/sobre` é o maior gargalo nos dois perfis.
- No desktop, Home, Projetos e Sobre ficaram abaixo do gate de 60/100; a falha do workflow é intencional e não deve ser corrigida reduzindo o limite.
- CLS permaneceu abaixo de 0,1 em todas as medições. Projetos teve o maior CLS no mobile (0,061), ainda abaixo do limite de referência.
- TBT é métrica de laboratório e não substitui INP de campo.

### Elementos LCP identificados

- Home: imagem do retrato do Hero.
- Projetos: parágrafo de descrição no cabeçalho da rota.
- Sobre: imagem principal do retrato.
- Contato: logo do preloader global foi classificado como elemento LCP em todas as execuções observadas.

O fato de o preloader ser classificado como LCP em Contato indica que a experiência de carregamento influencia diretamente a métrica daquela rota. A auditoria também observou que diversas imagens de Hero não são descobertas pelo HTML inicial, mesmo com prioridade alta aplicada depois que o React monta o componente. Isso deve ser investigado antes de escolher uma solução de preload ou renderização.

## 2. SEO

- Auditoria estática: **81 aprovações, 1 alerta e 0 erros**.
- Lighthouse SEO: **100/100** em todas as quatro rotas, desktop e mobile.
- Title, description, canonical, Open Graph, Twitter Cards, idioma, viewport, JSON-LD WebPage e inclusão no sitemap foram verificados por rota.
- O alerta restante é sobre o conteúdo principal React depender de JavaScript: o HTML inicial contém os metadados da página, mas não pré-renderiza o conteúdo principal. É uma oportunidade de avaliar pré-renderização/SSR, não um erro de canonical ou metadados.

## 3. Acessibilidade

### Lighthouse Accessibility

| Rota | Mobile | Desktop |
|---|---:|---:|
| `/` | 96 | 100 |
| `/projetos` | 96 | 96 |
| `/sobre` | 100 | 100 |
| `/contato` | 96 | 96 |

### Axe e verificações semânticas

- As verificações semânticas de `main`, H1, nomes acessíveis de links/botões, navegação rotulada e botões de ícone passaram nas oito combinações de rota/viewport.
- Axe registrou três grupos de violação, todos da regra `color-contrast`, concentrados em Contato: os quatro marcadores visuais `01` a `04` usam foreground `#656565` sobre `#0D0D0D`, com contraste medido de 3,33:1 e referência esperada de 4,5:1 para texto normal.
- O Lighthouse sinalizou contraste insuficiente em textos do preloader e em textos/cartões de Projetos.
- O Lighthouse também sinalizou incompatibilidade entre rótulos visíveis e nomes acessíveis nos filtros do catálogo de Projetos e no controle de efeitos sonoros da Home. Esses casos precisam ser inspecionados individualmente antes de alterar os nomes.
- Foi registrado um alerta de ausência de botão visível com nome “Abrir menu” em um estado mobile da Home. O fluxo SPA automatizado separado consegue navegar pelo menu; o comportamento deve ser revisto no contexto do estado inicial e da posição de rolagem.

Não foram adicionadas exclusões Axe nem reduções do escopo para ocultar os achados.

## 4. JavaScript e bundle

O workflow de cobertura executou 16 cenários: quatro rotas × desktop/mobile × primeira tela/página percorrida.

- Chunk compartilhado de entrada: aproximadamente **324,2 KiB sem compressão / 100,7 KiB gzip**.
- Os relatórios com source maps permitem atribuir trechos executados a módulos de origem.
- GSAP, ScrollTrigger, React/React DOM, Framer Motion/Motion DOM, Lenis e DotLottie aparecem entre os grupos de dependência com quantidade relevante de código não executado em alguns caminhos.
- `src/components/ui/Slider05.jsx` teve baixa execução em um cenário da Home; isso é apenas um candidato à verificação de referências, não uma indicação automática de código morto.

Cobertura de execução mede os caminhos percorridos pelo teste. Não equivale à porcentagem do bundle que pode ser removida nem à economia real de transferência.

## 5. UI/UX — cobertura automatizada

A primeira camada de auditoria percorre 12 combinações de carregamento direto (4 rotas × 3 viewports: desktop 1365×900, mobile 390×844 e mobile compacto 360×800) e percorre a navegação SPA em desktop e mobile.

Em uma execução concluída da camada direta:

- Todas as 12 combinações apresentaram um `main` visível e um H1 visível.
- Não foi encontrado overflow horizontal.
- Nenhuma imagem estava sem atributo `alt`.
- A navegação SPA sincronizou os metadados ao percorrer Home → Projetos → Sobre → Contato → Home.

A camada de interações adiciona checagens de teclado/skip link, filtro e paginação do catálogo e fluxo de validação/envio simulado do formulário. A execução ampliada, incluindo reenvio de erro e screenshots após carregamento das seções adiadas, ainda está em validação no GitHub Actions na data deste registro. O resultado final deverá ser incorporado após a conclusão do workflow.

## 6. Prioridade de investigação após a linha de base

1. Acessibilidade: corrigir contrastes do formulário, preloader e conteúdo de Projetos; revisar label-content-name-mismatch nos filtros e controle de som.
2. Performance: investigar preloader e animações de entrada/rolagem, especialmente em Sobre; distinguir renderização tardia de download do recurso LCP.
3. Carregamento de conteúdo: avaliar descoberta antecipada de imagem de Hero e estratégia de pré-renderização do conteúdo das rotas.
4. Bundle: revisar dependências grandes e módulos pouco utilizados após exercitar estados e interações, sem remover código apenas com base na cobertura.
5. Reexecutar as mesmas matrizes e comparar medianas com esta linha de base.

## 7. Integridade do trabalho

- Todos os testes e documentação desta etapa permanecem em `feat/auditoria-multirota`.
- `main` e `dev` não foram alteradas.
- Nenhum componente visual ou funcional da aplicação foi alterado durante a coleta desta linha de base.
- O envio do formulário nos testes Playwright utiliza endpoint fictício interceptado pelo navegador; nenhuma mensagem é enviada ao Basin real.
