const TOOL_LIST = [
  'merge',
  'split',
  'compress',
  'pdf-to-word',
  'word-to-pdf',
  'pdf-to-image',
  'image-to-pdf',
  'rotate',
  'unlock',
  'watermark',
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return Response.json({
        ok: true,
        service: 'talksyrapdf-worker',
        tools: TOOL_LIST,
        timestamp: new Date().toISOString(),
      });
    }

    if (url.pathname === '/api/tools') {
      return Response.json({
        ok: true,
        tools: TOOL_LIST,
      });
    }

    if (url.pathname === '/api/process') {
      const body = await request.json().catch(() => ({}));
      return Response.json({
        ok: true,
        received: true,
        tool: body.tool || 'unknown',
        message: 'Worker endpoint is available for real PDF processing integration.',
      });
    }

    return env.ASSETS.fetch(request);
  },
};
