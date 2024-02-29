
//const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
    "globDirectory": "docs",
    "globPatterns": [
      "**/*.{html,js,css,png,jpg}"
    ],
    "swDest": "docs/custom-service-worker.js",
    "swSrc": "./public/custom-service-worker.js",
    "maximumFileSizeToCacheInBytes": 5000000
  };
  