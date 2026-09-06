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
    // Volta ao Home para limpar estado entre cenarios (alerta/sucesso residual)
    await inicioPagina.irParaInicio().catch(async () => {
      await loginPagina.fecharAlertaSeExistir();
    });
    await loginPagina.fecharAlertaSeExistir();
    await inicioPagina.irParaLogin();
    await loginPagina.abrirAbaLogin();
    await loginPagina.limparCampos();
  });

  it('MOB-01 | deve realizar login com credenciais validas @smoke', async () => {
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
      // Demo app: senha com menos de 8 caracteres dispara validacao na UI
      await loginPagina.realizarLogin(usuario.email, usuario.senha);
    });

    await entao('vejo mensagem de senha invalida e nao abro alerta de sucesso', async () => {
      await browser.waitUntil(
        async () => (await loginPagina.houveErroValidacao()) || (await loginPagina.alertaVisivel()),
        { timeout: 8000, timeoutMsg: 'Sem feedback de validacao apos senha invalida' },
      );
      const erro = await loginPagina.houveErroValidacao();
      const alertaVisivel = await loginPagina.alertaVisivel();
      expect(erro, 'esperava mensagem de validacao de senha/email').to.equal(true);
      expect(alertaVisivel, 'nao deve abrir alerta de sucesso').to.equal(false);
    });
  });

  it('MOB-09 | deve validar campos obrigatorios vazios no login', async () => {
    await dado('que estou na aba de Login sem preencher campos', async () => {
      await loginPagina.limparCampos();
      expect(await loginPagina.campoEmail.isDisplayed()).to.equal(true);
    });

    await quando('toco no botao LOGIN com campos vazios', async () => {
      await loginPagina.esconderTeclado();
      await loginPagina.tocar(loginPagina.botaoLogin);
    });

    await entao('vejo mensagem de validacao e nao abro alerta de sucesso', async () => {
      await browser.waitUntil(
        async () => (await loginPagina.houveErroValidacao()) || (await loginPagina.alertaVisivel()),
        { timeout: 8000, timeoutMsg: 'Sem feedback apos login com campos vazios' },
      );
      const alertaVisivel = await loginPagina.alertaVisivel();
      const erro = await loginPagina.houveErroValidacao();
      expect(alertaVisivel, 'nao deve abrir alerta de sucesso com campos vazios').to.equal(false);
      expect(erro, 'esperava mensagem de validacao (Please enter / email / senha)').to.equal(true);
    });
  });
});
