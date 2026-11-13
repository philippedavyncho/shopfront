export type Product = {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  category: number | string;
  category_name?: string;
  brand?: number | string | null;
  brand_name?: string | null;
  images: { image: string; alt_text: string }[];
  variants: { id: number; name: string; sku: string; price: string; compare_at_price: string | null; currency: string; available: number }[];
};

export type Category = { id: number; name: string; slug: string; parent: number | null; description: string };

const unsplash = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const normalizeText = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
export const fallbackProducts: Product[] = [
  { id: 'smartphone-nova-128-go', name: 'Smartphone Nova 128 Go', slug: 'smartphone-nova-128-go', description: 'Un smartphone fluide avec écran lumineux et batterie longue durée.', category: 'Smartphones', images: [{ image: unsplash('photo-1511707171634-5f897ff02aa9'), alt_text: 'Smartphone' }], variants: [{ id: 1, name: 'Noir - 128 Go', sku: 'DEMO-NOVA-128', price: '189900', compare_at_price: '219900', currency: 'XOF', available: 18 }] },
  { id: 'ordinateur-portable-atlas-14-pouces', name: 'Ordinateur portable Atlas 14 pouces', slug: 'ordinateur-portable-atlas-14-pouces', description: 'Un ordinateur léger pour le travail, les études et les déplacements.', category: 'Ordinateurs', images: [{ image: unsplash('photo-1496181133206-80ce9b88a853'), alt_text: 'Ordinateur portable' }], variants: [{ id: 2, name: '16 Go - 512 Go SSD', sku: 'DEMO-ATLAS-14', price: '429900', compare_at_price: null, currency: 'XOF', available: 7 }] },
  { id: 'ecouteurs-sans-fil-pulse', name: 'Écouteurs sans fil Pulse', slug: 'ecouteurs-sans-fil-pulse', description: 'Des écouteurs compacts avec boîtier de charge et son équilibré.', category: 'Accessoires électroniques', images: [{ image: unsplash('photo-1606220945770-b5b6c2c55bf1'), alt_text: 'Écouteurs sans fil' }], variants: [{ id: 3, name: 'Blanc', sku: 'DEMO-PULSE-WH', price: '24900', compare_at_price: '29900', currency: 'XOF', available: 32 }] },
  { id: 'refrigerateur-compact-fresh-230-l', name: 'Réfrigérateur compact Fresh 230 L', slug: 'refrigerateur-compact-fresh-230-l', description: 'Un réfrigérateur pratique et silencieux pour la cuisine familiale.', category: 'Réfrigérateur', images: [{ image: unsplash('photo-1571175443880-49e1d25b2bc5'), alt_text: 'Réfrigérateur' }], variants: [{ id: 4, name: 'Inox - 230 L', sku: 'DEMO-FRESH-230', price: '279900', compare_at_price: null, currency: 'XOF', available: 4 }] },
  { id: 'sac-urbain-nomade', name: 'Sac urbain Nomade', slug: 'sac-urbain-nomade', description: 'Un sac resistant avec plusieurs rangements pour les essentiels.', category: 'Sacs', images: [{ image: unsplash('photo-1553062407-98eeb64c6a62'), alt_text: 'Sac urbain' }], variants: [{ id: 5, name: 'Vert olive - 22 L', sku: 'DEMO-NOMADE-22', price: '32900', compare_at_price: null, currency: 'XOF', available: 14 }] },
  { id: 'montre-connectee-move', name: 'Montre connectée Move', slug: 'montre-connectee-move', description: 'Suivez vos activités et notifications au quotidien.', category: 'Montres connectées', images: [{ image: unsplash('photo-1523275335684-37898b6baf30'), alt_text: 'Montre connectée' }], variants: [{ id: 6, name: 'Noir - Bracelet ajustable', sku: 'DEMO-MOVE-BK', price: '59900', compare_at_price: '69900', currency: 'XOF', available: 11 }] },
  { id: 'baskets-legeres-sprint', name: 'Baskets légères Sprint', slug: 'baskets-legeres-sprint', description: 'Des baskets confortables et légères pour marcher toute la journée.', category: 'Chaussures', images: [{ image: unsplash('photo-1542291026-7eec264c27ff'), alt_text: 'Baskets' }], variants: [{ id: 7, name: 'Blanc - Taille 40', sku: 'DEMO-SPRINT-40', price: '44900', compare_at_price: null, currency: 'XOF', available: 9 }] },
  { id: 'tablette-compacte-reader-10-pouces', name: 'Tablette compacte Reader 10 pouces', slug: 'tablette-compacte-reader-10-pouces', description: 'Une tablette polyvalente pour lire, regarder et travailler.', category: 'Tablettes', images: [{ image: unsplash('photo-1544244015-0df4b3ffc6b0'), alt_text: 'Tablette' }], variants: [{ id: 8, name: 'Gris - 64 Go', sku: 'DEMO-READER-10', price: '119900', compare_at_price: null, currency: 'XOF', available: 6 }] },
];

export const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
export const mediaUrl = import.meta.env.PUBLIC_MEDIA_URL || 'http://127.0.0.1:8000';

const fallbackCategories: Category[] = [
  { id: 1, name: 'Électroménager', slug: 'electromenager', parent: null, description: '' },
  { id: 2, name: 'Électronique', slug: 'electronique', parent: null, description: '' },
  { id: 3, name: 'Mode', slug: 'mode', parent: null, description: '' },
  { id: 4, name: 'Sport', slug: 'sport', parent: null, description: '' },
  { id: 5, name: 'Smartphones', slug: 'smartphones', parent: 2, description: '' },
];

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${apiUrl}/categories/`, { signal: AbortSignal.timeout(1800) });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    const categories = (data.results ?? data) as Category[];
    return categories.filter(category => category && category.slug && category.name);
  } catch {
    return fallbackCategories;
  }
}

export async function getProducts(search = '', options: { category?: string; ordering?: string } = {}): Promise<Product[]> {
  try {
    const url = new URL(`${apiUrl}/products/`);
    if (search) url.searchParams.set('search', search);
    if (options.category) url.searchParams.set('category', options.category);
    url.searchParams.set('ordering', options.ordering || '-created_at');
    const response = await fetch(url, { signal: AbortSignal.timeout(1800) });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    return (data.results ?? data) as Product[];
  } catch {
    const needle = normalizeText(search.trim());
    let products = needle ? fallbackProducts.filter(p => normalizeText(`${p.name} ${p.category} ${p.description}`).includes(needle)) : fallbackProducts;
    if (options.category) {
      const category = normalizeText(options.category);
      const aliases: Record<string, string[]> = { electronique: ['smartphone', 'ordinateur', 'electronique', 'montre', 'tablette'], smartphones: ['smartphone'], telephone: ['smartphone'], ordinateurs: ['ordinateur'], tablettes: ['tablette'], 'accessoires-electroniques': ['electronique', 'ecouteurs'], 'montres-connectees': ['montre'], electromenager: ['refrigerateur'], refrigerateur: ['refrigerateur'], mode: ['sac', 'chaussure', 'vetement'], sacs: ['sac'], chaussures: ['chaussure'], 'vetements-femme': ['vetement'], 'vetements-homme': ['vetement'], sport: ['sport'] };
      const matches = aliases[category] || [category];
      products = products.filter(p => matches.some(value => normalizeText(String(p.category)).includes(value)));
    }
    if (options.ordering?.includes('price')) products = [...products].sort((a, b) => options.ordering!.startsWith('-') ? price(b) - price(a) : price(a) - price(b));
    return products;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`${apiUrl}/products/${encodeURIComponent(slug)}/`, { signal: AbortSignal.timeout(1800) });
    if (!response.ok) return fallbackProducts.find(product => product.slug === slug);
    return await response.json() as Product;
  } catch { return fallbackProducts.find(product => product.slug === slug); }
}

export function productImage(product: Product): string {
  const path = product.images?.[0]?.image;
  if (!path) {
    const slug = product.slug.toLocaleLowerCase('fr');
    const image = slug.includes('smartphone') || slug.includes('telephone') ? 'photo-1511707171634-5f897ff02aa9'
      : slug.includes('ordinateur') ? 'photo-1496181133206-80ce9b88a853'
      : slug.includes('ecouteur') || slug.includes('enceinte') ? 'photo-1606220945770-b5b6c2c55bf1'
      : slug.includes('refrigerateur') || slug.includes('lave-linge') || slug.includes('blender') ? 'photo-1571175443880-49e1d25b2bc5'
      : slug.includes('sac') ? 'photo-1553062407-98eeb64c6a62'
      : slug.includes('montre') ? 'photo-1523275335684-37898b6baf30'
      : slug.includes('basket') || slug.includes('chaussure') ? 'photo-1542291026-7eec264c27ff'
      : slug.includes('tablette') ? 'photo-1544244015-0df4b3ffc6b0'
      : slug.includes('ballon') || slug.includes('sport') ? 'photo-1517649763962-0c623066013b'
      : slug.includes('polo') || slug.includes('chemise') || slug.includes('vetement') ? 'photo-1483985988355-763728e1935b'
      : 'photo-1490481651871-ab68de25d43d';
    return unsplash(image);
  }
  return path.startsWith('http') ? path : `${mediaUrl}${path}`;
}
export function price(product: Product): number { return Number(product.variants?.[0]?.price ?? 0); }
export function formatPrice(value: number, currency = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}
