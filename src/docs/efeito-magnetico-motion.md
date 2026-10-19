# Efeito magnético e preenchimento com Motion

Esta documentação descreve como funcionam os componentes reutilizáveis <code>MagneticExternalLinkHover</code> e <code>MagneticExternalLink</code> do KLEBER DEV. O objetivo é explicar a mola (spring), o deslocamento magnético, as diferenças entre os preenchimentos e a forma correta de reaproveitar o efeito em outros links.

A análise tem como base o código existente em <code>src/components/MagneticExternalLinkHover.jsx</code>, <code>src/components/MagneticExternalLink.jsx</code>, seus usos em <code>src/components/ProjetoDesktop.jsx</code> e <code>src/layout/Footer.jsx</code>, e a API atual de [Motion for React](https://motion.dev/).

> Esta alteração adiciona documentação. Os componentes existentes não foram modificados. A seção sobre origem do preenchimento registra um detalhe técnico observado no código e mostra uma correção possível, sem aplicá-la automaticamente.

## Índice

- [Visão geral dos componentes](#visão-geral-dos-componentes)
- [Como funciona o efeito mola](#como-funciona-o-efeito-mola)
- [Análise de MagneticExternalLinkHover](#análise-de-magneticexternallinkhover)
- [Análise de MagneticExternalLink](#análise-de-magneticexternallink)
- [Preenchimento a partir da posição do mouse](#preenchimento-a-partir-da-posição-do-mouse)
- [Como reutilizar os componentes](#como-reutilizar-os-componentes)
- [Criar um efeito magnético simples](#criar-um-efeito-magnético-simples)
- [Ajustar intensidade e sensação da mola](#ajustar-intensidade-e-sensação-da-mola)
- [Acessibilidade e desempenho](#acessibilidade-e-desempenho)
- [Referências](#referências)

## Visão geral dos componentes

Os dois componentes usam a mesma ideia física para mover o link em direção a um alvo calculado a partir da posição do mouse. A diferença principal está em como o preenchimento visual é ativado.

| Característica | <code>MagneticExternalLinkHover</code> | <code>MagneticExternalLink</code> |
| --- | --- | --- |
| Elemento principal | <code>motion.a</code> | <code>motion.a</code> |
| Movimento magnético | <code>useMotionValue</code> + <code>useSpring</code> | <code>useMotionValue</code> + <code>useSpring</code> |
| Intensidade padrão | <code>magneticStrength={0.2}</code> | <code>magneticStrength={0.2}</code> |
| Gatilho do preenchimento | Hover do ancestral <code>group/preview</code> | Estado local de hover ou foco |
| Origem do preenchimento | Centro padrão do elemento preenchido; não calcula coordenadas próprias | Calcula coordenadas relativas do mouse em <code>originX</code> e <code>originY</code> |
| Foco de teclado | O link continua sendo link, mas não tem estado local de foco para ativar todo o preenchimento | <code>onFocus</code>/<code>onBlur</code> incluem teclado no estado visual |
| Som de pressionar | Usa <code>playUiSound("press")</code> | Usa <code>playUiSound("press")</code> |
| Uso real identificado | Links Preview/GitHub no modo Reduced de <code>ProjetoDesktop.jsx</code> | Links externos da seção de contato em <code>Footer.jsx</code> |

A palavra “magnético” significa que o link se desloca na direção do mouse, com uma força proporcional à distância entre o ponteiro e o centro do elemento. Não é um ímã que atrai o cursor; o movimento é calculado a partir da posição do cursor dentro do próprio link.

## Como funciona o efeito mola

O projeto importa a API de React do pacote <code>motion</code>:

~~~jsx
import { motion, useMotionValue, useSpring } from "motion/react";
~~~

Os dois hooks principais têm responsabilidades diferentes:

- <code>useMotionValue(0)</code> armazena o alvo de movimento — por exemplo, a coordenada horizontal ou vertical que o mouse pede.
- <code>useSpring(valor, opções)</code> acompanha esse valor-alvo com uma transição baseada em física. Quando o alvo muda, a mola move a propriedade até o novo valor com a sensação definida por suas opções.
- <code>motion.a</code> é um link HTML normal com propriedades de animação; a propriedade <code>style</code> recebe os valores de movimento sem precisar transformar cada posição em estado React.

Um padrão mínimo é:

~~~jsx
const x = useMotionValue(0);
const springX = useSpring(x, {
    stiffness: 280,
    damping: 12,
    mass: 1.1,
});

// Em um evento do mouse:
x.set(12);

// No elemento:
<motion.a style={{ x: springX }} href="https://example.com">
    Exemplo
</motion.a>
~~~

No snippet, <code>x.set(12)</code> atualiza o alvo. O link não salta necessariamente 12 pixels de uma vez: a mola calcula como se aproximar desse valor. Quando a meta volta para zero, a mola também anima o retorno.

### O que significam os parâmetros

| Parâmetro | Efeito prático |
| --- | --- |
| <code>stiffness</code> | Rigidez da mola. Valores maiores puxam com mais força em direção ao alvo e tendem a responder mais rapidamente. |
| <code>damping</code> | Amortecimento. Valores maiores reduzem oscilações e balanço; valores baixos podem deixar o movimento mais oscilante. |
| <code>mass</code> | Massa simulada. Valores maiores dão sensação de maior inércia e podem tornar o deslocamento mais pesado. |
| <code>magneticStrength</code> | Não é parâmetro de mola; é o multiplicador usado pelo componente para determinar o quanto a diferença entre mouse e centro vira deslocamento em pixels. |

Os parâmetros são combinados. Por isso, altere um por vez e teste o resultado, em vez de aumentar todos simultaneamente.

## Análise de MagneticExternalLinkHover

Arquivo: <code>src/components/MagneticExternalLinkHover.jsx</code>.

### 1. Calcula o deslocamento magnético

O componente lê as dimensões e posição do link com <code>getBoundingClientRect()</code>. Depois calcula a posição do mouse em coordenadas locais:

~~~jsx
const rect = event.currentTarget.getBoundingClientRect();
const mouseX = event.clientX - rect.left;
const mouseY = event.clientY - rect.top;

const centerX = rect.width / 2;
const centerY = rect.height / 2;

x.set((mouseX - centerX) * magneticStrength);
y.set((mouseY - centerY) * magneticStrength);
~~~

Exemplo: se o mouse está 40 pixels à direita do centro e a força é <code>0.2</code>, o alvo horizontal é <code>40 × 0.2 = 8px</code>. Se o mouse estiver 20 pixels abaixo do centro, o alvo vertical será <code>20 × 0.2 = 4px</code>.

O alvo é suavizado por duas molas independentes:

- Eixo X: <code>stiffness: 230</code>, <code>damping: 12</code>, <code>mass: 1.1</code>.
- Eixo Y: <code>stiffness: 630</code>, <code>damping: 12</code>, <code>mass: 0.9</code>.

A mola vertical é mais rígida que a horizontal, de modo que as duas direções não precisam responder de forma idêntica. Em <code>onMouseLeave</code>, os dois alvos voltam a zero e o link retorna suavemente à posição inicial.

### 2. Como o preenchimento é acionado

A camada colorida é um <code>span</code> absoluto, decorativo e sem interação de ponteiro. O estado inicial usa <code>scale-0</code> e <code>opacity-0</code>; as variantes <code>group-hover/preview:scale-100</code> e <code>group-hover/preview:opacity-100</code> fazem a camada crescer e ficar visível em aproximadamente 500 ms.

O importante é que esse preenchimento **não é calculado a partir das coordenadas do mouse** neste componente. Ele é controlado por CSS/Tailwind com base em um elemento ancestral que tenha a classe <code>group/preview</code>. O preenchimento cresce a partir de sua origem CSS padrão, que normalmente é o centro.

No uso existente, <code>ProjetoDesktop.jsx</code> envolve a área de conteúdo e os links Preview/GitHub em um elemento com <code>group/preview</code>. Essa classe nomeada ativa os estilos <code>group-hover/preview:*</code> dos links filhos.

Exemplo de estrutura compatível:

~~~jsx
<div className="group/preview">
    <MagneticExternalLinkHover href="https://example.com/demo">
        Preview
    </MagneticExternalLinkHover>

    <MagneticExternalLinkHover href="https://github.com/example/project">
        GitHub
    </MagneticExternalLinkHover>
</div>
~~~

**Atenção:** sem o ancestral <code>group/preview</code>, o preenchimento e algumas mudanças de borda/texto que usam <code>group-hover/preview</code> não serão acionados como esperado. A classe genérica <code>group</code> não equivale a <code>group/preview</code>, pois o nome precisa corresponder.

Como o gatilho pertence ao ancestral, interagir com qualquer área daquele grupo pode ativar as classes de hover nos dois links filhos ao mesmo tempo. Isso pode ser desejado em uma composição de prévia, mas não é o mesmo que cada botão ter seu próprio hover independente.

### 3. Conteúdo e ícone

A camada de conteúdo usa <code>motion.span</code> com <code>whileHover</code> para elevar levemente o texto e aumentar o espaçamento entre as letras. Quando a prop <code>Icon</code> é fornecida, outro <code>motion.span</code> anima o ícone um pouco para a direita/cima e aumenta sua escala.

O link também declara <code>data-ui-sfx-hover</code> e toca o cue <code>press</code> ao pressionar ou ao ativar pelo teclado. Isso faz parte da integração de áudio central; não é necessário criar uma nova instância do player de som para reutilizar o componente.

## Análise de MagneticExternalLink

Arquivo: <code>src/components/MagneticExternalLink.jsx</code>.

### 1. O estado combina mouse e teclado

O componente mantém dois estados React:

- <code>isHovered</code>: fica verdadeiro enquanto o mouse está sobre o link.
- <code>isFocused</code>: fica verdadeiro enquanto o elemento recebe foco, incluindo navegação por teclado.

A expressão <code>isInteractive = isHovered || isFocused</code> é utilizada para ativar o preenchimento, a borda e as mudanças de estilo de texto/ícone. Assim, o efeito não depende exclusivamente de hover com mouse para mostrar o estado visual principal.

### 2. A mola é configurada de outra forma

Nos dois eixos, o componente usa <code>stiffness: 280</code>, <code>damping: 12</code> e <code>mass: 1.1</code>. O cálculo de posição usa o mesmo princípio do primeiro componente, com o parâmetro <code>magneticStrength</code>.

Ao sair do link, ele define <code>isHovered</code> como falso e redefine <code>x</code> e <code>y</code> para zero. Os alvos retornam à origem e as molas animam o deslocamento de volta. O foco de teclado ativa o estado visual, mas não calcula uma posição magnética enquanto o mouse não se move.

### 3. O preenchimento usa uma segunda mola

A camada colorida é um <code>motion.span</code> absoluto com <code>scale: 0</code>/<code>opacity: 0</code> no início. Quando <code>isInteractive</code> é verdadeiro, anima para <code>scale: 1</code> e <code>opacity: 1</code>.

A escala usa <code>stiffness: 150</code>, <code>damping: 22</code> e <code>mass: 0.75</code>. A opacidade tem uma transição curta de 0,25 s. A combinação dá ao preenchimento uma sensação de expansão com peso leve, enquanto a borda e o conteúdo respondem ao mesmo estado de interação.

A camada está marcada com <code>aria-hidden="true"</code> e <code>pointer-events-none</code>; ela é decorativa e não deve capturar cliques nem introduzir conteúdo para tecnologias assistivas.

### 4. Onde esse componente é usado

Em <code>src/layout/Footer.jsx</code>, os links GitHub e LinkedIn usam o componente com valores padrão:

~~~jsx
import { ArrowUpRight } from "lucide-react";
import MagneticExternalLink from "../components/MagneticExternalLink";

<MagneticExternalLink
    href="https://github.com/kleber-goncalves"
    Icon={ArrowUpRight}
>
    GitHub
</MagneticExternalLink>
~~~

Para personalizar a aparência, o componente aceita props como <code>accent</code>, <code>borderColor</code>, <code>textColor</code>, <code>hoverTextColor</code>, <code>magneticStrength</code>, <code>px</code>, <code>py</code>, <code>className</code>, <code>target</code>, <code>rel</code> e <code>Icon</code>.

O exemplo abaixo mostra a variação com outra cor. Mantenha contraste suficiente entre o fundo preenchido e o texto:

~~~jsx
<MagneticExternalLink
    href="https://github.com/kleber-goncalves"
    accent="#C49A78"
    textColor="#F2F0EC"
    hoverTextColor="#0D0D0D"
    magneticStrength={0.15}
    className="min-w-28"
>
    Ver projeto
</MagneticExternalLink>
~~~

Os dois componentes são links externos: por padrão, o destino abre com <code>target="_blank"</code> e <code>rel="noopener noreferrer"</code>. Passe sempre um <code>href</code> real; o valor padrão <code>#</code> é apenas uma reserva de prop e não deve ser utilizado como destino final.

## Preenchimento a partir da posição do mouse

Os dois componentes têm comportamentos diferentes, mesmo que visualmente ambos usem uma camada colorida que cresce:

### <code>MagneticExternalLinkHover</code>: origem CSS e hover do grupo

- O mouse é medido para deslocar o link.
- A camada de preenchimento usa <code>scale</code> e <code>opacity</code> via classes de hover do ancestral.
- Não existem Motion Values de origem do preenchimento neste componente.
- O efeito responde à área <code>group/preview</code>, não calcula de forma contínua uma origem no ponto do cursor.

Se você precisa de um preenchimento independente para cada botão, controlado pelo próprio hover/foco, a arquitetura de estado de <code>MagneticExternalLink</code> é mais próxima desse objetivo.

### <code>MagneticExternalLink</code>: origem calculada pelo ponteiro

O componente declara dois Motion Values normalizados de <code>0</code> a <code>1</code>, que representam a posição relativa do mouse dentro do retângulo do link:

~~~jsx
const originX = useMotionValue(0.5);
const originY = useMotionValue(0.5);

const relativeX = (event.clientX - rect.left) / rect.width;
const relativeY = (event.clientY - rect.top) / rect.height;

originX.set(Math.min(1, Math.max(0, relativeX)));
originY.set(Math.min(1, Math.max(0, relativeY)));
~~~

Esses valores representam percentuais: <code>0</code> é a borda esquerda/superior, <code>0.5</code> é o centro e <code>1</code> é a borda direita/inferior. O código atual usa o resultado para definir <code>transform-origin</code> da camada de preenchimento.

### Detalhe de reatividade encontrado

Na versão atual, o estilo usa os valores lidos por <code>originX.get()</code> e <code>originY.get()</code> para construir uma string de <code>transform-origin</code>. A chamada <code>.get()</code> lê o valor no momento em que React renderiza. Alterar um Motion Value com <code>.set()</code> não força uma nova renderização React; essa é justamente uma das vantagens de Motion Values para animações performáticas. Como <code>originX</code>/<code>originY</code> mudam no <code>onMouseMove</code>, o estilo pode ficar com a posição capturada na renderização que ocorreu ao entrar no link, em vez de acompanhar cada movimento seguinte.

Portanto, **a intenção e o cálculo para acompanhar o ponteiro existem, mas a maneira atual de passar esses valores para o estilo não garante a atualização contínua do ponto de origem**. Isso é diferente do movimento magnético, que já funciona porque <code>springX</code> e <code>springY</code> são valores passados diretamente para <code>style</code>.

### Alternativa recomendada para uma origem reativa

Motion oferece <code>useTransform</code> para derivar Motion Values e <code>useMotionTemplate</code> para combiná-los em uma string reativa. A abordagem abaixo é uma sugestão de correção localizada para o preenchimento; ela ainda não foi aplicada ao componente:

~~~jsx
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";

const originX = useMotionValue(0.5);
const originY = useMotionValue(0.5);

const originXPercent = useTransform(originX, [0, 1], ["0%", "100%"]);
const originYPercent = useTransform(originY, [0, 1], ["0%", "100%"]);
const fillOrigin = useMotionTemplate`${originXPercent} ${originYPercent}`;

// No span de preenchimento:
<motion.span
    style={{
        backgroundColor: accent,
        transformOrigin: fillOrigin,
    }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{
        scale: isInteractive ? 1 : 0,
        opacity: isInteractive ? 1 : 0,
    }}
/>
~~~

As chamadas existentes de <code>originX.set(...)</code> e <code>originY.set(...)</code> podem continuar calculando a posição do mouse. A diferença é que <code>fillOrigin</code> recebe um Motion Value derivado e é atualizado quando os valores de origem mudam, sem depender de uma renderização React para cada movimento.

Depois de aplicar uma correção desse tipo no código real, valide pelo navegador a entrada do mouse em diferentes pontos do link (centro, bordas e cantos), a saída do mouse, o foco por teclado e a preferência de movimento reduzido.

## Como reutilizar os componentes

### Cenário 1 — Links de contato no rodapé

Use <code>MagneticExternalLink</code> para links externos independentes que tenham preenchimento ativado por hover/foco:

~~~jsx
import { ArrowUpRight } from "lucide-react";
import MagneticExternalLink from "../components/MagneticExternalLink";

function ContactLinks() {
    return (
        <div className="flex flex-wrap gap-3">
            <MagneticExternalLink
                href="https://github.com/kleber-goncalves"
                Icon={ArrowUpRight}
            >
                GitHub
            </MagneticExternalLink>

            <MagneticExternalLink
                href="https://www.linkedin.com/in/kleber-goncalve-s/"
                Icon={ArrowUpRight}
            >
                LinkedIn
            </MagneticExternalLink>
        </div>
    );
}
~~~

### Cenário 2 — Ações Preview e GitHub agrupadas

Use <code>MagneticExternalLinkHover</code> quando o design pretende que os links reajam ao hover de uma área compartilhada:

~~~jsx
import { ArrowUpRight } from "lucide-react";
import MagneticExternalLinkHover from "../components/MagneticExternalLinkHover";

function ProjectActions({ demo, repository }) {
    return (
        <div className="group/preview flex items-center gap-3">
            {demo && (
                <MagneticExternalLinkHover href={demo} Icon={ArrowUpRight}>
                    Preview
                </MagneticExternalLinkHover>
            )}
            {repository && (
                <MagneticExternalLinkHover href={repository} Icon={ArrowUpRight}>
                    GitHub
                </MagneticExternalLinkHover>
            )}
        </div>
    );
}
~~~

O exemplo usa o nome de classe exato de que o componente precisa. Se a intenção é que somente o botão apontado pelo mouse seja preenchido, use uma variante com estado individual — ou faça o gatilho local do preenchimento explicitamente, em vez de depender do ancestral comum.

### Cenário 3 — Intensidade magnética discreta ou forte

A prop <code>magneticStrength</code> muda a proporção do deslocamento. É a maneira direta de modular o magnetismo sem reescrever os cálculos:

~~~jsx
<MagneticExternalLink href="https://example.com" magneticStrength={0.1}>
    Magnetismo discreto
</MagneticExternalLink>

<MagneticExternalLink href="https://example.com" magneticStrength={0.2}>
    Magnetismo padrão
</MagneticExternalLink>

<MagneticExternalLink href="https://example.com" magneticStrength={0.3}>
    Magnetismo mais evidente
</MagneticExternalLink>
~~~

Esses valores são pontos de partida para teste, não limites rígidos. Intensidade elevada pode aproximar ou sobrepor links próximos; confira sempre a composição responsiva.

## Criar um efeito magnético simples

Se a interface precisar de um elemento magnético diferente de um link externo, o padrão básico pode ser adaptado para um botão ou cartão. Não reutilize os componentes externos com destinos artificiais só para conseguir o efeito.

~~~jsx
import { motion, useMotionValue, useSpring } from "motion/react";

function MagneticSurface({ children }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, {
        stiffness: 280,
        damping: 14,
        mass: 1,
    });
    const springY = useSpring(y, {
        stiffness: 280,
        damping: 14,
        mass: 1,
    });

    const strength = 0.18;

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;

        x.set(offsetX * strength);
        y.set(offsetY * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
        >
            {children}
        </motion.div>
    );
}

export default MagneticSurface;
~~~

Esse componente demonstra apenas o movimento magnético, não cria um link clicável e não implementa a camada de preenchimento. Use elementos HTML semânticos dentro dele: por exemplo, um <code>button</code> para uma ação e um <code>a</code> para navegar.

## Ajustar intensidade e sensação da mola

Para afinar o efeito, pense separadamente em duas decisões:

1. **Quanto o elemento se desloca?** Ajuste <code>magneticStrength</code>. É o multiplicador do movimento, independente da física da mola.
2. **Como o elemento se desloca?** Ajuste <code>stiffness</code>, <code>damping</code> e <code>mass</code>. Isso muda a rapidez percebida, a oscilação e a inércia.

Uma boa sequência de ajuste é começar pela força magnética, depois escolher rigidez e amortecimento, e por fim testar a massa. Compare a movimentação com cursor lento e rápido, saindo pela borda e entrando em pontos diferentes.

Evite manter um grande número de elementos magnéticos sobrepostos. Cada componente pode manter seus próprios Motion Values e eventos, então use o efeito onde acrescenta feedback e não simplesmente em todos os textos e ícones.

## Acessibilidade e desempenho

- Os componentes são links externos e devem receber um destino real em <code>href</code>.
- Mantenha o texto visível como rótulo do link; o ícone é opcional e não substitui o nome da ação.
- O foco por teclado é considerado explicitamente no preenchimento de <code>MagneticExternalLink</code>. Para <code>MagneticExternalLinkHover</code>, revise os estilos de <code>focus-visible</code> e, se necessário, adicione um estado de foco visual independente do hover do ancestral.
- O movimento magnético atual é acionado por eventos de mouse; em touch o link ainda deve funcionar normalmente sem depender da atração magnética.
- Considere respeitar <code>prefers-reduced-motion</code> para eliminar ou reduzir deslocamentos para quem pede menos animação. Os dois componentes analisados não verificam essa preferência diretamente em sua implementação atual.
- Use <code>pointer-events-none</code> e <code>aria-hidden="true"</code> nas camadas decorativas para que o preenchimento não bloqueie cliques ou acrescente conteúdo redundante a leitores de tela.
- Motion mantém valores animados sem obrigar React a renderizar a cada quadro. Prefira passar Motion Values diretamente em <code>style</code> ou derivá-los com os hooks do Motion, em vez de converter cada evento de mouse em <code>setState</code>.
- Teste o resultado nos dois modos do portfólio, Full e Reduced, e em larguras distintas. O uso do componente não deve tornar difícil clicar nos links ou identificar qual é o destino.

## Referências

- [Motion for React — documentação inicial](https://motion.dev/docs/react)
- [useSpring](https://motion.dev/docs/react-use-spring)
- [Motion Values](https://motion.dev/docs/react-motion-value)
- [useTransform](https://motion.dev/docs/react-use-transform)
- [useMotionTemplate](https://motion.dev/docs/react-use-motion-template)
- [Animações de hover no React](https://motion.dev/docs/react-hover-animation)
- [Componente MagneticExternalLink](../components/MagneticExternalLink.jsx)
- [Componente MagneticExternalLinkHover](../components/MagneticExternalLinkHover.jsx)
- [Uso no projeto desktop](../components/ProjetoDesktop.jsx)
- [Uso no rodapé](../layout/Footer.jsx)

A documentação oficial do Motion é a referência para opções e hooks. Os valores numéricos, classes nomeadas de hover, props e observações específicas deste documento foram extraídos dos componentes do repositório indicados acima.
