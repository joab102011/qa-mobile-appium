/**
 * Helpers DADO / QUANDO / ENTAO para specs Mocha + Allure (mobile).
 */
const allure = require('@wdio/allure-reporter').default;

async function executarPasso(rotulo, descricao, acao) {
  const titulo = `${rotulo} ${descricao}`;
  allure.addStep(titulo);
  await acao();
}

async function dado(descricao, acao) {
  await executarPasso('DADO', descricao, acao);
}

async function quando(descricao, acao) {
  await executarPasso('QUANDO', descricao, acao);
}

async function entao(descricao, acao) {
  await executarPasso('ENTÃO', descricao, acao);
}

module.exports = { dado, quando, entao };
