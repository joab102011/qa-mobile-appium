const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const formulariosPagina = require('../paginas/formularios.pagina');

describe('Formularios', () => {
  beforeEach(async () => {
    await inicioPagina.irParaFormularios();
  });

  it('MOB-05 | deve preencher input, switch e dropdown do formulario', async () => {
    await formulariosPagina.preencherFormulario('Texto QA Automation');
    const resultado = await formulariosPagina.textoDigitado.getText();
    expect(resultado).to.include('Texto QA Automation');

    await formulariosPagina.alternarInterruptor();
    const textoSwitch = await formulariosPagina.textoInterruptor.getText();
    expect(textoSwitch).to.match(/ON|OFF|Click|switch/i);

    await formulariosPagina.abrirDropdown();
    await formulariosPagina.selecionarOpcaoDropdown('Appium is awesome');
  });

  it('MOB-06 | deve submeter formulario ativo e validar feedback', async () => {
    await formulariosPagina.preencherFormulario('Envio ativo');
    await formulariosPagina.ativarBotao();

    await formulariosPagina.aguardarExibir(formulariosPagina.alertaTitulo);
    const titulo = await formulariosPagina.alertaTitulo.getText();
    expect(titulo).to.match(/Active|This button is|Success/i);

    if (await formulariosPagina.botaoOkAlerta.isDisplayed()) {
      await formulariosPagina.tocar(formulariosPagina.botaoOkAlerta);
    }
  });
});
