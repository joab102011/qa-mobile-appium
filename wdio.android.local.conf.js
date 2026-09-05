const { config: compartilhado } = require('./wdio.compartilhado.conf.js');
const caminho = require('path');
const fs = require('fs');
const {
  limparVideosUltimaExecucao,
  iniciarGravacao,
  finalizarGravacao,
} = require('./utilitarios/gravacao.tela');

/**
 * Emulador LOCAL exclusivo deste projeto: WdioDemo_API34
 * (criado em emulador/avd via npm run emulador:criar)
 * Não usa AVD de outros projetos.
 *
 * Gravacao: ao final de cada teste salva MP4 em
 * capturas/videos-ultima-execucao/ (ultima execucao local).
 */
const arquivoUdid = caminho.join(__dirname, 'emulador', 'udid-ativo.txt');
let udidProjeto = process.env.UDID_ANDROID;
if (!udidProjeto && fs.existsSync(arquivoUdid)) {
  udidProjeto = fs.readFileSync(arquivoUdid, 'utf8').trim();
}

const capacidade = {
  platformName: 'Android',
  'appium:deviceName': process.env.NOME_DISPOSITIVO_ANDROID || 'WdioDemo_API34',
  'appium:automationName': 'UiAutomator2',
  'appium:app': caminho.join(process.cwd(), 'apps', 'android.wdio.native.app.apk'),
  'appium:appPackage': 'com.wdiodemoapp',
  'appium:appActivity': 'com.wdiodemoapp.MainActivity',
  'appium:appWaitActivity': '*',
  'appium:newCommandTimeout': 240,
  'appium:autoGrantPermissions': true,
  'appium:noReset': false,
  'appium:fullReset': false,
  'appium:autoLaunch': true,
  'appium:adbExecTimeout': 90000,
  'appium:uiautomator2ServerLaunchTimeout': 90000,
  'appium:uiautomator2ServerInstallTimeout': 90000,
  'appium:appWaitDuration': 90000,
};

if (process.env.VERSAO_ANDROID) {
  capacidade['appium:platformVersion'] = process.env.VERSAO_ANDROID;
}

if (udidProjeto) {
  capacidade['appium:udid'] = udidProjeto;
}

exports.config = {
  ...compartilhado,
  port: 4723,
  services: [
    [
      'appium',
      {
        args: {
          relaxedSecurity: true,
        },
        command: 'appium',
      },
    ],
  ],
  capabilities: [capacidade],

  /**
   * Limpa videos da pasta "ultima execucao", exceto quando a suite sequencial
   * pediu para manter (varias specs no mesmo ciclo).
   */
  onPrepare() {
    if (process.env.MANTER_VIDEOS !== '1') {
      limparVideosUltimaExecucao();
      console.log('[gravacao] pasta capturas/videos-ultima-execucao limpa (nova execucao local)');
    }
  },

  beforeTest: async function () {
    await iniciarGravacao();
  },

  afterTest: async function (teste, contexto, resultado) {
    const arquivo = await finalizarGravacao(teste.title);
    if (arquivo) {
      console.log(`[gravacao] video salvo: ${arquivo}`);
      try {
        // eslint-disable-next-line no-undef
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
