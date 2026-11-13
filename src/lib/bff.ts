import type { AstroCookies } from 'astro';

export const apiBase = (import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '');
const accessName = 'mm_access';
const refreshName = 'mm_refresh';
function isSecureRequest(request?: Request) {
  if (!request) return false;
  const forwarded = request.headers.get('x-forwarded-proto')?.split(',')[0].trim().toLowerCase();
  return new URL(request.url).protocol === 'https:' || forwarded === 'https';
}

export function saveTokens(cookies: AstroCookies, data: { access?: string; refresh?: string }, request?: Request) {
  const options = (maxAge: number) => ({ httpOnly: true, secure: isSecureRequest(request), sameSite: 'lax' as const, path: '/api', maxAge });
  if (data.access) cookies.set(accessName, data.access, options(15 * 60));
  if (data.refresh) cookies.set(refreshName, data.refresh, options(7 * 24 * 60 * 60));
}

export function clearTokens(cookies: AstroCookies) {
  cookies.delete(accessName, { path: '/api' });
  cookies.delete(refreshName, { path: '/api' });
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  try { return !!origin && new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

export function jsonError(message: string, status = 400) {
  return Response.json({ detail: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function backendRequest(cookies: AstroCookies, path: string, init: RequestInit = {}, request?: Request) {
  const requestWithToken = (token: string) => fetch(`${apiBase}${path}`, {
    ...init,
    headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers, Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal: init.signal || AbortSignal.timeout(9000),
  });
  const access = cookies.get(accessName)?.value;
  if (access) try {
    const first = await requestWithToken(access);
    if (first.status !== 401) return first;
    await first.body?.cancel();
  } catch { return Response.json({ detail: 'API indisponible.' }, { status: 503 }); }
  const refresh = cookies.get(refreshName)?.value;
  if (!refresh) return Response.json({ detail: 'Connexion requise.' }, { status: 401 });
  try {
    const renewed = await fetch(`${apiBase}/auth/token/refresh/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh }),
      cache: 'no-store', signal: AbortSignal.timeout(9000),
    });
    if (!renewed.ok) { clearTokens(cookies); return Response.json({ detail: 'Session expirée.' }, { status: 401 }); }
    const tokens = await renewed.json();
    saveTokens(cookies, tokens, request);
    return await requestWithToken(tokens.access);
  } catch {
    return Response.json({ detail: 'API indisponible.' }, { status: 503 });
  }
}

export function copyJsonResponse(response: Response) {
  return new Response(response.body, { status: response.status, headers: { 'Content-Type': response.headers.get('content-type') || 'application/json', 'Cache-Control': 'no-store' } });
}

export async function readJson(request: Request) {
  try { return await request.json(); } catch { return undefined; }
}
