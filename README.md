# Slack App - DocGo

Aplicação para envio de mensagens para canais do Slack via API.

## 🚀 Funcionalidades

- ✅ Envio de mensagens para canais do Slack
- ✅ Suporte a threads (respostas)
- ✅ Validação de parâmetros
- ✅ Tratamento de erros
- ✅ Integração com DocGo SDK

## 📋 Funções Disponíveis

### `enviarMensagem`

Envia uma mensagem para um canal do Slack.

**Parâmetros:**

- `canal` (obrigatório): Nome ou ID do canal (ex: #geral ou C1234567890)
- `mensagem` (obrigatório): Texto da mensagem

## ⚙️ Configuração

### Variáveis de Ambiente

Configure as seguintes variáveis de ambiente:

```bash
# Token do Bot do Slack (obrigatório)
SLACK_BOT_TOKEN=xoxb-your-bot-token-here

# URL base da API do Slack (opcional, padrão: https://slack.com/api)
SLACK_BASE_URL=https://slack.com/api
```

### Como Obter o Token do Bot

1. Acesse [api.slack.com](https://api.slack.com)
2. Crie um novo app ou use um existente
3. Vá para "OAuth & Permissions"
4. Adicione os seguintes scopes:
   - `chat:write` - Para enviar mensagens
   - `chat:write.public` - Para enviar em canais públicos
5. Instale o app no workspace
6. Copie o "Bot User OAuth Token"

## 🏗️ Build

```bash
# Build do projeto
./build.sh

# Ou manualmente
npm install
npx tsc
```

## 📝 Exemplo de Uso

```typescript
import enviarMensagem from "./dist/enviarMensagem.js";

// Enviar mensagem simples
await enviarMensagem({
  canal: "#geral",
  mensagem: "Olá pessoal! 👋",
});

// Responder em thread
await enviarMensagem({
  canal: "#geral",
  mensagem: "Esta é uma resposta em thread",
  threadTs: "1234567890.123456",
});
```

## 🔧 Estrutura do Projeto

```
slack/
├── src/
│   └── enviarMensagem.ts    # Função principal
├── dist/                    # Arquivos compilados
├── manifest.json           # Configuração do app
├── package.json           # Dependências
├── tsconfig.json          # Configuração TypeScript
├── build.sh              # Script de build
└── README.md             # Documentação
```

## 📊 Resposta da API

A função retorna:

```json
{
  "sucesso": true,
  "canal": "#geral",
  "mensagem": "Olá pessoal! 👋",
  "timestamp": "1234567890.123456",
  "threadTs": null,
  "messageId": "1234567890.123456",
  "slackResponse": {
    "ok": true,
    "channel": "C1234567890",
    "ts": "1234567890.123456",
    "message": {
      "text": "Olá pessoal! 👋",
      "user": "U1234567890",
      "ts": "1234567890.123456"
    }
  }
}
```

## 🚨 Tratamento de Erros

A função trata os seguintes erros:

- **Token não configurado**: Verifica se `SLACK_BOT_TOKEN` está definido
- **Parâmetros obrigatórios**: Valida canal e mensagem
- **Erros HTTP**: Trata falhas de conexão
- **Erros da API Slack**: Trata erros específicos do Slack

## 📚 Documentação da API Slack

- [chat.postMessage](https://api.slack.com/methods/chat.postMessage)
- [Bot Tokens](https://api.slack.com/authentication/token-types#bot)
- [Scopes](https://api.slack.com/scopes)
