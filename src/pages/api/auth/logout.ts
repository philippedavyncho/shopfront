import type { APIRoute } from 'astro';
import { apiBase, clearTokens, jsonError, sameOrigin } from '../../../lib/bff';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  const refresh = cookies.get('mm_refresh')?.value;
  clearTokens(cookies);
  if (refresh) {
    try { await fetch(`${apiBase}/auth/token/blacklist/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh }), cache: 'no-store', signal: AbortSignal.timeout(5000) }); } catch { /* local session is cleared even when API is offline */ }
  }
  return Response.json({ authenticated: false }, { headers: { 'Cache-Control': 'no-store' } });
};
