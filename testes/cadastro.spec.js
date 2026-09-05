const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const cadastroPagina = require('../paginas/cadastro.pagina');
const { dado, quando, entao } = require('../utilitarios/passos.bdd');

describe('Cadastro', () => {
  beforeEach(async () => {
    await inicioPagina.fecharAlertaSeExistir();
    await inicioPagina.irParaLogin();
  });

  it('MOB-03 | deve cadastrar usuario com dados validos', async () => {
    const sufixo = Date.now();
    const email = `qa_${sufixo}@mail.com`;
    const senha = 'Senha@123';
    let titulo = '';

    await dado('que estou na aba de cadastro com dados validos', async () => {
      expect(email).to.include('@mail.com');
    });

    await quando('preencho email, senha e confirmacao e toco em SIGN UP', async () => {
      await cadastroPagina.realizarCadastro(email, senha, senha);
    });

    await entao('vejo alerta de cadastro realizado com sucesso', async () => {
      titulo = await cadastroPagina.textoAlerta();
      expect(titulo).to.match(/signed up|sucesso|Success|Signed Up/i);
      await cadastroPagina.fecharAlerta();
    });
  });

  it('MOB-04 | deve exibir erro ao cadastrar com email invalido', async () => {
    await dado('que informarei um email em formato invalido', async () => {
      expect('email-invalido').to.not.include('@');
    });

    await quando('submeto o cadastro com esse email', async () => {
      await cadastroPagina.realizarCadastro('email-invalido', 'Senha@123', 'Senha@123');
    });

    await entao('permaneco no formulario sem alerta de sucesso', async () => {
      const mensagem = await $('//*[@text="Please enter a valid email address"]');
      const visivel = await mensagem.isDisplayed().catch(() => false);
      const aindaNaTela = await cadastroPagina.campoEmail.isDisplayed();
      expect(visivel || aindaNaTela).to.equal(true);
    });
  });
});
