# 🎬 Sistema de Animações por Experiência — `experienceMode`

> Documentação do padrão utilizado no portfólio para controlar efeitos visuais e custo de execução entre os modos **Full** e **Reduced**.

---

## 📌 1. Objetivo

O `experienceMode` permite que o portfólio tenha dois níveis de experiência:

- **Full** → mantém os efeitos visuais e interações mais completos.
- **Reduced** → prioriza **leveza e performance**, removendo principalmente efeitos contínuos ou interativos que exigem processamento frequente.

### ⚠️ Conceito importante

**Reduced não significa “sem animações”.**

A ideia é:

```text
FULL
├── Animações leves
├── Animações médias
└── Animações pesadas/interativas

REDUCED
└── Animações leves
```

Uma animação simples de entrada pode continuar funcionando no Reduced, enquanto efeitos como `mousemove`, tilt 3D e spotlight podem ser desativados.

---

# 🧠 2. Arquitetura geral

```text
┌──────────────────────┐
│   ExperienceSelector │
│  usuário escolhe     │
│  Full / Reduced      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   localStorage       │
│ "experienceMode"     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   experienceMode.js  │
│ lê a configuração    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       App.jsx        │
│ distribui via props  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Componentes     │
│  Hero, Card2, etc.   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ decide quais efeitos │
│ devem ser executados  │
└──────────────────────┘
```

---

# ⚙️ 3. `experienceMode.js`

Esse arquivo **não executa animações**. Ele apenas guarda e consulta a preferência do usuário.

```js
const EXPERIENCE_MODE_KEY = "experienceMode";

export function getExperienceMode() {
    const mode = localStorage.getItem(EXPERIENCE_MODE_KEY);

    if (mode === "reduced") return "reduced";
    if (mode === "full") return "full";

    return null;
}

export function setExperienceMode(mode) {
    if (mode !== "full" && mode !== "reduced") return;

    localStorage.setItem(EXPERIENCE_MODE_KEY, mode);
}

export function isReducedMotion() {
    return getExperienceMode() === "reduced";
}

export function clearExperienceMode() {
    localStorage.removeItem(EXPERIENCE_MODE_KEY);
}
```

### Funções

| Função | Responsabilidade |
|---|---|
| `getExperienceMode()` | Lê o modo salvo |
| `setExperienceMode()` | Salva `full` ou `reduced` |
| `isReducedMotion()` | Retorna `true` se estiver em Reduced |
| `clearExperienceMode()` | Remove a preferência |

> 💡 Como o sistema controla mais do que “motion”, futuramente `isReducedExperience()` pode ser um nome mais claro.

---

# 🧩 4. `App.jsx` distribui o modo

O `App` lê o modo quando a aplicação inicia:

```jsx
const [experienceMode] = useState(
    () => getExperienceMode() || "full"
);
```

Depois passa o valor por props:

```jsx
<HeroSectionTransition
    experienceMode={experienceMode}
/>

<Competencia
    experienceMode={experienceMode}
/>

<Diferenciais
    experienceMode={experienceMode}
/>
```

Fluxo:

```text
localStorage
     ↓
getExperienceMode()
     ↓
App.jsx
     ↓
experienceMode
     ↓
props
     ↓
componentes
```

O `App` não precisa saber como cada animação funciona. Ele apenas informa qual modo está ativo.

---

# 🎴 5. Como o `Card2` recebe o modo

```jsx
function Card2({
    title,
    number,
    text,
    experienceMode = "full",
}) {
```

Depois:

```jsx
const isReducedExperience =
    experienceMode === "reduced";
```

Agora o componente pode decidir quais efeitos executar.

---

# 🎯 6. Princípio principal: separar pelo custo

O sistema deve pensar em **custo computacional**, e não simplesmente em “tem animação ou não”.

```text
FULL
├── efeitos leves
├── efeitos médios
└── efeitos pesados

REDUCED
└── efeitos leves
```

### 🟢 Podem funcionar nos dois modos

- `opacity`
- pequenos deslocamentos (`x`, `y`)
- fade-in
- entrada de elementos
- transformações simples
- transições CSS simples
- animações que executam uma vez

### 🔴 Candidatos ao Full

- `mousemove`
- acompanhamento do cursor
- tilt 3D
- spotlight seguindo o mouse
- cálculos de posição em tempo real
- atualizações contínuas
- GSAP acionado repetidamente pelo movimento do mouse
- múltiplas camadas de glow/blur

---

# 🖱️ 7. Por que `mousemove` pode ser pesado?

Um efeito de cursor pode fazer:

```text
movimento do mouse
       ↓
mousemove
       ↓
getBoundingClientRect()
       ↓
cálculos X/Y
       ↓
CSS variables
       ↓
cálculo do tilt
       ↓
GSAP
       ↓
renderização
```

Isso pode acontecer repetidamente enquanto o usuário movimenta o mouse.

Por isso, no Reduced, o ideal é **nem registrar os listeners pesados**.

---

# 🏗️ 8. Padrão recomendado para o `Card2`

Quando existe lógica compartilhada, prefira um único `useEffect`:

```jsx
useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    // 🟢 Animações leves
    // Full + Reduced


    // 🔴 Animações pesadas
    // somente Full

    if (isReducedExperience) return;

    // mousemove
    // spotlight
    // tilt

    return () => {
        // cleanup
    };
}, [isReducedExperience]);
```

A lógica fica:

```text
Card2
 │
 ├── animações leves
 │      └── Full + Reduced
 │
 └── animações pesadas
        └── somente Full
```

---

# 🧱 9. Exemplo prático

Uma animação leve pode funcionar nos dois modos:

```jsx
useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    // 🟢 Leve: Full + Reduced
    gsap.fromTo(
        card,
        {
            opacity: 0,
            y: 20,
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
        }
    );

    // 🔴 Pesado: somente Full
    if (isReducedExperience) return;

    const handleMouseMove = (event) => {
        // posição do mouse
        // cálculos
        // tilt
        // spotlight
    };

    card.addEventListener(
        "mousemove",
        handleMouseMove
    );

    return () => {
        card.removeEventListener(
            "mousemove",
            handleMouseMove
        );

        gsap.killTweensOf(card);
    };
}, [isReducedExperience]);
```

Resultado:

```text
FULL
├── fade/entrada
├── mousemove
├── tilt
└── spotlight

REDUCED
└── fade/entrada
```

---

# 🧩 10. Quando usar dois `useEffect`

Também é perfeitamente válido separar:

```jsx
// FULL
useEffect(() => {
    if (experienceMode !== "full") return;

    // efeitos exclusivos do Full
}, [experienceMode]);


// REDUCED
useEffect(() => {
    if (experienceMode !== "reduced") return;

    // efeitos específicos do Reduced
}, [experienceMode]);
```

Use dois `useEffect` quando:

- os comportamentos são realmente independentes;
- possuem ciclos de vida diferentes;
- separar melhora bastante a leitura;
- existe lógica específica para cada modo.

Não crie dois efeitos apenas para duplicar código que poderia ser compartilhado.

---

# 🧠 11. `gsap.set()` x `gsap.to()`

## `gsap.set()`

Define um estado imediatamente:

```jsx
gsap.set(card, {
    opacity: 0,
    y: 75,
});
```

É o estado inicial:

```text
opacity: 0
y: 75
```

Não existe transição gradual.

## `gsap.to()`

Anima do estado atual para o destino:

```jsx
gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 1,
});
```

Visualmente:

```text
opacity: 0
     ↓
   anima
     ↓
opacity: 1
```

---

# 📜 12. Como funciona o `ScrollTrigger`

Exemplo usado em `Diferenciais`:

```jsx
const cardTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: card,
        start: "top 95%",
        end: "top 55%",
        scrub: 1,
    },
});
```

### `trigger`

```jsx
trigger: card
```

Define o elemento usado como referência.

### `start`

```jsx
start: "top 95%"
```

A animação começa quando o topo do card chega próximo de 95% da viewport.

### `end`

```jsx
end: "top 55%"
```

A animação termina quando o topo chega próximo de 55% da viewport.

### `scrub`

```jsx
scrub: 1
```

Faz a progressão da animação acompanhar o scroll suavemente.

---

# 🎴 13. Entrada dos cards

Estado inicial:

```jsx
gsap.set(card, {
    opacity: 0,
    y: 75,
});
```

Depois:

```jsx
cardTimeline.to(card, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "none",
});
```

Visualmente:

```text
       card
        ↓
   invisível
        ↓
      scroll
        ↓
     aparece
        ↓
    posição final
```

---

# 🧩 14. Timeline do cabeçalho

O cabeçalho utiliza uma timeline compartilhada:

```jsx
const headerTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: title,
        start: "top 90%",
        end: "top 65%",
        scrub: 1,
    },
});
```

Nessa timeline entram:

```text
Título
  ↓
Linha
  ↓
Descrição
```

Isso permite sincronizar os elementos.

---

# 🦶 15. Footer

O footer usa:

```jsx
toggleActions:
    "play none none reverse"
```

Conceitualmente:

```text
Entrou na área
      ↓
    PLAY

Saiu
      ↓
   nenhum

Voltou
      ↓
  REVERSE
```

É diferente de uma animação controlada diretamente pelo `scrub`.

---

# 🖱️ 16. `matchMedia` no Card2

O `Card2` pode verificar se existe um dispositivo apropriado para hover:

```jsx
const mediaQuery = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
);

if (!mediaQuery.matches) return;
```

Isso evita registrar efeitos de cursor em dispositivos touch, como celulares.

É especialmente útil para preservar a performance mobile.

---

# 🔄 17. Fluxo completo da mudança de modo

Quando o usuário escolhe Reduced:

```text
Usuário
   ↓
ExperienceSelector
   ↓
setExperienceMode("reduced")
   ↓
localStorage
   ↓
reload
   ↓
App.jsx
   ↓
getExperienceMode()
   ↓
experienceMode = "reduced"
   ↓
props
   ↓
Card2
   ↓
isReducedExperience = true
   ↓
efeitos pesados não são inicializados
```

---

# ⚠️ 18. O que o Reduced NÃO deve significar

Evite transformar todo componente em:

```jsx
if (isReducedExperience) {
    return;
}
```

logo no início do `useEffect`.

Isso pode remover animações leves que praticamente não prejudicam a performance.

O objetivo é:

> **Preservar a identidade visual e retirar principalmente o custo desnecessário.**

Não:

> “Reduced = site sem animações”.

---

# 🔍 19. Estado atual do projeto

## Hero

No Reduced, o `DotField` pesado não é renderizado.

```text
DotField
   ↓
Reduced
   ↓
não monta
```

## Card2

No Reduced, os efeitos interativos pesados podem ser desligados:

```text
mousemove       ❌
tilt 3D         ❌
spotlight       ❌
glow interativo  ❌
```

Enquanto animações leves podem permanecer:

```text
fade-in         ✅
entrada         ✅
CSS simples     ✅
```

## Diferenciais

As animações de entrada com `ScrollTrigger` podem continuar funcionando.

Isso é coerente com a estratégia:

```text
Reduced ≠ sem animação
Reduced = experiência mais leve
```

---

# ⚠️ 20. Outros componentes também precisam ser avaliados

Se o objetivo é tornar o Reduced realmente leve, não basta controlar o `Card2`.

No `App.jsx`, por exemplo, existem componentes globais:

```jsx
<CursorTrail />
```

e:

```jsx
<SmoothScroll>
```

Se eles executarem trabalho continuamente, ainda podem consumir recursos no Reduced.

A arquitetura ideal é:

```text
                experienceMode
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
      Hero          Card2      CursorTrail
        │             │             │
    pesado OFF     pesado OFF     pesado OFF
        │             │             │
        └─────────────┼─────────────┘
                      ↓
               Reduced mais leve
```

---

# 🧭 21. Checklist para novas animações

Antes de adicionar uma animação:

- [ ] Ela executa apenas uma vez?
- [ ] Ela depende do mouse?
- [ ] Ela usa `mousemove`?
- [ ] Ela chama `getBoundingClientRect()` frequentemente?
- [ ] Ela atualiza CSS variables continuamente?
- [ ] Ela usa GSAP em loop?
- [ ] Ela possui blur/glow pesado?
- [ ] Ela cria muitos elementos extras?
- [ ] Ela precisa existir no Reduced?
- [ ] Existe uma versão mais simples?
- [ ] O cleanup remove listeners?
- [ ] O cleanup remove/killa tweens quando necessário?

---

# 🏆 22. Regra de ouro

Ao criar uma animação, pense:

```text
A animação é pesada?
        │
    ┌───┴───┐
   SIM     NÃO
    │        │
    ▼        ▼
  FULL    FULL + REDUCED
```

A pergunta principal não é:

> “Isso é uma animação?”

A pergunta correta é:

> **“Qual é o custo dessa animação e ela precisa existir no Reduced?”**

---

# 🚀 23. Resumo da arquitetura

```text
experienceMode.js
        │
        │ guarda preferência
        ▼
     App.jsx
        │
        │ passa prop
        ▼
    Componente
        │
        ▼
experienceMode === "reduced"?
        │
   ┌────┴────┐
   │         │
  SIM       NÃO
   │         │
   ▼         ▼
leve      completo
```

### Princípio final

> **O Full entrega a experiência completa. O Reduced preserva a experiência visual, mas elimina principalmente os efeitos que trabalham continuamente ou têm custo computacional desnecessário.**

Essa abordagem permite manter um portfólio sofisticado sem transformar o modo Reduced em uma versão visualmente “morta”.
