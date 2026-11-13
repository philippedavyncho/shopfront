import type { APIRoute } from 'astro';
import { backendRequest, copyJsonResponse, jsonError, sameOrigin } from '../../../lib/bff';
export const DELETE: APIRoute = async ({ request, cookies, params }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  return copyJsonResponse(await backendRequest(cookies, `/addresses/${encodeURIComponent(params.id || '')}/`, { method: 'DELETE' }, request));
};
