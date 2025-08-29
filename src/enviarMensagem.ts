import docgo from "docgo-sdk";

async function httpPost(url: string, body: any, token: string): Promise<any> {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "DocGo-Slack-App/1.0",
  };

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!resp.ok) throw new Error(`Falha HTTP ${resp.status}`);
  return resp.json();
}

async function enviarMensagem(): Promise<void> {
  try {
    const validation = docgo.validateParams();
    if (!validation.valid) {
      console.log(docgo.result(false, null, validation.error));
      return;
    }

    const token = docgo.getEnv("SLACK_TOKEN");
    if (!token) {
      console.log(
        docgo.result(
          false,
          null,
          "Token do Slack não configurado (SLACK_TOKEN)"
        )
      );
      return;
    }

    const canal = docgo.getParam("canal") as string;
    if (!canal) {
      console.log(docgo.result(false, null, "Canal é obrigatório"));
      return;
    }

    const texto = docgo.getParam("texto") as string;
    if (!texto) {
      console.log(docgo.result(false, null, "Texto é obrigatório"));
      return;
    }

    const url = "https://slack.com/api/chat.postMessage";
    const body = {
      channel: canal,
      text: texto,
    };

    const response = await httpPost(url, body, token);

    if (!response.ok) {
      console.log(
        docgo.result(false, null, `Erro do Slack: ${response.error}`)
      );
      return;
    }

    console.log(
      docgo.result(true, {
        canal,
        texto,
        timestamp: response.ts,
        sucesso: true,
      })
    );
  } catch (error: any) {
    console.log(docgo.result(false, null, error.message));
  }
}

enviarMensagem();
