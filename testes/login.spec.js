const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const loginPagina = require('../paginas/login.pagina');
const usuarios = require('../dados/usuarios-login.json');
const { adicionarAmbiente } = require('../utilitarios/allure.ajuda');
const { dado, quando, entao } = require('../utilitarios/passos.bdd');

describe('Login', () => {
  before(async () => {
    adicionarAmbiente({ plataforma: 'Android' });
  });

  beforeEach(async () => {
    await loginPagina.fecharAlertaSeExistir();
    await loginPagina.esconderTeclado();
    await inicioPagina.irParaLogin();
    await loginPagina.abrirAbaLogin();
  });

  it('MOB-01 | deve realizar login com credenciais validas', async () => {
    const usuario = usuarios.find((u) => u.cenario === 'login_valido');
    let titulo = '';

    await dado('que estou na tela de Login com usuario valido do arquivo de dados', async () => {
      expect(usuario).to.exist;
      expect(await loginPagina.campoEmail.isDisplayed()).to.equal(true);
    });

    await quando('preencho email e senha validos e toco em LOGIN', async () => {
      await loginPagina.realizarLogin(usuario.email, usuario.senha);
    });

    await entao('vejo alerta de sucesso', async () => {
      titulo = await loginPagina.textoAlerta();
      expect(titulo).to.match(/success|sucesso|Success/i);
      await loginPagina.fecharAlerta();
    });
  });

  it('MOB-02 | deve exibir erro ao informar senha invalida', async () => {
    const usuario = usuarios.find((u) => u.cenario === 'senha_invalida');

    await dado('que estou na tela de Login', async () => {
      expect(await loginPagina.campoEmail.isDisplayed()).to.equal(true);
    });

    await quando('informo senha curta/invalida e submeto o login', async () => {
      // Demo app valida tamanho minimo; senha curta dispara mensagem de erro
      await loginPagina.realizarLogin(usuario.email, usuario.senha);
    });

    await entao('vejo mensagem de senha invalida e nao abro alerta de sucesso', async () => {
      await browser.pause(800);
      const erroSenha = await loginPagina.mensagemErroSenha.isDisplayed().catch(() => false);
      const erroGenerico = await $('android=new UiSelector().textContains("Please enter")')
        .isDisplayed()
        .catch(() => false);
      const alertaVisivel = await loginPagina.alertaSucesso.isDisplayed().catch(() => false);
      expect(erroSenha || erroGenerico).to.equal(true);
      expect(alertaVisivel).to.equal(false);
    });
  });

  it('MOB-09 | deve validar campos obrigatorios vazios no login', async () => {
    await dado('que estou na aba de Login sem preencher campos', async () => {
      expect(await loginPagina.campoEmail.isDisplayed()).to.equal(true);
    });

    await quando('toco no botao LOGIN com campos vazios', async () => {
      await loginPagina.tocar(loginPagina.botaoLogin);
    });

    await entao('permaneco na tela de login sem alerta de sucesso', async () => {
      await browser.pause(500);
      const alertaVisivel = await loginPagina.alertaSucesso.isDisplayed().catch(() => false);
      const emailVisivel = await loginPagina.campoEmail.isDisplayed().catch(() => false);
      const erroEmail = await $('//*[@text="Please enter a valid email address"]')
        .isDisplayed()
        .catch(() => false);
      expect(alertaVisivel).to.equal(false);
      expect(emailVisivel || erroEmail).to.equal(true);
    });
  });
});
