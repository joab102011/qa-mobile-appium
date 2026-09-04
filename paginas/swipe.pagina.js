const PaginaBase = require('./pagina.base');

class SwipePagina extends PaginaBase {
  get telaSwipe() {
    return $('~Swipe-screen');
  }

  get carrossel() {
    return $('~Carousel');
  }

  get cartaoVisivel() {
    return $('~Swipe-screen');
  }

  async telaEstaVisivel() {
    return this.telaSwipe.isDisplayed();
  }
}

module.exports = new SwipePagina();
