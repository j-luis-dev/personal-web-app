import { describe, expect, it } from 'vitest';
import { contact, site } from '../data/portfolio';
import { buildPersonSchema, buildWebSiteSchema } from './seo';

describe('buildPersonSchema', () => {
  it('returns Person JSON-LD with required fields', () => {
    const canonicalUrl = new URL('https://example.com/personal-web-app/');
    const imageSrc = '/personal-web-app/_astro/portrait.webp';

    const schema = buildPersonSchema({ canonicalUrl, imageSrc });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe(`${site.name.first} ${site.name.last}`);
    expect(schema.jobTitle).toBe(site.role);
    expect(schema.description).toBe(site.description);
    expect(schema.url).toBe(canonicalUrl.href);
    expect(schema.image).toBe(imageSrc);
    expect(schema.email).toBe(contact.email);
    expect(schema.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: site.location,
    });
    expect(schema.sameAs).toEqual([contact.linkedin.href, contact.github.href]);
  });
});

describe('buildWebSiteSchema', () => {
  it('returns WebSite JSON-LD with site metadata', () => {
    const canonicalUrl = new URL('https://example.com/personal-web-app/');

    const schema = buildWebSiteSchema(canonicalUrl);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
    expect(schema.name).toBe(site.title);
    expect(schema.description).toBe(site.description);
    expect(schema.url).toBe(canonicalUrl.origin);
    expect(schema.inLanguage).toBe('en');
  });
});
