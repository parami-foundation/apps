// https://umijs.org/config/
import { defineConfig } from 'umi';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
import { InjectManifest } from 'workbox-webpack-plugin';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  define: {
    "process.env.UMI_ENV": process.env.UMI_ENV, // * 本地开发环境：dev，qa环境：qa，生产环境prod
    "process.env.name": '自定义name',
  },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  locale: {
    // default en-US
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: false,
    chrome: 67, firefox: 68, safari: 14, edge: 79, ios: 1, opera: 54,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh
  fastRefresh: {},
  nodeModulesTransform: { type: 'none' },
  // mfsu: {},
  webpack5: {},
  exportStatic: {},
  chainWebpack(config) {
    config.module
      .rule('mjs-rule')
      .test(/.m?js/)
      .resolve.set('fullySpecified', false);

    // workbox config
    config.plugin('workbox').use(InjectManifest, [
      {
        swSrc: './pwa/sw.js',
        swDest: 'sw.js',
        exclude: [/\.map$/, /favicon\.ico$/, /^manifest.*\.js?$/],
      },
    ]);
  },
  plugins: [
    './src/plugins/ga-plugin'
  ],
});
