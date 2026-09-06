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

  /**
   * Texto principal visível no carrossel (para assertar mudança após gesto).
   */
  async textoCartaoVisivel() {
    const candidatos = [
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
        // tenta proximo seletor
      }
    }
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
}

module.exports = new SwipePagina();
