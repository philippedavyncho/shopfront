import { mediaUrl } from './catalog';

export const CART_KEY = 'maison-marche-cart';
export type LocalCartItem = { variant: number; name: string; price: number; sku: string; slug: string; quantity: number; currency?: string; image?: string };
export type ApiCart = { items?: { variant: number; name: string; price: string; sku: string; slug: string; quantity: number; currency?: string; image?: string }[] };

export function readLocalCart(): LocalCartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') as LocalCartItem[]; } catch { return []; }
}
export function writeLocalCart(items: LocalCartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  document.dispatchEvent(new Event('cart-updated'));
}
function hasCartSession(): boolean {
  return document.body.dataset.cartSession === 'true';
}
export function fromApiCart(data: ApiCart): LocalCartItem[] {
  const savedImages = new Map(readLocalCart().filter(item => item.image).map(item => [item.variant, item.image]));
  return (data.items || []).map(item => {
    const image = item.image || savedImages.get(item.variant);
    return { variant: item.variant, name: item.name, price: Number(item.price), sku: item.sku, slug: item.slug, quantity: item.quantity, currency: item.currency || 'XOF', image: image && !image.startsWith('http') ? `${mediaUrl}${image}` : image };
  });
}
export async function syncGuestCart(): Promise<void> {
  const guest = readLocalCart();
  if (!guest.length) return;
  const currentResponse = await fetch('/api/cart', { cache: 'no-store' });
  if (!currentResponse.ok) throw new Error('Impossible de charger votre panier connecté.');
  const current = fromApiCart(await currentResponse.json());
  const merged = new Map(current.map(item => [item.variant, item]));
  for (const item of guest) {
    const existing = merged.get(item.variant);
    merged.set(item.variant, { ...item, quantity: Math.min(50, item.quantity + (existing?.quantity || 0)) });
  }
  const response = await fetch('/api/cart/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [...merged.values()].map(item => ({ variant_id: item.variant, quantity: item.quantity })) }) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.detail || 'Certains articles ne sont plus disponibles.');
  writeLocalCart(fromApiCart(result));
}

export async function addCartItem(item: LocalCartItem): Promise<{ message: string; error?: boolean }> {
  try {
    if (!hasCartSession()) throw new Error('Panier invité');
    const response = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ variant_id: item.variant, quantity: 1 }) });
    const result = await response.json();
    if (response.ok) { writeLocalCart(fromApiCart(result)); return { message: `${item.name} ajouté au panier.` }; }
    if (response.status !== 401 && response.status !== 503) return { message: result.detail || 'Impossible d’ajouter cet article.', error: true };
  } catch { /* keep a guest cart when the API is offline */ }
  const items = readLocalCart(); const existing = items.find(row => row.variant === item.variant);
  if (existing) existing.quantity = Math.min(50, existing.quantity + 1); else items.push({ ...item, quantity: 1 });
  writeLocalCart(items);
  return { message: `${item.name} ajouté au panier.` };
}

export async function getCart(): Promise<{ items: LocalCartItem[]; source: 'remote' | 'local' }> {
  if (!hasCartSession()) return { items: readLocalCart(), source: 'local' };
  try {
    const response = await fetch('/api/cart', { cache: 'no-store' });
    if (response.ok) { const items = fromApiCart(await response.json()); return { items, source: 'remote' }; }
    if (response.status !== 401 && response.status !== 503) throw new Error('Panier indisponible.');
  } catch { /* allow guest checkout cart browsing while API is offline */ }
  return { items: readLocalCart(), source: 'local' };
}
