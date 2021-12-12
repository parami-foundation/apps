/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 */
export default {
  dev: {
    '/feed': {
      target: 'https://airdrop.parami.io',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/subsquery': {
      target: 'https://graph.parami.io',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/feed': {
      target: 'https://airdrop.parami.io',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/subsquery': {
      target: 'https://graph.parami.io',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/feed': {
      target: 'https://airdrop.parami.io',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/subsquery': {
      target: 'https://graph.parami.io',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
