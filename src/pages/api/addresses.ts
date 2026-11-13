import type { APIRoute } from 'astro';
import { backendRequest, copyJsonResponse, jsonError, sameOrigin } from '../../lib/bff';
export const GET: APIRoute = async ({ request, cookies }) => copyJsonResponse(await backendRequest(cookies, '/addresses/', {}, request));
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  return copyJsonResponse(await backendRequest(cookies, '/addresses/', { method: 'POST', body: await request.text() }, request));
};
