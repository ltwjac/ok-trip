/**
 * Cloudflare Worker — 綠林快槍手沖繩記帳本同步
 *
 * 設定：
 * 1. 建立 KV namespace，綁定名稱：EXPENSES_KV
 * 2. 部署此 Worker，將 URL 貼到 index.html 的 CLOUDFLARE_API_URL
 *
 * GET  → 讀取 greenwood_okinawa_acc
 * POST → 以 body JSON 寫入（客戶端已做 merge；Worker 存 as-is + updatedAt）
 * OPTIONS → CORS preflight
 */

const KV_KEY = 'greenwood_okinawa_acc';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (!env.EXPENSES_KV) {
      return json({ error: 'EXPENSES_KV binding missing' }, 500);
    }

    try {
      if (request.method === 'GET') {
        const raw = await env.EXPENSES_KV.get(KV_KEY);
        if (!raw) {
          return json({ rate: 0.052, expenses: [], auditLogs: [], updatedAt: 0 });
        }
        return new Response(raw, {
          headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }

      if (request.method === 'POST') {
        const body = await request.json();
        if (!body || typeof body !== 'object') {
          return json({ error: 'invalid body' }, 400);
        }
        // 客戶端負責 merge；此處存整份 + 伺服器 updatedAt
        const payload = {
          rate: typeof body.rate === 'number' ? body.rate : 0.052,
          expenses: Array.isArray(body.expenses) ? body.expenses : [],
          auditLogs: Array.isArray(body.auditLogs) ? body.auditLogs : [],
          updatedAt: Date.now(),
        };
        await env.EXPENSES_KV.put(KV_KEY, JSON.stringify(payload));
        return json({ ok: true, updatedAt: payload.updatedAt });
      }

      return json({ error: 'method not allowed' }, 405);
    } catch (e) {
      return json({ error: String(e && e.message ? e.message : e) }, 500);
    }
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
