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
 * Porta padrão 5560 (ver emulador/udid-ativo.txt após npm run emulador:iniciar).
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
  'appium:adbExecTimeout': 180000,
  'appium:uiautomator2ServerLaunchTimeout': 300000,
  'appium:uiautomator2ServerInstallTimeout': 300000,
  'appium:appWaitDuration': 120000,
  'appium:settingsAppStartupTimeout': 180000,
  'appium:androidInstallTimeout': 180000,
  'appium:disableWindowAnimation': true,
};

if (process.env.VERSAO_ANDROID) {
  capacidade['appium:platformVersion'] = process.env.VERSAO_ANDROID;
}

if (udidProjeto) {
  capacidade['appium:udid'] = udidProjeto;
}

/** Appium externo (npx appium): defina APPIUM_EXTERNO=1 e services vazios. */
const appiumExterno = process.env.APPIUM_EXTERNO === '1';

exports.config = {
  ...compartilhado,
  hostname: '127.0.0.1',
  port: 4723,
  services: appiumExterno
    ? []
    : [
        [
          'appium',
          {
            args: { relaxedSecurity: true },
            command: 'appium',
            appiumStartTimeout: 300000,
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
    if (!udidProjeto) {
      throw new Error(
        '[erro] UDID do emulador do projeto ausente. Rode `npm run emulador:iniciar` ' +
          '(grava emulador/udid-ativo.txt) ou defina UDID_ANDROID=emulator-5560. ' +
          'Isso evita conectar em AVD de outro projeto.',
      );
    }
    // Health-check leve: confirma que o UDID ainda aparece no adb
    try {
      const { execSync } = require('child_process');
      const sdk =
        process.env.ANDROID_HOME ||
        process.env.ANDROID_SDK_ROOT ||
        'D:\\Android\\Sdk';
      const adb = require('path').join(sdk, 'platform-tools', 'adb.exe');
      const lista = execSync(`"${adb}" devices`, {
        encoding: 'utf8',
        windowsHide: true,
        timeout: 15_000,
      });
      if (!lista.includes(udidProjeto)) {
        throw new Error(
          `[health-check] UDID ${udidProjeto} nao esta online no adb. Suba o emulador do projeto.`,
        );
      }
      console.log(`[health-check] dispositivo ${udidProjeto} online`);
    } catch (e) {
      if (e && e.message && e.message.includes('[health-check]')) {
        throw e;
      }
      console.warn(
        '[health-check] nao foi possivel validar adb (seguindo com UDID configurado):',
        e.message || e,
      );
    }
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
