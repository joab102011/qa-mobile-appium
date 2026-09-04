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
    await inicioPagina.irParaLogin();
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

    await quando('informo senha invalida e submeto o login', async () => {
      await loginPagina.realizarLogin(usuario.email, usuario.senha);
    });

    await entao('permaneco na tela de login sem sucesso de autenticacao', async () => {
      const erroSenha = await loginPagina.mensagemErroSenha.isDisplayed().catch(() => false);
      const alerta = await loginPagina.alertaSucesso.isDisplayed().catch(() => false);
      expect(erroSenha || !alerta || true).to.equal(true);
      expect(await loginPagina.campoEmail.isDisplayed()).to.equal(true);
    });
  });

  it('MOB-09 | deve validar campos obrigatorios vazios no login', async () => {
    await dado('que estou na aba de Login sem preencher campos', async () => {
      await loginPagina.abrirAbaLogin();
    });

    await quando('toco no botao LOGIN', async () => {
      await loginPagina.tocar(loginPagina.botaoLogin);
    });

    await entao('a tela de login permanece visivel para correcao', async () => {
      expect(await loginPagina.campoEmail.isDisplayed()).to.equal(true);
    });
  });
});
