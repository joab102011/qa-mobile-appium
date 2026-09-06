const { expect } = require('chai');
const inicioPagina = require('../paginas/inicio.pagina');
const swipePagina = require('../paginas/swipe.pagina');
const { deslizarParaEsquerda } = require('../utilitarios/gestos');
const { dado, quando, entao } = require('../utilitarios/passos.bdd');

describe('Navegacao', () => {
  beforeEach(async () => {
    await inicioPagina.fecharAlertaSeExistir();
    await inicioPagina.ativarApp();
  });

  it('MOB-07 | deve navegar entre abas Inicio, Formularios e Swipe @smoke', async () => {
    await dado('que o menu inferior do aplicativo esta disponivel', async () => {
      await inicioPagina.aguardarMenuInferior();
    });

    await quando('navego pelas abas Inicio, Formularios e Swipe', async () => {
      await inicioPagina.irParaInicio();
      await inicioPagina.irParaFormularios();
      await inicioPagina.irParaSwipe();
    });

    await entao('a tela Swipe fica visivel', async () => {
      expect(await swipePagina.telaEstaVisivel()).to.equal(true);
      expect(await inicioPagina.abaSwipe.isDisplayed()).to.equal(true);
    });
  });

  it('MOB-08 | deve abrir Swipe e realizar gesto de deslize', async () => {
    let textoAntes = '';

    await dado('que abri a aba Swipe', async () => {
      await inicioPagina.irParaSwipe();
      expect(await swipePagina.telaEstaVisivel()).to.equal(true);
      textoAntes = await swipePagina.textoCartaoVisivel();
      expect(textoAntes.length, 'esperava texto visivel no carrossel').to.be.greaterThan(0);
    });

    await quando('realizo gesto de deslize para a esquerda', async () => {
      await deslizarParaEsquerda();
    });

    await entao('o conteudo do carrossel muda e permaneco na tela Swipe', async () => {
      expect(await swipePagina.telaEstaVisivel()).to.equal(true);
      await browser.waitUntil(
        async () => {
          const depois = await swipePagina.textoCartaoVisivel();
          return depois.length > 0 && depois !== textoAntes;
        },
        {
          timeout: 8000,
          timeoutMsg: `Carrossel nao mudou apos swipe (antes="${textoAntes}")`,
        },
      );
      const textoDepois = await swipePagina.textoCartaoVisivel();
      expect(textoDepois).to.not.equal(textoAntes);
    });
  });
});
