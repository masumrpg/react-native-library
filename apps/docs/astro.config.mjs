// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://masum.dev',
  integrations: [
    starlight({
      title: 'Masum Dev',
      favicon: '/favicon.png',
      description: 'High-performance, open-source React Native & Expo component libraries and tools.',
      social: {
        github: 'https://github.com/masumrpg/react-native-library',
      },
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
      },
      customCss: [
        '@fontsource-variable/outfit',
        './src/styles/custom.css',
      ],
      editLink: {
        baseUrl: 'https://github.com/masumrpg/react-native-library/edit/main/apps/docs/',
      },
      lastUpdated: true,
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      expressiveCode: {
        themes: ['starlight-dark', 'starlight-light'],
        styleOverrides: {
          borderRadius: '0.5rem',
        },
      },
      head: [
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#3da441' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:site_name', content: 'Masum Dev Docs' },
        },
      ],
      sidebar: [
        {
          label: 'Welcome',
          slug: 'index',
        },
        {
          label: 'RN UI',
          items: [
            { label: 'Overview', slug: 'rn-ui' },
            { label: 'Interactive Demo', slug: 'rn-ui/demo' },
            { label: 'Installation', slug: 'rn-ui/installation' },
            { label: 'Theming & Dark Mode', slug: 'rn-ui/theming' },
            { label: 'Building Custom Components', slug: 'rn-ui/custom-components' },
            { label: 'Changelog', slug: 'rn-ui/changelog' },
            {
              label: 'Components',
              autogenerate: { directory: 'rn-ui/components' },
            },
          ],
        },
        {
          label: 'RN Tajweed Verse',
          autogenerate: { directory: 'rn-tajweed-verse' },
        },
        {
          label: 'RN QR Code',
          autogenerate: { directory: 'rn-qr-code' },
        },
      ],
    }),
  ],
});
