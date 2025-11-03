import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // Base public path when served in production
    base: '/',  // or process.env.BASE_URL || '/'
    
    // Development server configuration
    server: {
      host: '::',  // Listen on all network interfaces
      port: 8080,
      strictPort: false,
      open: false,  // Don't open browser automatically
      cors: true,
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
    },
    
    // Plugins
    plugins: [
      react(),
      mode === 'development' && componentTagger()
    ].filter(Boolean),
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    // Environment variables
    define: {
      'process.env': { ...env, NODE_ENV: mode }
    },
    
    // CSS configuration
    css: {
      devSourcemap: mode === 'development',
    },
  };
});
