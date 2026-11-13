import type { APIRoute } from 'astro';
import { backendRequest, copyJsonResponse, jsonError, sameOrigin } from '../../lib/bff';
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  return copyJsonResponse(await backendRequest(cookies, '/orders/checkout/', { method: 'POST', body: await request.text() }, request));
};
