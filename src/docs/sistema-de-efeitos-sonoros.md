# Sistema de efeitos sonoros do KLEBER DEV

Esta documentação explica como a biblioteca UI SFX funciona e como a integração do portfólio usa seus efeitos em componentes React. Os exemplos estão divididos em dois grupos: **padrões recomendados para este repositório**, que reutilizam o wrapper existente, e **exemplos da API oficial**, úteis quando a biblioteca é integrada de forma independente em outro projeto.

> Regra principal: som é reforço de feedback visual, nunca substituto de texto, estado, foco ou indicação acessível.

## Índice

- [Resumo da biblioteca](#resumo-da-biblioteca)
- [Instalação](#instalação)
- [Arquitetura neste repositório](#arquitetura-neste-repositório)
- [Como a reprodução funciona](#como-a-reprodução-funciona)
- [Preferência e volume](#preferência-e-volume)
- [Exemplos React usados no portfolio](#exemplos-react-usados-no-portfolio)
- [API oficial para outros projetos](#api-oficial-para-outros-projetos)
- [Acessibilidade e boas práticas](#acessibilidade-e-boas-práticas)
- [Testes e diagnóstico](#testes-e-diagnóstico)
- [Referências oficiais](#referências-oficiais)

## Resumo da biblioteca

[UI SFX](https://uisfx.com/) é uma biblioteca de efeitos sonoros semânticos para interfaces. Em vez de escolher um arquivo de áudio com nome baseado apenas no timbre, o código pede uma intenção — por exemplo, <code>success</code>, <code>error</code>, <code>hover</code> ou <code>processing</code> — e a biblioteca associa essa intenção ao efeito do pacote sonoro selecionado.

Na documentação oficial consultada, a biblioteca apresenta **78 cues semânticos**, **12 perfis sonoros** e **936 sons**. Esses números descrevem o catálogo publicado e podem mudar conforme o projeto evolui.

Os doze perfis publicados pela biblioteca são:

| Perfil | Personalidade descrita pela biblioteca |
| --- | --- |
| <code>minimal</code> | Seco, preciso e discreto. |
| <code>soft</code> | Suave, arredondado e acolhedor. |
| <code>glass</code> | Brilhante, cristalino e refinado. |
| <code>arcade</code> | Lúdico, inspirado em sons digitais de jogos. |
| <code>mechanical</code> | Cliques, mecanismos e encaixes. |
| <code>organic</code> | Texturas inspiradas em madeira, água e pedras. |
| <code>dreamy</code> | Leve, atmosférico e delicado. |
| <code>scifi</code> | Tons digitais com sensação futurista. |
| <code>rubber</code> | Resposta tátil elástica e brincalhona. |
| <code>cinematic</code> | Impactos profundos e caudas polidas. |
| <code>studio</code> | Precisão tátil voltada a ferramentas criativas. |
| <code>zen</code> | Dobras de papel, pincel suave, madeira e pequenos sinos. |

Este portfólio utiliza o perfil **<code>zen</code>**. O perfil está definido em <code>src/utils/uiSfx.js</code>; os componentes não escolhem um perfil diferente a cada interação.

### Como a biblioteca produz o som

Na integração Web Audio, a biblioteca cria o contexto de áudio sob demanda, sintetiza localmente receitas de som e reutiliza buffers renderizados em cache. A reprodução normal não precisa baixar um arquivo de áudio remoto a cada clique.

A API também oferece arquivos MP3/Ogg para ambientes em que a Web Audio API não seja apropriada. Esse modo de usar assets é diferente da integração principal deste portfólio, que usa o player da biblioteca.

### Cues únicos e loops

- **One-shot:** efeito curto para uma ação ou resultado, como abrir, fechar, confirmar, erro ou seleção. Ele termina sozinho.
- **Loop:** efeito contínuo associado a um estado em andamento. A documentação oficial lista <code>loading</code>, <code>processing</code>, <code>recording</code>, <code>connecting</code>, <code>scanning</code> e <code>streaming</code>. Um loop precisa ser interrompido quando a tarefa termina, falha ou é cancelada.

## Instalação

O pacote já está declarado em <code>package.json</code> como <code>uisfx</code> (faixa de versão <code>^0.4.0</code>). Para instalar as dependências do repositório clonado, use:

~~~bash
npm ci
~~~

Em um projeto novo que ainda não tenha o pacote, a instalação é:

~~~bash
npm install uisfx
~~~

Não é necessário executar <code>npm install uisfx</code> novamente a cada alteração neste portfólio; o pacote já faz parte das dependências do projeto.

## Arquitetura neste repositório

A integração não distribui instâncias de <code>createUISFX()</code> pelos componentes. Ela mantém um único player compartilhado, encapsulado em <code>src/utils/uiSfx.js</code>, para que som, volume, ativação e preferências tenham o mesmo estado em toda a interface.

~~~mermaid
flowchart TD
    A["Interação real do usuário"] --> B["Componente React"]
    B --> C{"Forma de pedir o efeito"}
    C --> D["playUiSound(cue)"]
    C --> E["requestUiSound(cue)"]
    E --> F["Evento customizado no window"]
    D --> G["src/utils/uiSfx.js"]
    F --> G
    H["attachUiSfxHoverListeners()"] --> G
    G --> I["Player UI SFX compartilhado"]
    I --> J["Perfil zen + volume + estado ativado"]
    J --> K["Web Audio"]
    G --> L["localStorage e notificações de mudança"]
~~~

### Arquivos envolvidos

| Arquivo | Responsabilidade |
| --- | --- |
| <code>package.json</code> | Declara a dependência <code>uisfx</code>. |
| <code>src/utils/uiSfx.js</code> | Cria o player sob demanda; mapeia o perfil <code>zen</code>, trata desbloqueio, cues, volume, preferências e sincronização dos controles. |
| <code>src/utils/uiSfxEvents.js</code> | Exporta <code>requestUiSound(cue)</code>, que emite o evento customizado <code>kleber-dev:ui-sfx-request</code>. |
| <code>src/App.jsx</code> | Registra <code>attachUiSfxHoverListeners()</code> uma vez durante a montagem da aplicação e devolve a limpeza do listener ao desmontar. |
| <code>src/components/SoundControls.jsx</code> | Controle unificado de ativação e volume para a interface desktop. |
| <code>src/components/SoundToggle.jsx</code> | Botão reutilizável para ativar ou desativar sons. |
| <code>src/components/SoundVolumeSliderMobile.jsx</code> | Controle deslizante de volume do menu mobile, otimizado para interação por toque e teclado. |
| <code>src/components/MenuMobile.jsx</code> | Sons de abrir/fechar o menu e de navegação. |
| <code>src/components/Socials.jsx</code> | Sons de expansão, recolhimento e movimento durante o arraste. |
| <code>src/components/ProjetoCarouselMobile.jsx</code> | Pede o cue inicial de arraste do carrossel. |

### Qual função devo usar?

#### <code>playUiSound(cue)</code>

Use quando o componente pode importar diretamente uma função pequena de reprodução:

~~~jsx
import { playUiSound } from "../utils/uiSfx";

function ExampleButton() {
    return (
        <button type="button" onClick={() => playUiSound("open")}>
            Abrir painel
        </button>
    );
}
~~~

A função não inicia áudio por conta própria antes do desbloqueio. Ela também respeita o estado ativado/desativado e o volume do portfólio.

#### <code>requestUiSound(cue)</code>

Use quando o componente deve pedir um efeito sem importar o player central:

~~~jsx
import { requestUiSound } from "../utils/uiSfxEvents";

function SocialsTrigger({ onOpen }) {
    const handleOpen = () => {
        requestUiSound("expand");
        onOpen();
    };

    return (
        <button type="button" onClick={handleOpen}>
            Abrir redes sociais
        </button>
    );
}
~~~

Internamente, <code>requestUiSound()</code> dispara um evento customizado no <code>window</code>. O listener da camada central recebe o cue e chama a mesma lógica que valida preferência e desbloqueio. Essa abordagem já é usada por <code>Socials.jsx</code> e <code>ProjetoCarouselMobile.jsx</code>.

**Não crie um novo player <code>createUISFX()</code> dentro de um componente deste repositório.** Isso poderia separar o estado de áudio, duplicar preferências e tornar os controles inconsistentes.

## Como a reprodução funciona

### 1. O player é criado sob demanda

Quando o player é necessário pela primeira vez no navegador, <code>uiSfx.js</code> executa a criação equivalente a:

~~~js
createUISFX({
    pack: "zen",
    volume: 1,
    enabled: getUiSoundsEnabled(),
    preferences: { key: "kleber-dev:ui-sfx" },
});
~~~

O objeto é guardado no módulo e reaproveitado nas chamadas seguintes. O ganho mestre da biblioteca permanece em <code>1</code>, pois o projeto aplica o ajuste customizado na opção <code>volume</code> de cada cue.

### 2. O áudio precisa ser desbloqueado por uma interação real

Navegadores podem bloquear áudio iniciado sem gesto do usuário. Por isso, <code>attachUiSfxHoverListeners()</code> reconhece interações confiáveis e solicita <code>player.unlock()</code> no momento adequado.

- Mouse e caneta: o sistema pode começar a tentativa em <code>pointerdown</code>.
- Toque: o desbloqueio é tentado a partir de <code>pointerup</code>, com fallback em <code>click</code> para navegadores ou emulações que o exigirem.
- Teclado: teclas usadas para ativação, navegação ou controle de widgets também podem iniciar a tentativa.
- Hover: somente ponteiros de mouse/caneta recebem o cue automático de hover; o toque não simula hover.

Se uma chamada de efeito ocorrer enquanto o desbloqueio estiver pendente, a camada central só toca o efeito se a tentativa terminar com sucesso e a preferência continuar ativada. Uma falha de desbloqueio não é tratada como se o áudio estivesse pronto.

### 3. O cue comunica a intenção, não o componente

É melhor reutilizar o mesmo vocabulário semântico nos componentes. Exemplos reais do portfólio:

| Cue | Onde é usado | Intenção |
| --- | --- | --- |
| <code>open</code> | Abertura do menu mobile e painel de volume. | Uma superfície é aberta. |
| <code>close</code> | Fechamento do menu ou painel de volume. | Uma superfície é fechada. |
| <code>forward</code> | Navegação mobile para uma seção. | Avançar na navegação. |
| <code>back</code> | Navegação mobile para o Hero. | Retornar ao início. |
| <code>expand</code> | Abertura do painel Socials. | Uma região se expande. |
| <code>collapse</code> | Fechamento do painel Socials. | Uma região se recolhe. |
| <code>drag-start</code> | Arraste do botão Socials e primeiro movimento do carrossel de projetos. | O usuário iniciou uma interação de arraste. |
| <code>volume-change</code> | Confirmação de alteração do slider de volume. | A configuração foi ajustada. |
| <code>toggle-on</code> | Som reativado no controle de áudio. | A preferência voltou a ficar ativa. |
| <code>hover</code> | Listener global de hover. | Um controle interativo com estado visual de hover foi alcançado pelo ponteiro. |

A biblioteca tem outros cues, como <code>success</code>, <code>error</code>, <code>complete</code>, <code>loading</code> e <code>processing</code>. Confira o catálogo oficial antes de adicionar nomes novos; o nome precisa existir no vocabulário da versão instalada.

## Preferência e volume

### Ativação e desativação

<code>getUiSoundsEnabled()</code> lê a preferência salva. Se não existir escolha anterior, este portfólio considera o som ativado por padrão. Isso é apenas o estado da preferência: a reprodução continua dependente de o navegador liberar o áudio após a interação.

<code>toggleUiSounds()</code> controla a mudança:

1. **Ao desativar:** invalida uma tentativa de desbloqueio pendente, interrompe sons em andamento com <code>stopAll()</code>, desativa o player e persiste a preferência.
2. **Ao ativar:** tenta desbloquear o áudio a partir do clique explícito; só liga o player se o desbloqueio for confirmado.
3. **Depois de ativar:** reproduz <code>toggle-on</code> para confirmar a mudança.

O toggle é um controle real da interface com <code>aria-pressed</code> e texto acessível. O usuário pode permanecer com os sons desativados.

### Onde as preferências são salvas

As preferências são armazenadas em <code>localStorage</code> neste navegador. Elas não são sincronizadas automaticamente entre dispositivos ou navegadores.

| Chave | Uso |
| --- | --- |
| <code>kleber-dev:ui-sounds-enabled</code> | Preferência manual de som ativado/desativado. |
| <code>kleber-dev:ui-sfx</code> | Chave de preferências passada para o player da biblioteca. |
| <code>kleber-dev:ui-sounds-volume</code> | Percentual de volume da interface. |
| <code>kleber-dev:ui-sounds-volume-v2-migrated</code> | Marca de migração da escala de volume anterior. |

A camada usa o evento <code>kleber-dev:ui-sfx-change</code> para manter os controles de volume e ativação sincronizados. Se o armazenamento não estiver disponível, há tratamento de erro para evitar que uma falha de <code>localStorage</code> quebre a interface; a preferência poderá valer apenas durante a sessão.

### Entendendo a escala de volume de 0% a 800%

A biblioteca aceita ganho mestre entre <code>0</code> e <code>1</code>. O portfólio mantém esse ganho em <code>1</code> e ajusta o volume por cue:

1. Busca o volume de referência daquela receita do perfil <code>zen</code>.
2. Multiplica pelo valor atual dividido por <code>100</code>.
3. Limita o resultado final ao intervalo de <code>0</code> a <code>1</code>.

Assim, <code>100%</code> representa o volume de referência do cue. O slider expõe <code>0</code> (silêncio) a <code>800</code> e avança em etapas de <code>5</code>. O valor <code>800%</code> amplifica o valor de referência antes do limite da fonte, mas efeitos diferentes podem chegar ao teto em valores diferentes porque cada receita começa com um volume padrão próprio.

O slider mobile atualiza o preenchimento visual enquanto o dedo se move, mas persiste o valor final ao soltar o ponteiro ou terminar a interação de teclado. Isso evita gravar cada movimento intermediário de toque.

## Exemplos React usados no portfolio

Os caminhos relativos abaixo assumem que os exemplos ficam em <code>src/components/</code>. Adapte o caminho do import caso o componente esteja em outra pasta.

### Cenário 1 — Abertura e fechamento de painel

Para um painel com estado local, use cues correspondentes à transição do estado:

~~~jsx
import { useState } from "react";
import { requestUiSound } from "../utils/uiSfxEvents";

function ExamplePanel() {
    const [isOpen, setIsOpen] = useState(false);

    const openPanel = () => {
        if (isOpen) return;
        requestUiSound("expand");
        setIsOpen(true);
    };

    const closePanel = () => {
        if (!isOpen) return;
        requestUiSound("collapse");
        setIsOpen(false);
    };

    return (
        <section>
            {!isOpen ? (
                <button type="button" onClick={openPanel}>
                    Abrir painel
                </button>
            ) : (
                <div>
                    <p>Conteúdo do painel</p>
                    <button type="button" onClick={closePanel}>
                        Fechar painel
                    </button>
                </div>
            )}
        </section>
    );
}
~~~

O componente deve manter uma indicação visual de estado e um botão de fechamento acessível. O som apenas acompanha a transição.

### Cenário 2 — Navegação entre seções

O menu mobile aplica <code>forward</code> para navegar até uma seção e <code>back</code> para retornar ao Hero:

~~~jsx
import { playUiSound } from "../utils/uiSfx";

function navigateTo(href) {
    playUiSound(href === "#hero" ? "back" : "forward");

    // A navegação efetiva continua sendo responsabilidade do menu/roteador.
    document.querySelector(href)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}
~~~

Se o projeto usa uma sequência própria de fechamento de menu, preserve-a; não substitua a navegação real pelo som nem mova a navegação para depender do término do áudio.

### Cenário 3 — Resultado positivo ou erro

Um cue de resultado deve ser disparado depois de conhecer o resultado real da operação, não imediatamente ao pressionar o botão:

~~~jsx
import { playUiSound } from "../utils/uiSfx";

function SaveButton({ onSave }) {
    const handleSave = async () => {
        try {
            await onSave();
            playUiSound("success");
        } catch {
            playUiSound("error");
        }
    };

    return (
        <button type="button" onClick={handleSave}>
            Salvar
        </button>
    );
}

export default SaveButton;
~~~

<code>onSave</code> representa a função real de gravação que o componente pai fornece. Também mantenha o feedback visual — por exemplo, texto de sucesso ou mensagem de erro. Este exemplo mostra o padrão e não representa um serviço de gravação incluído no portfólio.

### Cenário 4 — Hover sem adicionar handlers em todos os componentes

O <code>App.jsx</code> já instala os listeners globais. Em um controle React, basta ter um estado visual de hover/foco reconhecível:

~~~jsx
<button
    type="button"
    data-ui-sfx-hover
    className="transition-colors hover:text-bronze focus-visible:outline"
>
    Interagir
</button>
~~~

O atributo <code>data-ui-sfx-hover</code> declara explicitamente que o elemento pode receber o cue de hover. O listener delegado também reconhece controles interativos com classes de hover/foco visuais. Ele ignora mouse/caneta quando o ponteiro está apenas passando de um filho para outro dentro do mesmo controle, reduzindo sons repetidos.

Não adicione <code>onMouseMove={() => playUiSound("hover")}</code>: isso pode gerar muitos sons em um único gesto. O cue deve ocorrer na entrada do controle, não a cada frame do ponteiro.

### Cenário 5 — Botão de redes sociais arrastável

No componente Socials, o pedido de som é desacoplado da biblioteca:

~~~jsx
import { requestUiSound } from "../utils/uiSfxEvents";

function handleMeaningfulDragStep() {
    requestUiSound("drag-start");
}
~~~

O exemplo acima representa apenas o ponto de emissão do som; não implementa o arraste em si. No componente real, <code>Socials.jsx</code>, o som está associado à distância percorrida e limitado por um intervalo mínimo de aproximadamente <code>180 ms</code>. Isso permite ouvir respostas repetidas durante um arraste longo sem disparar um som em cada <code>pointermove</code>.

### Cenário 6 — Carrossel touch

O carrossel de tecnologias/projetos pede um único cue ao detectar o primeiro movimento do slider:

~~~jsx
import { requestUiSound } from "../utils/uiSfxEvents";

<Swiper
    onSliderFirstMove={() => requestUiSound("drag-start")}
>
    {/* Slides existentes */}
</Swiper>
~~~

Esse padrão indica o início de um arraste sem criar uma sequência de sons durante todo o gesto. O movimento e a mudança de slide continuam sendo gerenciados pelo Swiper.

### Cenário 7 — Alterar o volume com uma configuração simples

Se um controle de configuração não for um slider de arraste contínuo, ele pode confirmar a preferência por meio da função compartilhada:

~~~jsx
import { setUiSoundVolume } from "../utils/uiSfx";

function applyVolume(nextValue) {
    const committedValue = setUiSoundVolume(Number(nextValue));
    return committedValue;
}
~~~

O retorno é o valor numérico limitado ao intervalo permitido. Em sliders contínuos, prefira o padrão de <code>SoundVolumeSliderMobile.jsx</code>: acompanhe o gesto visualmente e salve somente ao terminar a interação, para evitar persistências repetitivas durante o toque.

### Cenário 8 — Usar os controles de áudio existentes

Para reaproveitar a interface já construída, importe os componentes existentes:

~~~jsx
import SoundControls from "./SoundControls";
import SoundToggle from "./SoundToggle";
import SoundVolumeSliderMobile from "./SoundVolumeSliderMobile";

function ExistingSoundSettings() {
    return (
        <section aria-label="Preferências de áudio">
            <SoundControls />
            <SoundToggle />
            <SoundVolumeSliderMobile />
        </section>
    );
}
~~~

Esse snippet ilustra os imports possíveis; não coloque necessariamente os três controles juntos na página. O layout do portfólio separa o controle desktop do controle mobile e carrega o slider mobile sob demanda no menu. Preserve essa decisão de layout e não monte o slider duas vezes para a mesma interface.

## API oficial para outros projetos

Esta seção é diferente da integração utilizada no KLEBER DEV. Use-a para compreender a API da biblioteca em um projeto independente; **não substitua o wrapper central deste repositório por uma nova instância em cada componente**.

### Exemplo básico da documentação oficial

~~~js
import { createUISFX } from "uisfx";

const ui = createUISFX({
    pack: "zen",
    preferences: {},
});

// Chame unlock() a partir do handler de uma interação real.
button.addEventListener("click", async () => {
    const unlocked = await ui.unlock();
    if (!unlocked) return;

    ui.play("success");
});
~~~

O player mantém preferências de acordo com as opções fornecidas. Quando <code>preferences: {}</code> é habilitado, a biblioteca usa seu armazenamento padrão para guardar pack, volume e estado habilitado. Este comportamento é independente das chaves customizadas que a camada do portfólio usa para sua escala de volume e controles.

### Exemplo de som em loop para uma tarefa

Use um loop somente quando houver um estado visível que realmente continue em andamento. O handle retornado por <code>play()</code> permite parar esse som quando a tarefa termina:

~~~js
import { createUISFX } from "uisfx";

const ui = createUISFX({ pack: "zen", preferences: {} });
let processingSound = null;

async function startProcessingFromUserAction() {
    const unlocked = await ui.unlock();
    if (!unlocked) return;

    processingSound?.stop();
    processingSound = ui.play("processing");
}

function finishProcessing() {
    processingSound?.stop();
    processingSound = null;
    ui.play("complete");
}

function cancelProcessing() {
    processingSound?.stop();
    processingSound = null;
}
~~~

Os handlers de início devem ser chamados por uma interação real. Ao encerrar a tela ou desmontar a lógica responsável pelo loop, pare o handle ativo; no aplicativo independente, também destrua o player quando ele não for mais necessário. Nunca deixe um loop tocando depois de sucesso, falha ou cancelamento.

### HTML sem React

A biblioteca oferece <code>bindUISFX()</code> para projetos que desejem associar cues a atributos HTML:

~~~js
import { bindUISFX } from "uisfx";

const { player, unbind } = bindUISFX();
~~~

~~~html
<a data-uisfx-hover="hover" href="/docs">Documentação</a>
<button data-uisfx="success">Concluir</button>
<button data-uisfx-press="press" data-uisfx-release="release">
    Pressionar
</button>
~~~

Chame <code>unbind()</code> ao destruir a view, como quando uma view client-side é desmontada. O portfólio usa a sua própria camada React, pois precisa centralizar a preferência, o volume customizado e a forma de desbloquear o áudio.

## Acessibilidade e boas práticas

1. **Nunca iniciar som automaticamente:** não chame <code>playUiSound()</code> durante renderização, montagem inicial ou leitura de dados. O sistema não deve transformar o carregamento da página em autoplay.
2. **Manter o estado visível:** botões continuam com rótulos, estados como ativado/desativado e mensagens de resultado. Não comunique erro ou sucesso apenas pelo som.
3. **Respeitar a preferência de silêncio:** quando o usuário desativa o áudio, pare sons ativos e impeça novas reproduções. Não implemente bypass do controle existente.
4. **Desbloquear somente por interação confiável:** não simule cliques nem tente contornar as restrições de reprodução dos navegadores.
5. **Evitar excesso:** hover deve ser discreto; gestos contínuos precisam de limitação de frequência; sons devem acompanhar mudanças significativas.
6. **Parar loops:** associe cada loop ao estado que o originou e finalize-o ao completar, falhar, cancelar ou desmontar a interface.
7. **Respeitar toque e teclado:** o feedback de hover é restrito a mouse/caneta; controles funcionais devem continuar operáveis por toque e teclado.
8. **Não amplificar indiscriminadamente:** a escala visual do portfólio é customizada e o ganho final de cada efeito é limitado. Teste em alto-falantes de celular, notebook e fones.
9. **Não instanciar players repetidos:** no portfólio, use <code>playUiSound()</code> ou <code>requestUiSound()</code> em vez de chamar <code>createUISFX()</code> em cada componente.
10. **Manter a intenção semântica:** reutilize um cue para a mesma classe de evento; consulte o catálogo antes de introduzir nomes novos.

## Testes e diagnóstico

O repositório inclui testes automatizados específicos do sistema de som:

| Script | O que verifica |
| --- | --- |
| <code>scripts/test-mobile-ui-sfx-slider.mjs</code> | Ausência de autoplay, desbloqueio após gesto real, persistência de volume, alternância de som e comportamento após recarregar. |
| <code>scripts/test-mobile-socials-ui-sfx.mjs</code> | Sons de abrir/fechar Socials, cues durante arraste e som inicial do carrossel. |

Os workflows relacionados ficam em <code>.github/workflows/</code>. Consulte os resultados mais recentes na aba [GitHub Actions](https://github.com/kleber-goncalves/portfolio-kg/actions); não presuma que uma validação passou sem conferir a execução correspondente.

### O som não tocou

Verifique nesta ordem:

- Houve uma interação real com a página? O som não toca automaticamente antes de o navegador liberar o áudio.
- A preferência está ativada no controle do portfólio?
- O volume não está em <code>0</code>?
- O cue existe na versão instalada da biblioteca?
- A chamada está usando <code>playUiSound()</code> ou <code>requestUiSound()</code> dentro da arquitetura central, em vez de criar outro player?
- O console apresenta erro do navegador, exceção de áudio ou algum erro de carregamento?
- O controle continua comunicando seu resultado visualmente, mesmo quando o áudio não pode tocar?

### Quer adicionar uma nova interação sonora?

1. Defina qual mudança de estado o som deverá comunicar.
2. Escolha um cue semântico existente na biblioteca.
3. Escolha <code>playUiSound()</code> para chamada direta ou <code>requestUiSound()</code> para pedido desacoplado.
4. Garanta que a ação visual continue funcionando sem som.
5. Considere repetição, toque, teclado e preferência de silêncio.
6. Execute as Actions de interação mobile relacionadas e revise os logs.

## Referências oficiais

- [Site oficial UI SFX](https://uisfx.com/)
- [Guia de design de som para interfaces](https://uisfx.com/ui-sound-design)
- [README do pacote e documentação de API](https://github.com/romainsimon/uisfx/blob/main/README.md)
- [Pacote npm uisfx](https://www.npmjs.com/package/uisfx)
- [Repositório upstream](https://github.com/romainsimon/uisfx)

O catálogo, a taxonomia e a API podem evoluir. Se atualizar a dependência <code>uisfx</code>, confira a documentação da versão instalada e revise os exemplos, cues e testes antes de assumir que todos os detalhes continuam iguais.
