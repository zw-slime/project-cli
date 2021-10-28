import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { minifyHtml, injectHtml } from 'vite-plugin-html';
import { getGitTag, getGitVersion } from './src/util/git';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    minifyHtml(),
    injectHtml({
      data: {
        VITE_APP_VERSION: getGitVersion(),
        VITE_APP_TAG: getGitTag(),
      },
    }),
  ],
  css: {
    modules: {
      // 加上这个配置后，就可以在 scss 文件中使用蛇形类名，在 ts 文件中使用驼峰类型，会自动转换对应上
      localsConvention: 'camelCaseOnly',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: '...',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    target: 'modules',
    outDir: 'build',
    assetsDir: 'static',
  },
});
