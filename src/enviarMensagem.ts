import docgo from "docgo-sdk";

interface EnviarMensagemParams {
  canal: string;
  mensagem: string;
  threadTs?: string; // Para responder em thread
  blocks?: any[]; // Para mensagens formatadas
  attachments?: any[]; // Para anexos
}

async function enviarMensagemSlack(params: EnviarMensagemParams): Promise<any> {
  const token = docgo.getEnv("SLACK_BOT_TOKEN");
  if (!token) {
    throw new Error(
      "Token do Slack não configurado. Configure a variável SLACK_BOT_TOKEN"
    );
  }

  const baseUrl = docgo.getEnv("SLACK_BASE_URL") || "https://slack.com/api";

  const url = `${baseUrl}/chat.postMessage`;

  const payload: any = {
    channel: params.canal,
    text: params.mensagem,
  };

  // Adicionar parâmetros opcionais se fornecidos
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
  if (Array.isArray(params) && typeof params[0] === "string") {
    try {
      params = JSON.parse(params[0]);
    } catch {
      // fallback: argumentos posicionais
      if (Array.isArray(params)) {
        const [canal, mensagem] = params;
        params = { canal, mensagem };
      }
    }
  }
  try {
    // Validar parâmetros obrigatórios
    if (!params.canal) {
      console.log(docgo.result(false, null, "É necessário informar o canal"));
      return;
    }

    if (!params.mensagem) {
      console.log(
        docgo.result(false, null, "É necessário informar a mensagem")
      );
      return;
    }

    // Enviar mensagem para o Slack
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
