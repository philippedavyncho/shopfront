import type { APIRoute } from 'astro';
import { backendRequest, copyJsonResponse, jsonError, sameOrigin } from '../../lib/bff';
export const GET: APIRoute = async ({ request, cookies }) => copyJsonResponse(await backendRequest(cookies, '/cart/', {}, request));
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  return copyJsonResponse(await backendRequest(cookies, '/cart/', { method: 'POST', body: await request.text() }, request));
};
export const PUT: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  return copyJsonResponse(await backendRequest(cookies, '/cart/', { method: 'PUT', body: await request.text() }, request));
};
export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  return copyJsonResponse(await backendRequest(cookies, '/cart/', { method: 'PATCH', body: await request.text() }, request));
};
export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return jsonError('Origine de requête invalide.', 403);
  const url = new URL(request.url); const query = url.searchParams.get('variant_id');
  return copyJsonResponse(await backendRequest(cookies, `/cart/${query ? `?variant_id=${encodeURIComponent(query)}` : ''}`, { method: 'DELETE' }, request));
};
