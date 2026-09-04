const { config: compartilhado } = require('./wdio.compartilhado.conf.js');

const usuarioBs = process.env.BROWSERSTACK_USERNAME;
const chaveBs = process.env.BROWSERSTACK_ACCESS_KEY;

exports.config = {
  ...compartilhado,
  user: usuarioBs,
  key: chaveBs,
  hostname: 'hub.browserstack.com',
  // Conecta direto ao hub Appium do BrowserStack (sem service extra).
  services: [],
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:app': process.env.BROWSERSTACK_APP_ID || 'bs://<substitua_pelo_app_id>',
      'bstack:options': {
        deviceName: process.env.BS_DEVICE_ANDROID || 'Samsung Galaxy S22',
        osVersion: process.env.BS_OS_ANDROID || '12.0',
        projectName: 'qa-mobile-appium',
        buildName: process.env.BS_BUILD || 'android-local-build',
        sessionName: 'Android Appium - Suite',
        debug: true,
        networkLogs: true,
      },
    },
  ],
};
