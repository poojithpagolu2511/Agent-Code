import { HindsightClient } from '@vectorize-io/hindsight-client';

/**
 * Helper to get Hindsight configuration safely from environment.
 * The API key is strictly server-side and never exposed to clients.
 */
export function getHindsightConfig() {
  const apiKey = (process.env.HINDSIGHT_API_KEY || '').trim();
  const baseUrl = (process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io').trim();
  const bankId = (process.env.HINDSIGHT_BANK_ID || 'memorycode-team-rules').trim();
  const isConfigured = Boolean(apiKey);

  return {
    apiKey,
    baseUrl,
    bankId,
    isConfigured
  };
}

let cachedClient = null;
let lastApiKey = null;
let lastBaseUrl = null;

export function getHindsightClient() {
  const { apiKey, baseUrl, isConfigured } = getHindsightConfig();
  if (!isConfigured) {
    return null;
  }

  if (!cachedClient || lastApiKey !== apiKey || lastBaseUrl !== baseUrl) {
    cachedClient = new HindsightClient({
      apiKey,
      baseUrl,
      userAgent: 'memorycode-ai-review/1.0.0'
    });
    lastApiKey = apiKey;
    lastBaseUrl = baseUrl;
  }

  return cachedClient;
}

/**
 * Parse JSON body from request if not already parsed by express.json()
 */
async function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/**
 * Core request dispatcher for /api/hindsight/* routes.
 * Works seamlessly in both Express (server.js) and Connect (vite.config.ts).
 */
export async function handleHindsightRequest(req, res) {
  const parsedUrl = new URL(req.url, 'http://localhost');
  const pathname = parsedUrl.pathname.replace(/^\/api\/hindsight/, '') || '/';
  const method = req.method;

  const { isConfigured, bankId, baseUrl } = getHindsightConfig();
  const client = getHindsightClient();

  // 1. Status Check: GET /status or GET /
  if (method === 'GET' && (pathname === '/status' || pathname === '/' || pathname === '')) {
    if (!isConfigured || !client) {
      return sendJson(res, 200, {
        configured: false,
        connected: false,
        bankId,
        baseUrl,
        message: 'HINDSIGHT_API_KEY is not configured in server environment. Local memory fallback is active.'
      });
    }

    try {
      // Test connectivity safely
      const version = await client.getVersion();
      return sendJson(res, 200, {
        configured: true,
        connected: true,
        bankId,
        baseUrl,
        version: version?.version || '1.0.0',
        message: 'Connected to Hindsight Cloud memory cluster.'
      });
    } catch (err) {
      console.warn('[Hindsight] Connectivity check warning:', err?.message || err);
      return sendJson(res, 200, {
        configured: true,
        connected: false,
        bankId,
        baseUrl,
        message: `Hindsight API key provided but connection check returned: ${err?.message || 'Unavailable'}. Fallback active.`
      });
    }
  }

  // 2. Recall Memories: POST /recall
  if (method === 'POST' && pathname === '/recall') {
    const body = await parseBody(req);
    const { query, tags, maxTokens } = body || {};

    if (!query || typeof query !== 'string') {
      return sendJson(res, 400, {
        success: false,
        error: 'Missing required field "query" in request body.'
      });
    }

    if (!isConfigured || !client) {
      return sendJson(res, 200, {
        success: false,
        fallback: true,
        results: [],
        message: 'Hindsight is not configured. Use local memory fallback.'
      });
    }

    try {
      const targetBankId = body.bankId || bankId;
      const recallOptions = {};
      if (Array.isArray(tags) && tags.length > 0) {
        recallOptions.tags = tags;
      }
      if (typeof maxTokens === 'number' && maxTokens > 0) {
        recallOptions.maxTokens = maxTokens;
      }

      const response = await client.recall(targetBankId, query, recallOptions);
      return sendJson(res, 200, {
        success: true,
        fallback: false,
        results: response.results || [],
        total: response.results ? response.results.length : 0
      });
    } catch (err) {
      console.error('[Hindsight] Recall failed safely:', err?.message || err);
      return sendJson(res, 200, {
        success: false,
        fallback: true,
        error: 'Hindsight recall failed. Reverting to local heuristic memory.',
        results: []
      });
    }
  }

  // 3. Retain Memory: POST /retain
  if (method === 'POST' && pathname === '/retain') {
    const body = await parseBody(req);
    const { content, context, metadata, tags } = body || {};

    if (!content || typeof content !== 'string') {
      return sendJson(res, 400, {
        success: false,
        error: 'Missing required field "content" in request body.'
      });
    }

    if (!isConfigured || !client) {
      return sendJson(res, 200, {
        success: false,
        fallback: true,
        message: 'Hindsight is not configured. Retained in local memory only.'
      });
    }

    try {
      const targetBankId = body.bankId || bankId;
      const retainOptions = {};
      if (context && typeof context === 'string') {
        retainOptions.context = context;
      }
      if (metadata && typeof metadata === 'object') {
        retainOptions.metadata = metadata;
      }
      if (Array.isArray(tags) && tags.length > 0) {
        retainOptions.tags = tags;
      }

      const response = await client.retain(targetBankId, content, retainOptions);
      return sendJson(res, 200, {
        success: true,
        fallback: false,
        bankId: targetBankId,
        data: response
      });
    } catch (err) {
      console.error('[Hindsight] Retain failed safely:', err?.message || err);
      return sendJson(res, 200, {
        success: false,
        fallback: true,
        error: 'Hindsight retain failed. Saved to local storage fallback.'
      });
    }
  }

  // 4. List Memories: GET /memories
  if (method === 'GET' && pathname === '/memories') {
    if (!isConfigured || !client) {
      return sendJson(res, 200, {
        success: false,
        fallback: true,
        items: [],
        total: 0,
        message: 'Hindsight is not configured.'
      });
    }

    try {
      const targetBankId = parsedUrl.searchParams.get('bankId') || bankId;
      const limit = parseInt(parsedUrl.searchParams.get('limit') || '50', 10);
      const offset = parseInt(parsedUrl.searchParams.get('offset') || '0', 10);

      const response = await client.listMemories(targetBankId, { limit, offset });
      return sendJson(res, 200, {
        success: true,
        fallback: false,
        items: response.items || [],
        total: response.total || 0,
        limit,
        offset
      });
    } catch (err) {
      console.error('[Hindsight] ListMemories failed safely:', err?.message || err);
      return sendJson(res, 200, {
        success: false,
        fallback: true,
        error: 'Hindsight listMemories failed.',
        items: [],
        total: 0
      });
    }
  }

  // Route not found
  return sendJson(res, 404, {
    error: `Hindsight route not found: ${method} ${pathname}`
  });
}
