import { IApi } from 'umi';

export default (api: IApi) => {
  const GA_KEY = process.env.GA_KEY;
  if (!api.userConfig.ga && !GA_KEY) return;

  api.describe({
    key: 'ga',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });
  const { ga = {} } = api.userConfig;
  const { gaKey = GA_KEY } = ga || {};
  api.logger.log('insert analytics');

  const gtagTpl = (code: string) => {
    return `
        (function(){
        if (!location.port || true) {
            var gtagScript = document.createElement("script");
            gtagScript.async = true;
            gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=${code}";
            var scr = document.getElementsByTagName("script")[0];
            scr.parentNode.insertBefore(gtagScript, scr);
            window.dataLayer = window.dataLayer || [];
            function gtag() {dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${code}');
        }
        })();
    `;
  };

  if (api.env !== 'development') {
    api.addHTMLScripts(() => [
      {
        content: gtagTpl(gaKey),
      },
    ]);
  }

};
