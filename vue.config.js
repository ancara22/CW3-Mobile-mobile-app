const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './CW3-Mobile-mobile-app/',
  pwa: {
    pwa: {
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        ...require('./workbox-config.js'),
      },
    },
  },
  
})
