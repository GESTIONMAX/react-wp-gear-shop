/**
 * Générateur de sitemap pour améliorer le référencement SEO
 */

interface SitemapUrl {
  url: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

interface Product {
  slug: string
  updated_at?: string
}

interface Category {
  slug: string
  name: string
}

export class SitemapGenerator {
  private baseUrl: string

  constructor(baseUrl: string = 'https://mytechgear.eu') {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
  }

  /**
   * Génère le sitemap complet en XML
   */
  generateXMLSitemap(urls: SitemapUrl[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    const urlsetClose = '</urlset>'

    const urlsXML = urls.map(url => {
      const lastmod = url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''
      const changefreq = url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ''
      const priority = url.priority ? `\n    <priority>${url.priority}</priority>` : ''

      return `  <url>
    <loc>${this.baseUrl}${url.url}</loc>${lastmod}${changefreq}${priority}
  </url>`
    }).join('\n')

    return `${xmlHeader}\n${urlsetOpen}\n${urlsXML}\n${urlsetClose}`
  }

  /**
   * URLs statiques du site
   */
  getStaticUrls(): SitemapUrl[] {
    const now = new Date().toISOString().split('T')[0]

    return [
      {
        url: '/',
        lastmod: now,
        changefreq: 'daily',
        priority: 1.0
      },
      {
        url: '/sport',
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        url: '/lifestyle',
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        url: '/prismatic',
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        url: '/blog',
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        url: '/auth',
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: '/mentions-legales',
        lastmod: now,
        changefreq: 'yearly',
        priority: 0.2
      },
      {
        url: '/politique-confidentialite',
        lastmod: now,
        changefreq: 'yearly',
        priority: 0.2
      },
      {
        url: '/conditions-generales-vente',
        lastmod: now,
        changefreq: 'yearly',
        priority: 0.2
      }
    ]
  }

  /**
   * URLs des produits
   */
  getProductUrls(products: Product[]): SitemapUrl[] {
    return products.map(product => ({
      url: `/product/${product.slug}`,
      lastmod: product.updated_at ?
        new Date(product.updated_at).toISOString().split('T')[0] :
        new Date().toISOString().split('T')[0],
      changefreq: 'weekly' as const,
      priority: 0.8
    }))
  }

  /**
   * Génère le robots.txt optimisé
   */
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Optimized for main search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Block admin areas
User-agent: *
Disallow: /admin/
Disallow: /auth
Disallow: /checkout
Disallow: /account

# Allow important files
Allow: /sitemap.xml
Allow: /*.js
Allow: /*.css
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png
Allow: /*.webp
Allow: /*.svg

# Sitemap location
Sitemap: ${this.baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1`
  }

  /**
   * Génère des meta tags pour les réseaux sociaux
   */
  generateSocialMetaTags(title: string, description: string, image: string, url: string) {
    return {
      openGraph: {
        title,
        description,
        image: `${this.baseUrl}${image}`,
        url: `${this.baseUrl}${url}`,
        type: 'website',
        siteName: 'MyTechGear.eu',
        locale: 'fr_FR'
      },
      twitter: {
        card: 'summary_large_image',
        site: '@mytechgear',
        title,
        description,
        image: `${this.baseUrl}${image}`
      }
    }
  }

  /**
   * Génère les données structurées Schema.org pour un produit
   */
  generateProductSchema(product: {
    name: string
    description: string
    price: number
    currency: string
    availability: string
    image: string
    brand: string
    category: string
    url: string
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: `${this.baseUrl}${product.image}`,
      brand: {
        '@type': 'Brand',
        name: product.brand
      },
      category: product.category,
      offers: {
        '@type': 'Offer',
        price: product.price / 100,
        priceCurrency: product.currency,
        availability: product.availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: `${this.baseUrl}${product.url}`
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '127',
        bestRating: '5',
        worstRating: '1'
      }
    }
  }

  /**
   * Génère les données structurées pour l'organisation
   */
  generateOrganizationSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'MyTechGear.eu',
      description: 'Boutique en ligne spécialisée dans les lunettes connectées premium',
      url: this.baseUrl,
      logo: `${this.baseUrl}/logo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+33-1-23-45-67-89',
        contactType: 'Customer Service',
        availableLanguage: ['French', 'English']
      },
      sameAs: [
        'https://www.facebook.com/mytechgear',
        'https://www.instagram.com/mytechgear',
        'https://www.linkedin.com/company/mytechgear',
        'https://www.youtube.com/c/mytechgear'
      ]
    }
  }

  /**
   * Génère le breadcrumb Schema.org
   */
  generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.baseUrl}${item.url}`
      }))
    }
  }
}

// Instance par défaut
export const sitemapGenerator = new SitemapGenerator()

// Fonction utilitaire pour sauvegarder le sitemap
export async function generateAndSaveSitemap(products: Product[] = []) {
  const urls = [
    ...sitemapGenerator.getStaticUrls(),
    ...sitemapGenerator.getProductUrls(products)
  ]

  const sitemapXML = sitemapGenerator.generateXMLSitemap(urls)
  const robotsTxt = sitemapGenerator.generateRobotsTxt()

  // En production, ces fichiers seraient sauvegardés sur le serveur
  // Pour l'instant, on les retourne pour utilisation
  return {
    sitemap: sitemapXML,
    robots: robotsTxt,
    urlCount: urls.length
  }
}

export default SitemapGenerator