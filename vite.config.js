import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { vitePluginFakeServer } from 'vite-plugin-fake-server'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueSetupExtend(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    }),
    vitePluginFakeServer({
      logger: false,
      include: 'mock',
      infixName: false,
      enableProd: true
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/style/globalvar.scss" as *;'
      }
    }
  },
  server: {
    host: 'localhost', // 服务监听地址，设置该值表示监听所有
    cors: true, // 允许跨源
    port: 9527, // 本地服务端口号
    proxy: { // 代理
      '^/api': { // api地址匹配的字符串，可以使用正则，此处表示以/api为开头的接口地址
        target: 'http://localhost:3000/', // 指向，表示上述需要匹配的地址都指向这个域名，注意要用/结尾
        // rewrite: (path) => path.replace(/^\/api/, ''), // 如果匹配字符不需要了，可以使用重写去掉
        changeOrigin: true // 是否修改请求头的origin，让服务器认为这个请求来自本域名
      }
    }
  },
  build: {
    // 减小 chunk 大小
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    // 禁用 sourcemap
    sourcemap: false,
    // 减小打包体积
    minify: 'esbuild',
    // 设置较大的 chunk 警告限制
    chunkSizeWarningLimit: 2000,
    // 启用 CSS 代码分割
    cssCodeSplit: true
  },
  optimizeDeps: {
    // 强制预构建依赖
    force: true
  }
})
