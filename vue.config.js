/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
const https = require('https')
const keepAliveAgent = new https.Agent({ keepAlive: true })
const configureWebpack = require('./vue-webpack.config')

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "src/styles/common.scss";'
      }
    }
  },

  configureWebpack,

  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [
            { removeDimensions: true },
            { removeViewBox: false },
            { removeAttrs: { attrs: '(path|rect):fill' } }
          ]
        }
      })
  },

  pwa: {
    name: 'traQ',
    themeColor: '#0D67EA',
    msTileColor: '#0D67EA',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    assetsVersion: require('./package.json').version,

    manifestPath: 'site.webmanifest',
    manifestOptions: {
      start_url: '/',
      background_color: '#f6f7f9',
      icons: [
        {
          src: '/img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      gcm_sender_id: '103953800507'
    },
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/mstile-144x144.png'
    },

    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/sw.js',
      swDest: 'sw.js'
    }
  },

  devServer: {
    proxy: {
      '/api/v3/*': {
        target: 'https://traq-s-dev.tokyotech.org/',
        ws: true,
        changeOrigin: true,
        agent: keepAliveAgent
      }
    }
  },

  productionSourceMap: false,

  // CI上ではthread数を制限
  parallel: process.env.CIRCLECI ? +process.env.CIRCLE_NODE_TOTAL : true
}
