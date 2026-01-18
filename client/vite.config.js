import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // ✅ DISABLE automatic service worker registration
      injectRegister: null,
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico"],
      
      manifest: {
        name: "Pulse Check",
        short_name: "Pulse",
        description: "Server monitoring & uptime alerts",
        theme_color: "#0f172a",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      
      // ✅ Don't generate a service worker - we'll use OneSignal's
      injectManifest: {
        injectionPoint: undefined,
      },
    }),
  ],

  server: {
    allowedHosts: [".ngrok-free.dev"],
  },
});