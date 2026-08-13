import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Case studies. One MDX file per entry — this collection is what replaces the
 * three copy-pasted HTML pages the old site was built from.
 *
 * `confidentiality` encodes the publishing rules agreed in the re-architecture
 * spec, so they are enforced at build time rather than remembered:
 *   - SAP client work lives in client systems. Clients are never named and no
 *     screenshots exist. Employers may be named; clients only by `domain`.
 *   - Internal platform names are never published.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string().max(180),
        pillar: z.enum(['products', 'enterprise', 'research']),
        featured: z.boolean().default(false),

        // Attribution. `client` is deliberately absent from this schema.
        employer: z.string().optional(),
        vehicle: z.string().optional(),
        domain: z
          .enum(['energy', 'retail', 'fmcg', 'agriculture', 'consumer'])
          .optional(),
        role: z.string(),

        start: z.string(),
        end: z.string().optional(),
        status: z.enum([
          'live',
          'in-development',
          'in-progress',
          'delivered',
          'archived',
        ]),

        stack: z.array(z.string()).default([]),

        // 'internal' forbids outbound links and imagery.
        confidentiality: z.enum(['public', 'internal']).default('internal'),
        // Optional until real covers are designed in phase 3.
        cover: image().optional(),
        coverAlt: z.string().optional(),

        links: z
          .array(
            z.object({
              label: z.string(),
              href: z.string(),
              kind: z.enum([
                'site',
                'testflight',
                'appstore',
                'repo',
                'writeup',
              ]),
            }),
          )
          .default([]),

        outcomes: z
          .array(
            z.object({
              metric: z.string(),
              value: z.string(),
              note: z.string().optional(),
            }),
          )
          .default([]),

        order: z.number().default(0),
      })
      // Fail closed, the way Spellum's distribution gates do.
      .refine((d) => d.confidentiality === 'public' || d.links.length === 0, {
        message:
          'Internal work must not carry outbound links. Set confidentiality: public, or remove links.',
      })
      .refine((d) => d.confidentiality === 'public' || d.cover === undefined, {
        message:
          'Internal work must not ship imagery. Remove cover, or set confidentiality: public.',
      }),
});

export const collections = { work };
