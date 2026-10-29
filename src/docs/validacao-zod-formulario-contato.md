# Validação com Zod — formulário de contato

> Documentação do schema, das funções de validação e dos testes automatizados do Zod no KLEBER DEV.
>
> Última revisão: 29/10/2026.

## 1. Objetivo

O Zod foi adotado para que as regras dos campos do formulário de contato fiquem centralizadas em um único lugar e possam ser reutilizadas durante a digitação, ao sair de um campo e antes do envio ao Basin.

A dependência declarada em `package.json` é `zod@^4.6.7`. O projeto utiliza JavaScript/JSX, não TypeScript.

O Zod **não envia mensagens**. Ele valida e normaliza os dados. O componente React apresenta os erros e controla a experiência; a função de submissão envia os valores aceitos ao Basin.

## 2. Arquivos importantes

| Caminho | O que faz |
|---|---|
| `src/utils/contactSchema.js` | Define o schema e exporta `validateContactForm`, `validateContactField` e `getContactFieldErrors`. |
| `src/pages/contato/Contato.jsx` | Chama as funções de validação em `onBlur`, `onChange` e antes da submissão; apresenta as mensagens no formulário. |
| `src/utils/contactSubmission.js` | Faz o envio HTTP ao Basin depois que os dados foram validados pelo componente. |
| `src/utils/test/contactSchema.test.js` | Testes unitários diretos do schema e de suas funções. |
| `src/utils/test/Contato.test.jsx` | Testes de integração do comportamento da interface com a validação. |
| `src/utils/test/contactSubmission.test.js` | Testes da camada HTTP associada ao fluxo do formulário; utiliza `fetch` simulado e não é uma suíte exclusivamente do Zod. |

## 3. Regras atuais do schema

O schema é definido em `src/utils/contactSchema.js` como `contactSchema = z.object(...)`.

| Campo | Operações e limites | Mensagens principais |
|---|---|---|
| `nome` | `z.string().trim().min(2).max(100)` | Solicita pelo menos 2 caracteres ou informa o limite de 100. |
| `email` | `z.string().trim().min(1).max(254).pipe(z.email(...))` | Exige e-mail preenchido, com até 254 caracteres e formato válido. |
| `assunto` | `z.string().trim().min(3).max(120)` | Exige assunto com pelo menos 3 e no máximo 120 caracteres. |
| `mensagem` | `z.string().trim().min(10).max(4000)` | Exige mensagem com pelo menos 10 e no máximo 4.000 caracteres. |

Os textos exatos das mensagens estão definidos no código para que a interface possa apresentá-los diretamente. Os limites também estão alinhados aos atributos nativos do HTML nos campos de `Contato.jsx` (`required`, `type="email"`, `minLength` e `maxLength`).

### Por que usamos `trim()`

`trim()` remove espaços no começo e no fim do texto. Assim, um nome como `"  Kleber Gonçalves  "` é devolvido como `"Kleber Gonçalves"`, e espaços externos não fazem parte do valor que será enviado.

O teste de normalização verifica não só o sucesso da validação, mas também que o objeto retornado contém os valores limpos.

### Por que usamos `safeParse()`

`safeParse()` valida sem depender de uma exceção para o fluxo normal de dados inválidos. O resultado informa sucesso ou falha:

- Se `success === true`, `data` contém os valores validados/normalizados.
- Se `success === false`, `error.issues` contém os problemas encontrados, incluindo o caminho do campo e a mensagem.

No envio, o componente só usa os valores de `validation.data` depois de confirmar que a validação passou.

## 4. Funções exportadas em `contactSchema.js`

### `contactSchema`

É a definição central das regras dos quatro campos. Para mudar limites ou mensagens, comece por esse objeto e atualize os atributos HTML e os testes correspondentes.

### `validateContactForm(values)`

Executa `contactSchema.safeParse(values)` no formulário completo. É utilizada para recalcular se o formulário está válido e para fazer a validação final antes do envio.

### `validateContactField(fieldName, value)`

Valida apenas o campo indicado, utilizando o schema desse campo. Retorna a primeira mensagem de erro ou `null` quando está válido. Se o nome não fizer parte do schema, também retorna `null`; por isso, os campos que a interface valida devem ter os mesmos nomes definidos em `contactSchema`.

### `getContactFieldErrors(error)`

Transforma `error.issues` em um objeto indexado pelo nome dos campos, por exemplo:

```js
{
    nome: "Informe um nome com pelo menos 2 caracteres.",
    assunto: "O assunto deve ter pelo menos 3 caracteres."
}
```

A função mantém a primeira mensagem de erro de cada campo. Se não receber uma estrutura de erros reconhecida, retorna um objeto vazio.

## 5. Como o componente usa essas funções

### Ao sair do campo (`onBlur`)

O componente marca o campo como visitado, chama `validateContactField()` e atualiza a validade geral do formulário. Se o campo estiver inválido, sua mensagem fica associada ao input por meio de atributos acessíveis como `aria-invalid` e `aria-describedby`.

### Enquanto corrige o valor (`onChange`)

O componente recalcula a validade do formulário completo com `validateContactForm()`. Depois que um campo foi visitado ou já apresenta um erro, a mensagem é atualizada enquanto o usuário corrige o conteúdo.

### Ao enviar

1. O formulário completo passa novamente por `validateContactForm()`.
2. Se houver problemas, `getContactFieldErrors()` organiza as mensagens e o primeiro campo inválido recebe foco. A submissão ao Basin não é iniciada.
3. Se a validação passar, os valores em `validation.data` são copiados para o `FormData`. Isso garante que os valores normalizados cheguem ao Basin, sem apagar o campo oculto `origem`.
4. A interface então chama a camada HTTP de `contactSubmission.js`.

A validação nativa do HTML permanece ativa. Ela é uma primeira camada de feedback e pode bloquear a submissão antes do handler React quando um atributo obrigatório ou de formato não passa. O Zod compartilha regras reutilizáveis no código, mas também não substitui validação no servidor.

## 6. O que testamos

### A. Testes diretos do schema — `contactSchema.test.js`

Na última execução verificada, este arquivo continha **15 casos de teste**. Ele cobre:

- Aceitação de um objeto com todos os campos válidos.
- Remoção de espaços externos e retorno dos valores normalizados.
- Rejeição de nome vazio/apenas espaços e de nome acima de 100 caracteres.
- Rejeição de e-mail vazio, e-mail em formato inválido e e-mail acima de 254 caracteres.
- Rejeição de assunto abaixo de 3 caracteres e acima de 120 caracteres.
- Rejeição de mensagem abaixo de 10 caracteres e acima de 4.000 caracteres.
- Validação de um campo individual e suas mensagens.
- Tratamento de nomes de campo desconhecidos.
- Conversão de erros Zod em um objeto de mensagens por campo.
- Retorno de objeto vazio quando não há uma lista de problemas Zod válida para mapear.

Os casos de valores inválidos usam `it.each`, portanto cada variação é reportada como um teste separado pelo Vitest.

### B. Testes da interface — `Contato.test.jsx`

Este arquivo contém **7 casos**, incluindo:

- Estado inicial do botão e alternância para desabilitado/habilitado conforme a validade.
- Presença dos atributos nativos de validação.
- Exibição do erro ao sair de um campo e remoção após corrigi-lo.
- Bloqueio do envio quando os dados são inválidos.
- Envio dos valores normalizados e preservação das chaves esperadas pelo Basin, incluindo `origem`.
- Mensagem acessível quando a requisição falha.
- Prevenção de uma segunda requisição enquanto a primeira continua pendente.

### C. Testes da submissão HTTP — `contactSubmission.test.js`

Este arquivo contém **7 casos** relacionados ao contrato de envio, e não somente às regras do Zod. Ele testa:

- Leitura da variável de ambiente e remoção de espaços externos.
- Aceitação do formato HTTPS do Basin e rejeição de URLs inválidas.
- Requisição `POST`, cabeçalho `Accept: application/json` e preservação dos campos.
- Bloqueio do envio com endpoint inválido.
- Rejeição de respostas HTTP com falha.
- Rejeição de uma resposta que informe explicitamente `success: false`.
- Propagação de erros de rede para o componente tratar.

Esses testes substituem o `fetch` por mocks: não enviam uma mensagem externa, não acessam a conta do Basin e não provam que a notificação chegou ao e-mail.

## 7. Como executar os testes

Os comandos abaixo devem ser executados no terminal, a partir da raiz do repositório (a pasta que contém `package.json`). A dependência Zod e o Vitest já estão declarados no projeto.

### Executar somente os testes Zod

```bash
npm test -- src/utils/test/contactSchema.test.js
```

Esse é o comando principal quando a alteração é no schema, nos limites, nas mensagens ou nas funções exportadas em `contactSchema.js`.

### Executar os testes da interface de contato

```bash
npm test -- src/utils/test/Contato.test.jsx
```

Use quando mudar a forma como os erros são mostrados, como o botão reage à validade, ou como os dados normalizados são preparados para o envio.

### Executar os testes da camada Basin/HTTP

```bash
npm test -- src/utils/test/contactSubmission.test.js
```

Use quando alterar a leitura do endpoint, a validação do seu formato ou o tratamento da requisição e da resposta.

### Executar todos os testes

```bash
npm test
```

O comando executa a suíte Vitest completa do projeto.

### Modo de observação

Para deixar o Vitest observando alterações no arquivo de teste Zod:

```bash
npm run test:watch -- src/utils/test/contactSchema.test.js
```

### Cobertura de testes

Para gerar o relatório de cobertura configurado no projeto:

```bash
npm run test:coverage
```

A cobertura pode ajudar a identificar caminhos que ainda não foram exercitados, mas uma porcentagem alta não garante, por si só, que todos os comportamentos estão corretos.

## 8. Resultado de referência e manutenção

A execução CI verificada antes desta documentação, no commit `3612246`, terminou com **64 testes passando em seis arquivos**, ESLint sem erros (com cinco avisos preexistentes) e build de produção concluído. Referência: [Unit Tests — GitHub Actions run 40923705338](https://github.com/kleber-goncalves/portfolio-kg/actions/runs/40923705338). A branch executará novamente os checks após as alterações documentais; consulte a execução mais recente antes de declarar um novo resultado.

Ao alterar o schema:

1. Atualize primeiro as regras e mensagens em `src/utils/contactSchema.js`.
2. Ajuste os atributos nativos de `Contato.jsx` para continuar alinhados aos limites.
3. Atualize `contactSchema.test.js` com os casos válidos e inválidos.
4. Se mudar o comportamento da interface, revise também `Contato.test.jsx`.
5. Execute os testes relevantes e, antes de finalizar a alteração, rode `npm test`, `npm run lint` e `npm run build`.

Consulte também [Formulário de contato — React, Zod e Basin](./formulario-contato-basin-zod.md) para entender o fluxo completo.
