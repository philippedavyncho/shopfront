import type { APIRoute } from 'astro';
const paths = ['/', '/catalogue', '/a-propos', '/contact', '/faq', '/promotions', '/nouveautes', '/meilleures-ventes'];
export const GET: APIRoute = ({ url }) => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${url.origin}${path}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
