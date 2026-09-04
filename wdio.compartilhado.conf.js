/**
 * Configuração compartilhada WebdriverIO + Appium.
 */
const caminhoCapturas = './capturas';

exports.config = {
  runner: 'local',
  specs: ['./testes/**/*.spec.js'],
  maxInstances: 1,
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 180000,
  },
  /**
   * Captura tela automaticamente em falha.
   */
  afterTest: async function (teste, contexto, { error }) {
    if (error) {
      const nome = `falha_${Date.now()}`;
      await browser.saveScreenshot(`${caminhoCapturas}/${nome}.png`);
      // eslint-disable-next-line no-undef
      const allure = require('@wdio/allure-reporter').default;
      allure.addAttachment(
        'Captura da falha',
        Buffer.from(await browser.takeScreenshot(), 'base64'),
        'image/png',
      );
    }
  },
};
