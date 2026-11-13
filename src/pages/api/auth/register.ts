import type { APIRoute } from 'astro';
import { apiBase, jsonError, readJson, sameOrigin } from '../../../lib/bff';

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  const data = await readJson(request);
  if (!data) return jsonError('Informations d’inscription invalides.');
  try {
    const upstream = await fetch(`${apiBase}/auth/register/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), cache: 'no-store', signal: AbortSignal.timeout(9000) });
    return new Response(upstream.body, { status: upstream.status, headers: { 'Content-Type': upstream.headers.get('content-type') || 'application/json', 'Cache-Control': 'no-store' } });
  } catch { return jsonError('Le service d’inscription est momentanément indisponible.', 503); }
};
