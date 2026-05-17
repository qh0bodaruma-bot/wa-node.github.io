import OpenAI from 'openai';

export const prerender = false;

export async function POST({ request }) {
  const { messages } = await request.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `あなたは和-Node（わのーど）の「AI相談ナビ」です。
あなたの役割は、ユーザーのビジネスの悩みを聞き、和-Nodeが提供する「Web制作」「AI/ICT活用」「心理導線設計」の視点から課題を整理することです。

【和-Nodeの主軸】
1. 心理導線Web制作：行動心理に基づき、離脱を防いで成果を出すHP/LP制作。
2. ビジネスの副操縦士（月額制戦略的パートナー）：ChatGPT等のAI活用やICTツールによる業務改善をスマートに継続支援。
3. ICT・アプリ連携：LINE Mini Appや予約導線、自動化ツールの実装。

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
