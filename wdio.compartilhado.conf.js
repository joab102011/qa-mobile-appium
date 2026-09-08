/**
 * Configuração compartilhada WebdriverIO + Appium.
 */
const caminhoCapturas = './capturas';

exports.config = {
  runner: 'local',
  specs: ['./testes/**/*.spec.js'],
  maxInstances: 1,
  logLevel: 'warn',
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 600000,
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
   * Garante app em primeiro plano no inicio de cada arquivo de spec
   * e registra ambiente no Allure (todas as suites).
   */
  before: async function () {
    const { adicionarAmbiente } = require('./utilitarios/allure.ajuda');
    const plataforma = process.env.PLATFORM || 'Android';
    const bundle =
      process.env.BUNDLE_ID_APP ||
      process.env.BUNDLE_ID_IOS ||
      'com.wdiodemoapp';
    adicionarAmbiente({
      plataforma,
      dispositivo:
        process.env.UDID_ANDROID ||
        process.env.UDID_IOS ||
        process.env.NOME_DISPOSITIVO_ANDROID ||
        process.env.NOME_DISPOSITIVO_IOS ||
        process.env.BS_DEVICE_ANDROID ||
        process.env.BS_DEVICE_IOS ||
        (plataforma === 'iOS' ? 'iPhone Simulator' : 'WdioDemo_API34'),
      build: process.env.BS_BUILD || 'local',
    });
    try {
      await driver.activateApp(bundle);
    } catch (e) {
      // app pode ja estar ativo
    }
    await browser.pause(1500);
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
