const allure = require('@wdio/allure-reporter').default;

function adicionarAmbiente(info = {}) {
  allure.addEnvironment('plataforma', info.plataforma || process.env.PLATFORM || 'Android');
  allure.addEnvironment(
    'dispositivo',
    info.dispositivo || process.env.NOME_DISPOSITIVO_ANDROID || 'emulador',
  );
  allure.addEnvironment('build', info.build || process.env.BS_BUILD || 'local');
}

module.exports = { adicionarAmbiente };
