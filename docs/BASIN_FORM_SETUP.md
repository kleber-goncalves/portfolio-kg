# Configuração do formulário de contato com Basin Free

O componente de contato usa um endpoint de formulário do Basin. O endpoint é público por natureza e pode ficar no bundle do front-end; não coloque tokens, senhas ou credenciais nesta variável.

## 1. Criar o formulário no Basin

1. Entre em https://usebasin.com/ e crie uma conta Free.
2. No painel, crie um formulário chamado **KLEBER DEV — Contato**.
3. Abra a configuração/Setup do formulário e copie a URL do endpoint. Ela tem o formato `https://usebasin.com/f/ID-DO-FORMULARIO`.

Documentação oficial: https://docs.usebasin.com/getting-started/quickstart/

## 2. Configurar o e-mail que receberá as mensagens

1. Abra o formulário no painel do Basin.
2. Acesse **Emails → Notification** (a seção pode aparecer como Notification Emails).
3. Preencha **Send emails to** com o seu e-mail de destino e salve.
4. Abra o e-mail de verificação enviado pelo Basin e confirme o endereço. Os destinatários não verificados não recebem notificações.
5. Em Settings → Spam, revise e mantenha ativa a proteção básica contra spam.

Notificações de envio estão disponíveis em todos os planos, inclusive no Free: https://docs.usebasin.com/email-notifications/notifications/

## 3. Configurar no desenvolvimento local

1. Copie `.env.example` para `.env.local`.
2. Preencha `VITE_BASIN_FORM_ENDPOINT` com o endpoint real.
3. Reinicie o servidor Vite depois de alterar a variável de ambiente.

O arquivo `.env.local` é ignorado pelo Git. Não commite dados de ambiente.

## 4. Configurar no Vercel

1. Abra o projeto do portfólio no Vercel e entre em **Settings → Environment Variables**.
2. Crie `VITE_BASIN_FORM_ENDPOINT` com a URL do endpoint do Basin.
3. Selecione Production e Preview (e Development, caso utilize o Vercel CLI).
4. Salve e faça um novo deploy. Variáveis com prefixo `VITE_` são incluídas no bundle público e só passam a valer após o build.

## 5. Limites do plano gratuito

Na consulta de 27/10/2026, o plano Free listava um endpoint, 50 envios por mês e retenção dos envios por 30 dias, com filtragem básica de spam e suporte a AJAX. Verifique os limites atuais no painel e na página oficial: https://usebasin.com/pricing

## 6. Testar antes de considerar concluído

1. Faça um envio de teste pelo localhost e outro pela URL de preview do Vercel.
2. Confirme que a submissão aparece no painel Basin e que a notificação chega ao e-mail verificado.
3. Confira a caixa de spam/lixo eletrônico se a mensagem não chegar.
4. Teste erros de rede, campos obrigatórios e o estado de envio para garantir que a interface não indique sucesso sem resposta positiva do endpoint.

Até que o endpoint seja configurado, a página mostra o formulário, mantém o botão desabilitado e oferece GitHub e LinkedIn como canais alternativos. A implementação não simula um envio bem-sucedido.


## 7. Nomes dos campos enviados à notificação

O formulário envia estes nomes de campo ao Basin:

- `nome`: nome do visitante.
- `email`: e-mail do visitante. Mantenha exatamente esse nome para preservar a compatibilidade com recursos Basin que identificam o endereço do remetente.
- `assunto`: assunto informado pelo visitante.
- `mensagem`: conteúdo da mensagem.
- `origem`: campo oculto que identifica a página de contato do KLEBER DEV.

Os rótulos visíveis da interface continuam em português e não mudam com esta alteração; os nomes acima são as chaves enviadas ao Basin e aparecem nos dados da submissão/notificação. Como o campo `subject` passa a se chamar `assunto`, atualize o campo **Subject** em Emails → Notification para usar `[KLEBER DEV] {{assunto}}` (ou o prefixo que preferir). O merge tag `{{subject}}` deixará de corresponder ao campo renomeado.
