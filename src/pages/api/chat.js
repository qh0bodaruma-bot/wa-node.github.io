import OpenAI from 'openai';

export const prerender = false;

export async function POST({ request, locals }) {
  let messages;
  try { ({ messages } = await request.json()); } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length > 30 || messages.some(message => !['user','assistant'].includes(message.role) || typeof message.content !== 'string' || message.content.length > 10000)) {
    return Response.json({ error: 'Invalid messages' }, { status: 400 });
  }
  const apiKey = locals?.runtime?.env?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json({ error: 'chat_unavailable', message: 'AI相談ナビは現在準備中です。無料相談フォームまたはLINEをご利用ください。' }, { status: 503 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `あなたは和-Node（わのーど）の「AI相談ナビ」です。
あなたの役割は、ユーザーのビジネスの悩みを聞き、和-Nodeが提供する「Web制作」「AI/ICT活用」「選ばれる導線設計」の視点から課題を整理することです。

【和-Nodeの主軸】
1. LINE連携：LINE・LIFFとSalesforce、kintone、HubSpot、Googleスプレッドシート等をつなぐ仕組み。
2. アプリ開発：iOS・Androidの業務・顧客向けアプリを、要件整理から実装・公開準備まで支援。
3. Web・LP制作：使う人が理解・比較・相談しやすい構成と操作の設計。
初回相談は30分無料。費用・期間・対応範囲は正式な見積りで確認する。

【回答のガイドライン】
- 丁寧で、心理的安全性を感じさせる誠実なトーンで話してください。
- ユーザーの漠然とした悩みを、具体的な「制作」や「改善」の切り口に分解して整理してください。
- 医療的なメンタル診断、確定的な見積り、契約の即断は行わないでください。
- 最後に必ず「より具体的な解決策は、代表の高野との無料相談（オンライン）で一緒に整理しましょう」と案内し、相談を促してください。

【制約】
- 和-Nodeに関係のない一般的な質問には、和-Nodeの活動に絡めて回答するか、簡潔に断ってください。`
        },
        ...messages
      ],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of response) {
          const text = encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`);
          controller.enqueue(text);
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
