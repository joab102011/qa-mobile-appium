const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const swipePagina = require('../paginas/swipe.pagina');
const { deslizarParaEsquerda } = require('../utilitarios/gestos');
const { dado, quando, entao } = require('../utilitarios/passos.bdd');

describe('Navegacao', () => {
  it('MOB-07 | deve navegar entre abas Inicio, Formularios e Swipe', async () => {
    await dado('que o aplicativo esta aberto na navegacao inferior', async () => {
      expect(await inicioPagina.abaInicio.isDisplayed()).to.equal(true);
    });

    await quando('navego pelas abas Inicio, Formularios e Swipe', async () => {
      await inicioPagina.irParaInicio();
      await inicioPagina.irParaFormularios();
      await inicioPagina.irParaSwipe();
    });

    await entao('a tela Swipe fica visivel', async () => {
      expect(await swipePagina.telaEstaVisivel()).to.equal(true);
      expect(await inicioPagina.abaFormularios.isDisplayed()).to.equal(true);
    });
  });

  it('MOB-08 | deve abrir Swipe e realizar gesto de deslize', async () => {
    await dado('que abri a aba Swipe', async () => {
      await inicioPagina.irParaSwipe();
      expect(await swipePagina.telaEstaVisivel()).to.equal(true);
    });

    await quando('realizo gesto de deslize para a esquerda', async () => {
      await deslizarParaEsquerda();
    });

    await entao('permaneco na tela Swipe apos o gesto', async () => {
      expect(await swipePagina.telaEstaVisivel()).to.equal(true);
    });
  });
});
