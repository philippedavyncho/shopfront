import type { APIRoute } from 'astro';
import { backendRequest, copyJsonResponse, jsonError, sameOrigin } from '../../../lib/bff';
export const GET: APIRoute = async ({ request, cookies }) => copyJsonResponse(await backendRequest(cookies, '/auth/profile/', {}, request));
export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  const upstream = await backendRequest(cookies, '/auth/profile/', { method: 'PATCH', body: await request.text() }, request);
  return copyJsonResponse(upstream);
};
