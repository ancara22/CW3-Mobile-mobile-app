const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    pwa: {
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        ...require('./workbox-config.js'),
      },
    },
  },
  
})
