# Formulário de contato — React, Zod e Basin

> Documentação técnica do formulário da página Contato do KLEBER DEV.
>
> Última revisão: 29/10/2026.

## 1. Objetivo

A página `/contato` permite que recrutadores, clientes e outros desenvolvedores enviem uma mensagem. O formulário usa React para a interface, a validação nativa do HTML e o Zod para validar/normalizar os campos, e o Basin para receber a submissão e encaminhar notificações por e-mail.

O projeto **não possui uma API própria para receber as mensagens**. O navegador envia os dados diretamente para o endpoint público do Basin.

## 2. Arquivos envolvidos

| Arquivo | Responsabilidade |
|---|---|
| `src/pages/contato/Contato.jsx` | Renderiza os campos; controla erros, foco, estado do botão, envio, sucesso e falha. |
| `src/components/MagneticSubmitButton.jsx` | Botão de envio nativo com preenchimento animado, deslocamento magnético por Motion, texto que desaparece e ícone Send centralizado no hover/foco; reduz o movimento quando solicitado pelo sistema. |
| `src/utils/contactSchema.js` | Centraliza as regras Zod e as funções de validação. |
| `src/utils/contactSubmission.js` | Obtém e valida o formato do endpoint, envia a requisição HTTP e trata respostas recusadas/falhas de rede. |
| `src/utils/test/Contato.test.jsx` | Testa a interação da interface com a validação e o fluxo de submissão. |
| `src/utils/test/contactSchema.test.js` | Testa diretamente as regras e funções do schema Zod. |
| `src/utils/test/contactSubmission.test.js` | Testa o contrato HTTP do envio para o Basin usando `fetch` simulado. |
| `docs/BASIN_FORM_SETUP.md` | Guia de configuração do Basin, variável de ambiente, destinatário e notificação. |

## 3. Visão geral do fluxo

```text
Pessoa preenche o formulário
        |
        v
Validação nativa do HTML
(required, type=email, minLength, maxLength)
        |
        v
Zod valida os valores e remove espaços externos
        |
        +-- Inválido --> Mensagens de campo; não envia
        |
        v
FormData recebe os valores normalizados do Zod
e mantém o campo oculto "origem"
        |
        v
contactSubmission.js
valida o formato do endpoint e executa POST
        |
        v
Basin recebe a submissão e aplica
as configurações do serviço
        |
        +-- Rejeição/erro de rede --> Interface mostra erro
        |
        v
Resposta aceita --> Interface confirma o envio
e limpa os campos
```

A validação nativa do navegador pode impedir um envio inválido antes de o evento chegar ao handler React. O Zod permanece importante porque centraliza regras reutilizáveis, apresenta erros consistentes e valida novamente os dados no fluxo de submissão.

## 4. Campos enviados

Os campos visíveis enviados ao Basin são:

| Chave | Regra Zod | Finalidade |
|---|---|---|
| `nome` | Texto entre 2 e 100 caracteres | Nome de quem está entrando em contato. |
| `email` | Texto obrigatório, até 254 caracteres, com formato de e-mail válido | Endereço para permitir uma resposta. O nome da chave precisa continuar como `email`. |
| `assunto` | Texto entre 3 e 120 caracteres | Assunto da mensagem. |
| `mensagem` | Texto entre 10 e 4.000 caracteres | Conteúdo da mensagem. |

Também é enviado o campo oculto `origem`, com o valor `KLEBER DEV — página de contato`. Ele é um metadado para identificar a origem da mensagem, **não é um honeypot nem uma barreira antispam**.

O objeto validado pelo Zod contém somente os quatro campos visíveis. Na submissão, o código atualiza esses campos no `FormData` com os valores normalizados, preservando o campo oculto `origem`.

As regras detalhadas estão em `src/utils/contactSchema.js` e em [Validação com Zod — formulário de contato](./validacao-zod-formulario-contato.md).

## 5. Como a interface usa o Zod

### Enquanto a pessoa preenche

- `onBlur`: valida o campo que acabou de perder o foco e marca esse campo como visitado.
- `onChange`: recalcula a validade do formulário completo. Se o campo já foi visitado ou já apresenta erro, atualiza a mensagem conforme o valor corrigido.
- Depois da primeira interação, o botão fica desabilitado enquanto algum campo for inválido; quando todos passam pela validação, volta a ficar habilitado.
- Quando o endpoint do Basin tem formato válido, o botão começa habilitado na tela inicial. A validação nativa do navegador continua ativa, portanto esse estado inicial não faz com que campos obrigatórios inválidos sejam enviados.

### Comportamento visual do botão

O botão é renderizado por `src/components/MagneticSubmitButton.jsx`, mantendo o elemento nativo `button[type="submit"]` e os estados de habilitado/desabilitado definidos em `Contato.jsx`. O preenchimento bronze se expande a partir da região do cursor, o botão acompanha discretamente o mouse com springs, e a cor do conteúdo muda durante hover/foco. O rótulo desliza e desaparece enquanto o ícone `Send` se move para o centro geométrico do botão, sem depender da largura do texto. O ícone continua decorativo para tecnologias assistivas e o rótulo mantém o nome acessível do botão. O movimento magnético do botão é desativado quando `prefers-reduced-motion` está ativo; o preenchimento e as transições tornam-se praticamente imediatos. Esses efeitos não substituem nem alteram a validação, a requisição Basin ou os estados de envio/sucesso/falha.

### Ao tentar enviar

1. O handler impede a submissão HTML padrão e verifica se o endpoint está configurado e se já existe um envio em andamento.
2. O formulário inteiro passa por `validateContactForm()`.
3. Se houver erros, eles são associados aos campos; o primeiro campo inválido recebe foco e não é realizada a requisição.
4. Se estiver válido, o código substitui no `FormData` os valores visíveis pelos dados normalizados em `validation.data`.
5. O botão fica desabilitado durante o envio para evitar duas requisições simultâneas pela interface.
6. O resultado é mostrado como sucesso ou falha. No sucesso, os campos e os estados de erro são limpos; na falha, a interface oferece uma mensagem acessível e permite tentar novamente.

## 6. Como o envio ao Basin funciona

A função `getBasinFormEndpoint()`, em `src/utils/contactSubmission.js`, lê a variável de ambiente `VITE_BASIN_FORM_ENDPOINT` e remove os espaços externos.

A função `isValidBasinFormEndpoint()` aceita apenas endpoints no formato HTTPS `https://usebasin.com/f/ID`, com identificador composto pelos caracteres previstos na expressão regular. Ela valida o **formato** da URL, não confirma por conta própria que o formulário existe ou que a conta está configurada corretamente.

`submitContactForm()`:

1. Recusa o envio se o endpoint não passar pela verificação de formato ou se `fetch` não estiver disponível.
2. Executa um `POST` para o endpoint, com o cabeçalho `Accept: application/json` e o objeto `FormData` como corpo.
3. Considera a resposta rejeitada se o HTTP não estiver em estado de sucesso ou se o JSON retornado contiver explicitamente `success: false`.
4. Propaga erros de rede para que `Contato.jsx` mostre a mensagem de falha.

Os testes de `contactSubmission.js` usam um `fetch` simulado; eles não fazem envios reais nem confirmam a entrega de e-mail.

### Variável de ambiente

O nome utilizado no projeto é:

```env
VITE_BASIN_FORM_ENDPOINT=https://usebasin.com/f/ID-DO-FORMULARIO
```

Use o endpoint real apenas nos arquivos de ambiente locais e nas configurações de ambiente do Vercel. O valor não é um segredo: variáveis com prefixo `VITE_` ficam acessíveis no bundle enviado ao navegador. Não coloque senhas, tokens ou credenciais nessa variável.

Para os passos do painel, destinatário, personalização das notificações, configuração por ambiente e teste real, consulte [Configuração do formulário Basin](../../docs/BASIN_FORM_SETUP.md).

## 7. Configuração atual do Basin

Conforme confirmado pelo responsável pelo projeto em 29/10/2026:

- O destinatário das notificações está configurado.
- O conteúdo da notificação foi personalizado.
- O filtro de duplicados está ativado. De acordo com a opção selecionada no painel, submissões subsequentes com conteúdo idêntico em até 10 minutos são marcadas como spam.
- Foi realizado um envio de teste e o resultado foi confirmado como correto.

O estado de outras opções do painel não foi auditado nesta tarefa. Não presumir que CAPTCHA, Turnstile, honeypot ou filtros opcionais adicionais estejam configurados.

### Decisão de segurança

Manter a configuração atual e acompanhar periodicamente a pasta Spam e a chegada de mensagens legítimas. CAPTCHA/Turnstile e outras camadas adicionais só devem ser considerados se houver uma necessidade concreta, como spam recorrente ou falsos positivos.

A validação no navegador melhora a experiência e a consistência dos dados, mas pode ser contornada por uma requisição direta. Ela não substitui validação do lado do servidor; o recebimento e as proteções fornecidas pelo Basin permanecem sob responsabilidade do serviço.

## 8. Como testar o formulário

Execute os comandos a partir da raiz do repositório, onde fica o `package.json`.

Testar apenas a validação Zod:

```bash
npm test -- src/utils/test/contactSchema.test.js
```

Testar o componente React e o fluxo da interface:

```bash
npm test -- src/utils/test/Contato.test.jsx
```

Testar o envio HTTP simulado:

```bash
npm test -- src/utils/test/contactSubmission.test.js
```

Executar toda a suíte:

```bash
npm test
```

Os testes automatizados são complementares ao teste real já realizado no Basin: os testes de componente e de envio usam mocks, por isso não verificam as configurações do painel nem a entrega externa da notificação.
