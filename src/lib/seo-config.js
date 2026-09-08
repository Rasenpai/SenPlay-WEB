// TODO: Replace with SenPlay's official production domain before deploying.
export const SITE_URL = "https://YOUR-DOMAIN.com";
export const SITE_NAME = "SenPlay";
export const DEFAULT_TITLE = "SenPlay — Entertainment, in one place.";
export const DEFAULT_DESCRIPTION =
  "Discover and enjoy anime, donghua, comics, movies, and more with SenPlay.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
    },
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],
};
