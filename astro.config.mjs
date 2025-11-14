import { defineConfig, sharpImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import remarkGfm from 'remark-gfm';


// https://astro.build/config
export default defineConfig({
  site: 'https://blog.pinapelz.com',
  integrations: [mdx({
    remarkPlugins: [remarkGfm],
  }), sitemap(), react()],
  image:{
    service: sharpImageService(),
  }
});