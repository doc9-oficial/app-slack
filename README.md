# App Slack - DocGo

Aplicação DocGo para integração com Slack, permitindo envio de mensagens para canais.

## Configuração

### Variáveis de Ambiente

- `SLACK_TOKEN`: Token de autenticação do Slack (obrigatório)

### Como obter o token do Slack

1. Acesse https://api.slack.com/apps
2. Crie uma nova app ou selecione uma existente
3. Vá em "OAuth & Permissions"
4. Adicione o escopo `chat:write`
5. Instale a app no seu workspace
6. Copie o "Bot User OAuth Token"

## Funções

### enviarMensagem

Envia uma mensagem para um canal do Slack.

**Parâmetros:**

- `canal` (string, obrigatório): Canal do Slack (ex: #geral, @usuario, ou ID do canal)
- `texto` (string, obrigatório): Texto da mensagem a ser enviada

**Exemplo de uso:**

```json
{
  "canal": "#geral",
  "texto": "Olá mundo! Esta é uma mensagem enviada via DocGo."
}
```

## Build

```bash
./build.sh
```

ou

```bash
npm install
npm run build
```
