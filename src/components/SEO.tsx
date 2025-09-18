import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  price?: number
  currency?: string
  availability?: 'in stock' | 'out of stock'
  brand?: string
  category?: string
  noIndex?: boolean
}

export default function SEO({
  title = 'MyTechGear.eu - Lunettes Connectées Premium',
  description = 'Découvrez notre collection exclusive de lunettes connectées. Sport, Lifestyle et Prismatic - Technologies avancées, design moderne. Livraison gratuite en Europe.',
  keywords = 'lunettes connectées, smart glasses, lunettes sport, lunettes lifestyle, lunettes prismatic, technologie wearable, réalité augmentée, audio intégré',
  image = '/hero-smart-glasses.jpg',
  url,
  type = 'website',
  price,
  currency = 'EUR',
  availability,
  brand = 'MyTechGear',
  category,
  noIndex = false
}: SEOProps) {
  const siteUrl = 'https://mytechgear.eu'
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`

  // Structured data for products
  const productStructuredData = type === 'product' && price ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    image: fullImage,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    category,
    offers: {
      '@type': 'Offer',
      price: price / 100, // Convert cents to euros
      priceCurrency: currency,
      availability: availability === 'in stock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: fullUrl
    }
  } : null

  // Structured data for the website
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MyTechGear.eu',
    description: 'Boutique en ligne spécialisée dans les lunettes connectées premium',
    url: siteUrl,
    sameAs: [
      'https://www.facebook.com/mytechgear',
      'https://www.instagram.com/mytechgear',
      'https://www.linkedin.com/company/mytechgear'
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MyTechGear.eu" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@mytechgear" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Product specific meta tags */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={String(price / 100)} />
          <meta property="product:price:currency" content={currency} />
          {category && <meta property="product:category" content={category} />}
          {brand && <meta property="product:brand" content={brand} />}
        </>
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>

      {productStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
      )}

      {/* Additional SEO tags */}
      <meta name="author" content="MyTechGear Team" />
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />

      {/* Geo tags */}
      <meta name="geo.region" content="FR" />
      <meta name="geo.country" content="France" />
      <meta name="geo.placename" content="Europe" />

      {/* Mobile optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    </Helmet>
  )
}