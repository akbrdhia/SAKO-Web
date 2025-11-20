import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    
    // Server configuration (development only)
    server: {
      host: '0.0.0.0', // Expose to all network interfaces
      port: 5173,
      strictPort: false,
      cors: true, // Enable CORS
      hmr: {
        host: 'localhost', // Use localhost for HMR
      },
      // Automatically open browser in development
      open: false,
    },
    
    // Build configuration
    build: {
      // Output directory
      outDir: 'dist',
      
      // Generate sourcemaps only in development
      sourcemap: isDev,
      
      // Minification
      minify: isDev ? false : 'terser',
      
      // Terser options for production
      terserOptions: !isDev ? {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
        },
      } : undefined,
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // Rollup options
      rollupOptions: {
        output: {
          // Manual chunks for better caching
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    
    // Define global constants
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __DEV__: isDev,
    },
    
    // Preview server configuration (for production preview)
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: false,
      cors: true,
    },
  };
})
