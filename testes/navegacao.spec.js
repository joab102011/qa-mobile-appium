const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const swipePagina = require('../paginas/swipe.pagina');
const { deslizarParaEsquerda } = require('../utilitarios/gestos');

describe('Navegacao', () => {
  it('MOB-07 | deve navegar entre abas Inicio, Formularios e Swipe', async () => {
    await inicioPagina.irParaInicio();
    expect(await inicioPagina.abaInicio.isDisplayed()).to.equal(true);

    await inicioPagina.irParaFormularios();
    expect(await inicioPagina.abaFormularios.isDisplayed()).to.equal(true);

    await inicioPagina.irParaSwipe();
    expect(await swipePagina.telaEstaVisivel()).to.equal(true);
  });

  it('MOB-08 | deve abrir Swipe e realizar gesto de deslize', async () => {
    await inicioPagina.irParaSwipe();
    expect(await swipePagina.telaEstaVisivel()).to.equal(true);

    await deslizarParaEsquerda();
    // Apos o gesto a tela Swipe continua visivel
    expect(await swipePagina.telaEstaVisivel()).to.equal(true);
  });
});
