import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return {
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    secure: false,
                    ws: true,
                },
            },
            port: 3000,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "../src/common/styles/colors.scss" as *; @use "../src/common/styles/mixins.scss" as *; @use "../src/common/styles/sizes.scss" as *;`,
                },
            },
        },
        define: {
            'process.env': process.env,
        },
        plugins: [react(), VitePWA(PwaOptions)],
    };
});

const PwaOptions: Partial<VitePWAOptions> = {
    registerType: 'autoUpdate',
    devOptions: { enabled: true },
    workbox: {
        disableDevLogs: true,
        cleanupOutdatedCaches: true,

        navigateFallbackDenylist: [new RegExp('/api/')],
        runtimeCaching: [
            {
                urlPattern: ({ url }) => {
                    return url.pathname.includes('/fonts/Rubik');
                },
                handler: 'CacheFirst',
                options: {
                    cacheName: 'fonts-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365,
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
            {
                urlPattern: /^\/images*\//,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'images-cache',
                },
            },
        ],
    },

    manifest: {
        name: 'נקודה טובה',
        short_name: 'נקודה טובה',
        description: 'יוצרים שיח חיובי בין הורים מורים ותלמידים',
        theme_color: '#CAE1E3',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
            {
                src: 'images/logo/icon-72x72.png',
                sizes: '72x72',
                type: 'image/png',
            },
            {
                src: 'images/logo/icon-96x96.png',
                sizes: '96x96',
                type: 'image/png',
            },
            {
                src: 'images/logo/icon-128x128.png',
                sizes: '128x128',
                type: 'image/png',
            },
            {
                src: 'images/logo/icon-144x144.png',
                sizes: '144x144',
                type: 'image/png',
            },
            {
                src: 'images/logo/icon-152x152.png',
                sizes: '152x152',
                type: 'image/png',
            },
            {
                src: 'images/logo/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: 'images/logo/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: 'images/logo/maskable_icon.png',
                sizes: '1058x1058',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    },
};
