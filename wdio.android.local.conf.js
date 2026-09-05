const { config: compartilhado } = require('./wdio.compartilhado.conf.js');
const caminho = require('path');
const fs = require('fs');

/**
 * Emulador LOCAL exclusivo deste projeto: WdioDemo_API34
 * (criado em emulador/avd via npm run emulador:criar)
 * Não usa AVD de outros projetos.
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
};
