import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
    strictPort: true,
    headers: {
      // Security headers
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      // CSP will be added via meta tag in index.html for better control
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les pages admin en chunk dédié
          'admin': [
            './src/pages/admin/AdminDashboard',
            './src/pages/admin/AdminProducts',
            './src/pages/admin/AdminOrders',
            './src/pages/admin/AdminUsers',
            './src/pages/admin/AdminSettings',
            './src/pages/admin/AdminAnalytics',
            './src/pages/admin/AdminCategories',
            './src/pages/admin/AdminCollections',
            './src/pages/admin/AdminSuppliers',
            './src/pages/admin/AdminVariants',
            './src/pages/admin/AdminInvoices',
            './src/pages/admin/AdminSystemUsers',
            './src/pages/admin/AdminExternalUsers',
            './src/pages/admin/AdminInternalUsers'
          ],
          // Séparer les composants charts
          'charts': ['recharts', 'lucide-react'],
          // Séparer les composants UI Radix
          'ui-components': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip'
          ],
          // Core React et routing
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          // Supabase et auth
          'auth': ['@supabase/supabase-js', '@tanstack/react-query'],
          // Utils et libs
          'utils': ['date-fns', 'zod', 'clsx', 'class-variance-authority']
        },
      },
    },
    // Réduire la taille limite d'avertissement
    chunkSizeWarningLimit: 800,
    // Optimisations supplémentaires
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
      },
    },
  },
}));
