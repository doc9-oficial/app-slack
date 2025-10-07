import docgo from "docgo-sdk";

interface EnviarMensagemParams {
  canal: string;
  mensagem: string;
  threadTs?: string;
  blocks?: any[];
  attachments?: any[];
  webhook?: string;
}

async function enviarMensagemSlack(params: EnviarMensagemParams): Promise<any> {
  const webhook = params.webhook || docgo.getEnv("SLACK_WEBHOOK_URL") || docgo.getEnv("slackWebhookUrl");
  
  if (webhook) {
    return enviarViaWebhook(webhook, params);
  } else {
    return enviarViaAPI(params);
  }
}

async function enviarViaWebhook(webhookUrl: string, params: EnviarMensagemParams): Promise<any> {
  const payload: any = {
    text: params.mensagem,
    channel: params.canal,
  };

  if (params.blocks && params.blocks.length > 0) {
    payload.blocks = params.blocks;
  }

  if (params.attachments && params.attachments.length > 0) {
    payload.attachments = params.attachments;
  }

  if (params.threadTs) {
    payload.thread_ts = params.threadTs;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Falha HTTP ${response.status}: ${response.statusText}`);
  }

  const text = await response.text();
  if (text === "ok") {
    return { 
      ok: true, 
      ts: new Date().getTime() / 1000
    };
  } else {
    throw new Error(`Erro do Webhook: ${text}`);
  }
}

async function enviarViaAPI(params: EnviarMensagemParams): Promise<any> {
  const token = docgo.getEnv("SLACK_BOT_TOKEN") || docgo.getEnv("slackBotToken");
  if (!token) {
    throw new Error(
      "Token do Slack não configurado. Configure a variável SLACK_BOT_TOKEN ou slackBotToken, ou forneça um webhook URL"
    );
  }

  const baseUrl = docgo.getEnv("SLACK_BASE_URL") || docgo.getEnv("slackBaseUrl") || "https://slack.com/api";

  const url = `${baseUrl}/chat.postMessage`;

  const payload: any = {
    channel: params.canal,
    text: params.mensagem,
  };

  if (params.threadTs) {
    payload.thread_ts = params.threadTs;
  }

  if (params.blocks && params.blocks.length > 0) {
    payload.blocks = params.blocks;
  }

  if (params.attachments && params.attachments.length > 0) {
    payload.attachments = params.attachments;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Falha HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`Erro do Slack: ${result.error}`);
  }

  return result;
}

async function enviarMensagem(params: EnviarMensagemParams): Promise<void> {
  if (Array.isArray(params) && params.length === 1 && typeof params[0] === 'object') {
    params = params[0];
  }
  try {
    const webhook = params.webhook || docgo.getEnv("SLACK_WEBHOOK_URL") || docgo.getEnv("slackWebhookUrl");
    const token = docgo.getEnv("SLACK_BOT_TOKEN") || docgo.getEnv("slackBotToken");
    
    if (!webhook && !token) {
      console.log(docgo.result(false, null, 
        "É necessário configurar um token de bot (SLACK_BOT_TOKEN) ou uma URL de webhook (SLACK_WEBHOOK_URL)"
      ));
      return;
    }

    if (!params.canal && !webhook) {
      console.log(docgo.result(false, null, "É necessário informar o canal"));
      return;
    }

    if (!params.mensagem) {
      console.log(
        docgo.result(false, null, "É necessário informar a mensagem")
      );
      return;
    }

    const resultado = await enviarMensagemSlack(params);

    const resposta = {
      sucesso: true,
      canal: params.canal,
      mensagem: params.mensagem,
      timestamp: resultado.ts,
      threadTs: resultado.message?.thread_ts,
      messageId: resultado.message?.ts,
      slackResponse: resultado,
    };

    console.log(docgo.result(true, resposta));
  } catch (error: any) {
    console.log(docgo.result(false, null, error.message));
  }
}

export default enviarMensagem;
