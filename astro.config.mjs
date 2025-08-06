import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from "vite";
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown'
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

export default defineConfig({
  base: env.NODE_ENV === 'production' ? '/event' : '/event',
  site: 'https://theoldsiam.co.th/event',
  integrations: [
    mdx(),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [react({
    experimentalReactChildren: true,
  })],
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:3000/api'),
      'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || ''),
      'import.meta.env.VITE_GA_TRACKING_ID': JSON.stringify(env.VITE_GA_TRACKING_ID || ''),
      'import.meta.env.VITE_DOWNLOAD_TOKEN': JSON.stringify(env.VITE_DOWNLOAD_TOKEN || ''),
    },
    preview: {
      allowedHosts: ['assets-manager.ssdapp.net', 'theoldsiam.co.th', 'www.theoldsiam.co.th', 'localhost', '127.0.0.1']
    },
    server: {
      cors: {
        origin: process.env.NODE_ENV === 'development'
          ? true
          : ['https://theoldsiam.co.th'],
        credentials: true
      }
    }
  },

});
