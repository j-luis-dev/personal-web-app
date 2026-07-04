import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { contact, site } from '../data/portfolio';

type PersonSchemaInput = {
  canonicalUrl: URL;
  imageSrc: string;
};

export async function getOgImageSrc(portrait: ImageMetadata): Promise<string> {
  const optimized = await getImage({
    src: portrait,
    width: 1200,
    height: 630,
    format: 'webp',
  });
  return optimized.src;
}

export function buildPersonSchema({ canonicalUrl, imageSrc }: PersonSchemaInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${site.name.first} ${site.name.last}`,
    jobTitle: site.role,
    description: site.description,
    url: canonicalUrl.href,
    image: imageSrc,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location,
    },
    sameAs: [contact.linkedin.href, contact.github.href],
  };
}

export function buildWebSiteSchema(canonicalUrl: URL): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.title,
    description: site.description,
    url: canonicalUrl.origin,
    inLanguage: 'en',
  };
}
