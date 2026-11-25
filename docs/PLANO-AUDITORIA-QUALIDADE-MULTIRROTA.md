# Auditoria de qualidade após a separação das páginas

## Objetivo

Estabelecer uma linha de base verificável de Performance, SEO, Acessibilidade e UI/UX para todas as rotas do portfólio, sem alterar a aplicação antes de identificar os problemas.

## Rotas cobertas

A fonte única das rotas é `src/data/seoRoutes.json`:

| Rota | Página |
|---|---|
| `/` | Home |
| `/projetos` | Projetos |
| `/sobre` | Sobre |
| `/contato` | Contato |

Quando possível, os testes devem consumir essa configuração, evitando manter uma segunda lista independente de rotas.

## Matriz de testes

### Performance

- Lighthouse mobile: 4 rotas, 3 execuções por rota.
- Lighthouse desktop: 4 rotas, 3 execuções por rota.
- Os artefatos mobile e desktop são separados para facilitar comparação.
- O diagnóstico de JavaScript cobre cada rota em quatro cenários: desktop inicial, desktop percorrido, mobile inicial e mobile percorrido.
- A primeira linha de base mantém o limite mínimo de Performance em 60/100. O limite deve ser revisto somente depois de coletar e interpretar os resultados de todas as rotas.

### SEO

- A auditoria estática verifica o HTML gerado de cada rota, incluindo title, description, canonical, Open Graph, Twitter Cards, JSON-LD de WebPage e presença no sitemap.
- Lighthouse SEO é executado em mobile e desktop nas quatro rotas.
- O teste de navegação SPA percorre os links do site e confirma que title, description, canonical, Open Graph, Twitter title e JSON-LD acompanham a rota, sem duplicação de metadados.

### Acessibilidade

- Axe percorre página inteira e estado de menu aberto em desktop e mobile para cada rota.
- Lighthouse Accessibility é executado em mobile e desktop para todas as rotas.
- As verificações semânticas existentes continuam ativas: landmarks, H1, nomes acessíveis de links/botões, rótulos de navegação e botões de ícone.
- Falhas WCAG devem ser corrigidas na interface; não devem ser ocultadas por exclusões ou redução arbitrária do escopo.
- Os testes automatizados não substituem navegação somente por teclado, leitores de tela, zoom/reflow e avaliação humana.

### UI/UX e responsividade

- Carregamento direto de todas as rotas em desktop 1365×900, mobile 390×844 e mobile compacto 360×800.
- Verificação de overflow horizontal, landmarks, H1 visível, atributos alt, metadados, erros JavaScript não tratados e falhas de recursos da mesma origem.
- Navegação SPA de Home → Projetos → Sobre → Contato → Home em desktop e pelo menu mobile.
- Capturas de tela completas por rota e viewport ficam disponíveis nos artefatos do GitHub Actions.
- Alvos interativos menores que 24×24 px são registrados para revisão, sem reprovação automática: critérios WCAG de tamanho de alvo possuem exceções contextuais.
- Erros de console são registrados para triagem. Uma captura de tela e uma medição geométrica não substituem a revisão humana de hierarquia, legibilidade, estética e facilidade de uso.

## Workflows envolvidos

- `.github/workflows/lighthouse-performance.yml`: matriz de Performance Lighthouse.
- `.github/workflows/accessibility-seo.yml`: Lighthouse de Acessibilidade/SEO e Axe.
- `.github/workflows/analyze-js-runtime-coverage.yml`: cobertura de JavaScript em todas as rotas e cenários.
- `.github/workflows/route-uiux-audit.yml`: carregamento de rotas, responsividade, navegação SPA e screenshots.

## Interpretação dos indicadores

- LCP, FCP, TBT, CLS, Speed Index, transferência e quantidade de recursos devem ser analisados por rota e dispositivo.
- TBT de laboratório não deve ser apresentado como INP. INP precisa de dados de campo ou instrumentação de eventos reais.
- LCP medido em laboratório ajuda a comparar cenários, mas não substitui a classificação de Core Web Vitals em dados de campo.
- Código não executado durante um cenário de cobertura não é automaticamente código morto. Interações e estados alternativos precisam ser exercitados antes de remover ou dividir módulos.

## Problemas já conhecidos antes desta matriz

- A auditoria Axe anterior registrou contraste de texto `#656565` sobre `#0D0D0D`, com razão aproximada de 3,33:1, abaixo de 4,5:1 para texto normal. Esse achado deve continuar visível até ser corrigido e revalidado.
- O Lighthouse mobile anterior da Home apresentou LCP de laboratório próximo a 3,8–3,9 s. A matriz ampliada permitirá verificar se o comportamento se repete nas páginas separadas.

Esses dados são referências históricas; não devem ser misturados com medições de novos commits ou apresentados como resultado da matriz atual.

## Sequência de trabalho

1. Executar a matriz completa e guardar os artefatos.
2. Classificar falhas por severidade, rota e viewport.
3. Corrigir primeiro erros funcionais, acessibilidade e problemas que prejudiquem conteúdo ou navegação.
4. Otimizar performance com base nos gargalos medidos, não apenas em números isolados de cobertura.
5. Reexecutar a matriz e comparar os resultados com a linha de base.
6. Revisar manualmente screenshots e fluxos com teclado antes de considerar a auditoria encerrada.

## Escopo de Git

Todo o trabalho desta auditoria deve permanecer em `feat/auditoria-multirota` até revisão e aprovação. Não fazer alterações diretas em `main` ou `dev`.
