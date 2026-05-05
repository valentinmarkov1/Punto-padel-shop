import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: any;
}

const SEO = ({ 
  title, 
  description, 
  image = '/logo.jpeg', 
  url = window.location.href, 
  type = 'website',
  schema
}: SEOProps) => {
  const siteName = 'Punto Pádel';
  const fullTitle = title ? `${title} | ${siteName}` : 'Punto Pádel - Tienda Online de Pádel';
  const defaultDescription = 'Equipamiento profesional de pádel. Palas, bolsos, indumentaria y accesorios.';
  const finalDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Etiquetas Meta Básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />

      {/* Datos estructurados JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
