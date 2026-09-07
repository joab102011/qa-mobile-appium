const { config: compartilhado } = require('./wdio.compartilhado.conf.js');
const caminho = require('path');
const fs = require('fs');
const {
  limparVideosUltimaExecucao,
  iniciarGravacao,
  finalizarGravacao,
} = require('./utilitarios/gravacao.tela');

/**
 * iOS LOCAL — somente macOS + Xcode + Simulator.
 * O build oficial do demo e so para Simulator (limitacao Apple).
 *
 *   npm run baixar:app:ios
 *   open -a Simulator
 *   npm run testar:ios:local
 */
function resolverAppIos() {
  const override = process.env.APP_IOS_LOCAL;
  if (override && fs.existsSync(override)) {
    return override;
  }
  const pastaApps = caminho.join(process.cwd(), 'apps');
  const candidatos = [
    caminho.join(pastaApps, 'ios.simulator.wdio.native.app.app'),
  ];
  for (const c of candidatos) {
    if (fs.existsSync(c)) {
      return c;
    }
  }
  if (fs.existsSync(pastaApps)) {
    const fila = [pastaApps];
    while (fila.length) {
      const dir = fila.pop();
      for (const nome of fs.readdirSync(dir)) {
        const cheio = caminho.join(dir, nome);
        let st;
        try {
          st = fs.statSync(cheio);
        } catch (e) {
          continue;
        }
        if (st.isDirectory()) {
          if (nome.endsWith('.app')) {
            return cheio;
          }
          fila.push(cheio);
        }
      }
    }
  }
  return null;
}

const appIos = resolverAppIos();
const bundleId =
  process.env.BUNDLE_ID_IOS || 'org.reactjs.native.example.wdiodemoapp';
const dispositivo =
  process.env.NOME_DISPOSITIVO_IOS || process.env.IOS_DEVICE_NAME || 'iPhone 15';
const versaoIos = process.env.VERSAO_IOS || process.env.IOS_PLATFORM_VERSION;

const capacidade = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': dispositivo,
  'appium:app':
    appIos ||
    caminho.join(process.cwd(), 'apps', 'ios.simulator.wdio.native.app.app'),
  'appium:bundleId': bundleId,
  'appium:newCommandTimeout': 240,
  'appium:noReset': false,
  'appium:fullReset': false,
  'appium:autoAcceptAlerts': true,
};

if (versaoIos) {
  capacidade['appium:platformVersion'] = versaoIos;
}
if (process.env.UDID_IOS) {
  capacidade['appium:udid'] = process.env.UDID_IOS;
}

const appiumExterno = process.env.APPIUM_EXTERNO === '1';

exports.config = {
  ...compartilhado,
  port: 4723,
  services: appiumExterno
    ? []
    : [
        [
          'appium',
          {
            args: { relaxedSecurity: true },
            command: 'appium',
            appiumStartTimeout: 180000,
          },
        ],
      ],
  capabilities: [capacidade],

  mochaOpts: {
    ...((compartilhado.mochaOpts) || {}),
    ui: 'bdd',
    timeout: 180000,
    ...(process.env.MOCHA_GREP ? { grep: process.env.MOCHA_GREP } : {}),
  },

  onPrepare() {
    if (process.platform !== 'darwin') {
      throw new Error(
        '[erro] iOS local exige macOS + Xcode + Simulator. ' +
          'No Windows/Linux: Android local (`npm run testar:android:local`) ' +
          'ou iOS na nuvem (`npm run testar:ios:bs`).',
      );
    }
    if (!appIos || !fs.existsSync(appIos)) {
      throw new Error(
        '[erro] App iOS do Simulator ausente. Rode `npm run baixar:app:ios`.',
      );
    }
    process.env.PLATFORM = 'iOS';
    process.env.BUNDLE_ID_APP = bundleId;
    if (process.env.MANTER_VIDEOS !== '1') {
      limparVideosUltimaExecucao();
    }
    console.log(`[ios-local] app=${appIos} device=${dispositivo} bundle=${bundleId}`);
  },

  before: async function () {
    if (typeof compartilhado.before === 'function') {
      await compartilhado.before.call(this);
    }
  },

  beforeTest: async function () {
    await iniciarGravacao();
  },

  afterTest: async function (teste, contexto, resultado) {
    const arquivo = await finalizarGravacao(teste.title);
    if (arquivo) {
      try {
        const allure = require('@wdio/allure-reporter').default;
        allure.addAttachment(
          'Video da ultima execucao',
          fs.readFileSync(arquivo),
          'video/mp4',
        );
      } catch (e) {
        // Allure opcional
      }
    }
    if (typeof compartilhado.afterTest === 'function') {
      await compartilhado.afterTest.call(this, teste, contexto, resultado);
    }
  },
};
