import type { APIRoute } from 'astro';
import { backendRequest, copyJsonResponse, jsonError, sameOrigin } from '../../../lib/bff';
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  const data = await request.json().catch(() => null);
  if (!data || !Array.isArray(data.items) || data.items.length > 100) return jsonError('Panier à synchroniser invalide.');
  return copyJsonResponse(await backendRequest(cookies, '/cart/', { method: 'PUT', body: JSON.stringify(data) }, request));
};
