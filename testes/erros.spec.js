const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const loginPagina = require('../paginas/login.pagina');
const cadastroPagina = require('../paginas/cadastro.pagina');

describe('Mensagens de erro', () => {
  it('MOB-10 | deve validar divergencia de senhas no cadastro', async () => {
    await inicioPagina.irParaLogin();
    await cadastroPagina.realizarCadastro(
      `qa_erro_${Date.now()}@mail.com`,
      'Senha@123',
      'SenhaDiferente',
    );

    const mensagem = await $(
      '//*[@text="Please enter the same password"]',
    );
    const visivel = await mensagem.isDisplayed().catch(() => false);
    const aindaNoCadastro = await cadastroPagina.campoRepetirSenha.isDisplayed();

    expect(visivel || aindaNoCadastro).to.equal(true);
    // Garante que nao houve alerta de sucesso
    const sucesso = await loginPagina.alertaSucesso.isDisplayed().catch(() => false);
    expect(sucesso).to.equal(false);
  });
});
