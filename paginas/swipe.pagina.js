const PaginaBase = require('./pagina.base');
const { ehIos } = require('../utilitarios/seletores');

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

  async textoCartaoVisivel() {
    const candidatos = ehIos()
      ? [
          $('~slideTextContainer'),
          $('-ios class chain:**/XCUIElementTypeStaticText'),
        ]
      : [
          $('android=new UiSelector().resourceIdMatches(".*slideTextContainer.*")'),
          $('~slideTextContainer'),
          $('android=new UiSelector().className("android.widget.TextView").instance(1)'),
        ];
    for (const el of candidatos) {
      try {
        if (await el.isDisplayed()) {
          const txt = (await el.getText()).trim();
          if (txt.length > 2) {
            return txt;
          }
        }
      } catch (e) {
        // tenta proximo
      }
    }
    if (!ehIos()) {
      const textos = await $$('//*[@content-desc="Swipe-screen"]//android.widget.TextView');
      const partes = [];
      for (const t of textos) {
        const txt = (await t.getText().catch(() => '')).trim();
        if (txt) {
          partes.push(txt);
        }
      }
      return partes.join(' | ');
    }
    return '';
  }
}

module.exports = new SwipePagina();
