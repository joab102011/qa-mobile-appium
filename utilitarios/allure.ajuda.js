const allure = require('@wdio/allure-reporter').default;

function adicionarAmbiente(info = {}) {
  allure.addEnvironment('plataforma', info.plataforma || process.env.PLATFORM || 'Android');
  allure.addEnvironment(
    'dispositivo',
    info.dispositivo || process.env.NOME_DISPOSITIVO_ANDROID || process.env.BS_DEVICE_ANDROID || 'browserstack-android',
  );
  allure.addEnvironment('build', info.build || process.env.BS_BUILD || 'browserstack');
}

module.exports = { adicionarAmbiente };
