import type { APIRoute } from 'astro';
import { apiBase, jsonError, readJson, sameOrigin, saveTokens } from '../../../lib/bff';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  const data = await readJson(request);
  if (!data?.email || !data?.password) return jsonError('E-mail et mot de passe requis.');
  try {
    const upstream = await fetch(`${apiBase}/auth/token/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), cache: 'no-store', signal: AbortSignal.timeout(9000) });
    const result = await upstream.json();
    if (!upstream.ok) return Response.json(result, { status: upstream.status, headers: { 'Cache-Control': 'no-store' } });
    saveTokens(cookies, result, request);
    return Response.json({ authenticated: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return jsonError('Le service de connexion est momentanément indisponible.', 503); }
};
