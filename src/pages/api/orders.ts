import type { APIRoute } from 'astro';
import { backendRequest, copyJsonResponse } from '../../lib/bff';
export const GET: APIRoute = async ({ request, cookies }) => copyJsonResponse(await backendRequest(cookies, '/orders/', {}, request));
