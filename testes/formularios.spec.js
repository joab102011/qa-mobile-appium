const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const formulariosPagina = require('../paginas/formularios.pagina');
const { dado, quando, entao } = require('../utilitarios/passos.bdd');

describe('Formularios', () => {
  beforeEach(async () => {
    await inicioPagina.irParaFormularios();
  });

  it('MOB-05 | deve preencher input, switch e dropdown do formulario', async () => {
    await dado('que estou na tela de Formularios', async () => {
      expect(await formulariosPagina.campoTexto.isDisplayed()).to.equal(true);
    });

    await quando('preencho texto, altero o switch e seleciono opcao no dropdown', async () => {
      await formulariosPagina.preencherFormulario('Texto QA Automation');
      await formulariosPagina.alternarInterruptor();
      await formulariosPagina.abrirDropdown();
      await formulariosPagina.selecionarOpcaoDropdown('Appium is awesome');
    });

    await entao('o texto digitado aparece no resultado do formulario', async () => {
      const resultado = await formulariosPagina.textoDigitado.getText();
      expect(resultado).to.include('Texto QA Automation');
      const textoSwitch = await formulariosPagina.textoInterruptor.getText();
      expect(textoSwitch).to.match(/ON|OFF|Click|switch/i);
    });
  });

  it('MOB-06 | deve submeter formulario ativo e validar feedback', async () => {
    await dado('que preenchi o campo de texto do formulario', async () => {
      await formulariosPagina.preencherFormulario('Envio ativo');
    });

    await quando('toco no botao Active', async () => {
      await formulariosPagina.ativarBotao();
    });

    await entao('vejo alerta confirmando a acao do botao Active', async () => {
      await formulariosPagina.aguardarExibir(formulariosPagina.alertaTitulo);
      const titulo = await formulariosPagina.alertaTitulo.getText();
      expect(titulo).to.match(/Active|This button is|Success/i);
      if (await formulariosPagina.botaoOkAlerta.isDisplayed()) {
        await formulariosPagina.tocar(formulariosPagina.botaoOkAlerta);
      }
    });
  });
});
