# Checklist de Performance e Desempenho — KLEBER DEV

> **Objetivo:** melhorar o desempenho do portfólio sem mexer, por enquanto, em SEO ou acessibilidade. Os logs de `console` serão removidos ao final do projeto; durante o desenvolvimento, mantenha-os quando forem úteis para depuração.

## 1. Diagnóstico e linha de base

- [ ] Executar o build de produção e registrar erros ou avisos.
- [ ] Medir o Lighthouse antes das otimizações, usando sempre as mesmas condições de teste.
- [ ] Testar com cache frio e observar o carregamento inicial.
- [ ] Percorrer todas as seções e observar travamentos, saltos visuais e animações lentas.
- [ ] Registrar os valores iniciais de LCP, INP, CLS, tamanho transferido e uso de CPU, quando disponíveis.

## 2. Hero desktop e animações

- [ ] Inspecionar o `DotField` e identificar o custo do canvas por quadro.
- [ ] Evitar trabalho de animação quando o canvas estiver fora da área visível.
- [ ] Verificar se há loops de `requestAnimationFrame` duplicados.
- [ ] Revisar cálculos repetidos por ponto, linha ou quadro e reduzir trabalho desnecessário.
- [ ] Revisar timelines e `ScrollTrigger` duplicados ou que não sejam mais necessários.
- [ ] Confirmar a limpeza de timelines, triggers, listeners e observers no desmontar dos componentes.
- [ ] Testar as animações do Hero após cada alteração para garantir que o visual e o comportamento foram preservados.

## 3. Imagens e recursos visuais

- [ ] Encontrar imagens grandes e identificar quais aparecem na primeira tela.
- [ ] Converter imagens adequadas para WebP ou AVIF, mantendo qualidade visual aceitável.
- [ ] Gerar versões com dimensões apropriadas ao tamanho em que serão exibidas.
- [ ] Priorizar os recursos essenciais da primeira tela e evitar priorizar imagens abaixo da dobra.
- [ ] Aplicar carregamento tardio (`lazy loading`) nas imagens que não precisam aparecer imediatamente.
- [ ] Evitar baixar antecipadamente todas as imagens dos projetos ou de slides que ainda não estão visíveis.
- [ ] Conferir se o redimensionamento e o corte das imagens continuam corretos em desktop e celular.

## 4. Projetos, Swiper e experiência mobile

- [ ] Confirmar que intervalos e observers dos cards são limpos corretamente.
- [ ] Fazer o autoplay das imagens somente quando o card estiver visível e quando isso fizer sentido.
- [ ] Evitar animações simultâneas desnecessárias em vários cards.
- [ ] Verificar o carregamento das imagens dos projetos e de slides fora da tela.
- [ ] Comparar o custo do efeito `coverflow` com uma transição mais simples, se houver engasgos.
- [ ] Testar em um celular físico, especialmente em dispositivos com memória limitada.
- [ ] Testar larguras diferentes, tablet e orientação paisagem.

## 5. CSS, fontes e carregamento

- [ ] Identificar fontes, pesos e arquivos que não são usados e remover apenas os comprovadamente desnecessários.
- [ ] Procurar CSS duplicado ou regras que não são mais utilizadas.
- [ ] Identificar dependências grandes carregadas no início sem necessidade.
- [ ] Avaliar carregamento dinâmico (`import()`) para recursos pesados que só são necessários mais adiante.
- [ ] Verificar se o tamanho do bundle de produção está razoável e identificar os maiores módulos.
- [ ] Conferir políticas de cache dos recursos estáticos quando estiver analisando a entrega em produção.

## 6. Validação final

- [ ] Executar o build de produção depois das mudanças.
- [ ] Repetir o Lighthouse nas mesmas condições usadas na medição inicial.
- [ ] Comparar LCP, INP, CLS, tamanho transferido e uso de CPU com a linha de base.
- [ ] Percorrer todas as seções em desktop e mobile para detectar regressões visuais ou de animação.
- [ ] Confirmar que as alterações estão publicadas e que a versão de produção corresponde ao commit esperado.
- [ ] Registrar o que melhorou, o que piorou e quais problemas ainda merecem atenção.

## Ordem recomendada

1. Medir o desempenho atual e guardar os resultados.
2. Inspecionar e otimizar o `DotField`/canvas.
3. Otimizar imagens e carregamento dos recursos visuais.
4. Revisar os cards de projetos e o Swiper.
5. Revisar GSAP, `ScrollTrigger`, Lenis e limpeza de recursos.
6. Revisar fontes, CSS e bundle.
7. Repetir as medições e validar a publicação.

## Referências para interpretar os Core Web Vitals

- **LCP:** bom quando é de até 2,5 segundos.
- **INP:** bom quando é de até 200 milissegundos.
- **CLS:** bom quando é de até 0,1.

Esses limites são referências gerais; compare também os resultados antes e depois nas mesmas condições.

## Observação sobre `console`

Os logs podem permanecer durante a implementação para ajudar na depuração. Como logs muito frequentes podem atrapalhar a leitura dos testes e, em alguns casos, afetar o desempenho, evite medições com logs repetitivos disparando continuamente. Faça uma limpeza geral dos `console` na etapa final do projeto.
