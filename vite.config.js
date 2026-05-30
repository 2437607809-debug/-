import { defineConfig } from 'vite';
import { resolve } from 'path';

// GitHub Pages 部署时自动读取 base 路径
// 如果是 username.github.io 仓库，base 为 '/'
// 如果是其他仓库名，base 为 '/<repo-name>/'
const base = process.env.BASE_URL || '/';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
