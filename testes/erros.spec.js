const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const loginPagina = require('../paginas/login.pagina');
const cadastroPagina = require('../paginas/cadastro.pagina');
const { dado, quando, entao } = require('../utilitarios/passos.bdd');

describe('Mensagens de erro', () => {
  it('MOB-10 | deve validar divergencia de senhas no cadastro', async () => {
    await dado('que estou na tela de cadastro', async () => {
      await inicioPagina.fecharAlertaSeExistir();
      await inicioPagina.irParaLogin();
      await cadastroPagina.abrirAbaCadastro();
      expect(await cadastroPagina.campoRepetirSenha.isDisplayed()).to.equal(true);
    });

    await quando('informo senha e confirmacao diferentes e submeto', async () => {
      await cadastroPagina.realizarCadastro(
        `qa_erro_${Date.now()}@mail.com`,
        'Senha@123',
        'SenhaDiferente',
      );
    });

    await entao('vejo erro de senhas divergentes e nao ha alerta de sucesso', async () => {
      await browser.waitUntil(
        async () => {
          const mensagem = await $('//*[@text="Please enter the same password"]');
          return mensagem.isDisplayed().catch(() => false);
        },
        { timeout: 8000, timeoutMsg: 'Mensagem "Please enter the same password" nao apareceu' },
      );
      const mensagem = await $('//*[@text="Please enter the same password"]');
      expect(await mensagem.isDisplayed()).to.equal(true);

      const sucesso = await loginPagina.alertaSucesso.isDisplayed().catch(() => false);
      expect(sucesso, 'nao deve abrir alerta de sucesso com senhas divergentes').to.equal(false);
    });
  });
});
