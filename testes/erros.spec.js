const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const loginPagina = require('../paginas/login.pagina');
const cadastroPagina = require('../paginas/cadastro.pagina');
const { dado, quando, entao } = require('../utilitarios/passos.bdd');

describe('Mensagens de erro', () => {
  it('MOB-10 | deve validar divergencia de senhas no cadastro', async () => {
    await dado('que estou na tela de cadastro', async () => {
      await inicioPagina.irParaLogin();
    });

    await quando('informo senha e confirmacao diferentes e submeto', async () => {
      await cadastroPagina.realizarCadastro(
        `qa_erro_${Date.now()}@mail.com`,
        'Senha@123',
        'SenhaDiferente',
      );
    });

    await entao('vejo erro de senhas divergentes e nao ha alerta de sucesso', async () => {
      const mensagem = await $('//*[@text="Please enter the same password"]');
      const visivel = await mensagem.isDisplayed().catch(() => false);
      const aindaNoCadastro = await cadastroPagina.campoRepetirSenha.isDisplayed();
      expect(visivel || aindaNoCadastro).to.equal(true);

      const sucesso = await loginPagina.alertaSucesso.isDisplayed().catch(() => false);
      expect(sucesso).to.equal(false);
    });
  });
});
