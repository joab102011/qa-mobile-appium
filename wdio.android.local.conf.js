const { config: compartilhado } = require('./wdio.compartilhado.conf.js');
const caminho = require('path');

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
  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': process.env.NOME_DISPOSITIVO_ANDROID || 'Android Emulator',
      'appium:platformVersion': process.env.VERSAO_ANDROID || '14.0',
      'appium:udid': process.env.UDID_ANDROID || 'emulator-5554',
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
    },
  ],
};
