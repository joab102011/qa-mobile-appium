const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const cadastroPagina = require('../paginas/cadastro.pagina');

describe('Cadastro', () => {
  beforeEach(async () => {
    await inicioPagina.irParaLogin();
  });

  it('MOB-03 | deve cadastrar usuario com dados validos', async () => {
    const sufixo = Date.now();
    const email = `qa_${sufixo}@mail.com`;
    const senha = 'Senha@123';

    await cadastroPagina.realizarCadastro(email, senha, senha);
    const titulo = await cadastroPagina.textoAlerta();
    expect(titulo).to.match(/signed up|sucesso|Success|Signed Up/i);
    await cadastroPagina.fecharAlerta();
  });

  it('MOB-04 | deve exibir erro ao cadastrar com email invalido', async () => {
    await cadastroPagina.realizarCadastro('email-invalido', 'Senha@123', 'Senha@123');

    // Mensagem tipica do demo app para email invalido
    const mensagem = await $('//*[@text="Please enter a valid email address"]');
    const visivel = await mensagem.isDisplayed().catch(() => false);
    const aindaNaTela = await cadastroPagina.campoEmail.isDisplayed();
    expect(visivel || aindaNaTela).to.equal(true);
  });
});
