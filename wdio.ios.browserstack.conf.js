const { config: compartilhado } = require('./wdio.compartilhado.conf.js');

const usuarioBs = process.env.BROWSERSTACK_USERNAME;
const chaveBs = process.env.BROWSERSTACK_ACCESS_KEY;

/**
 * iOS no BrowserStack — o APK/ZIP do demo app é voltado a simulador.
 * Ajuste BROWSERSTACK_APP_ID_IOS conforme o upload do .zip no BrowserStack.
 */
exports.config = {
  ...compartilhado,
  user: usuarioBs,
  key: chaveBs,
  hostname: 'hub.browserstack.com',
  services: [],
  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:app': process.env.BROWSERSTACK_APP_ID_IOS || 'bs://<substitua_pelo_app_id_ios>',
      'bstack:options': {
        deviceName: process.env.BS_DEVICE_IOS || 'iPhone 14',
        osVersion: process.env.BS_OS_IOS || '16',
        projectName: 'qa-mobile-appium',
        buildName: process.env.BS_BUILD || 'ios-cloud-build',
        sessionName: 'iOS Appium - Suite',
        debug: true,
        networkLogs: true,
      },
    },
  ],
};
