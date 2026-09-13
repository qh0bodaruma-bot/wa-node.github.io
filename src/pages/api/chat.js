export const prerender = false;

export async function POST() {
  return Response.json(
    {
      error: 'chat_unavailable',
      message: 'AI相談ナビは現在準備中です。無料相談フォームをご利用ください。',
    },
    {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'Retry-After': '86400',
      },
    },
  );
}
