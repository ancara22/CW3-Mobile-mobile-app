const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
 // publicPath: './',
  pwa: {
    pwa: {
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        ...require('./workbox-config.js'),
      },
    },
  },
  
})
