export const prerender = false;

export const POST = async ({ request, locals }) => {
  // Cloudflare Pages の環境変数から取得
  const env = locals.runtime.env;
  const OPENAI_API_KEY = env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "APIキーが設定されていません。" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { messages } = await request.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "あなたは和-NodeのAIコンシェルジュです。心理カウンセラーのように傾聴し、ICTコンサルタントのように整理してください。丁寧な日本語で、相手に寄り添った対応を心がけてください。最後に必要に応じて無料相談（LINEまたはフォーム）を案内してください。" 
          },
          ...messages
        ],
        stream: true,
      }),
    });

    // ストリーミングレスポンスを返す
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
