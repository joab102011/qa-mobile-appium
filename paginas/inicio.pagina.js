const PaginaBase = require('./pagina.base');

class InicioPagina extends PaginaBase {
  get abaInicio() {
    return $('~Home');
  }

  get abaWebview() {
    return $('~Webview');
  }

  get abaLogin() {
    return $('~Login');
  }

  get abaFormularios() {
    return $('~Forms');
  }

  get abaSwipe() {
    return $('~Swipe');
  }

  get abaDrag() {
    return $('~Drag');
  }

  async irParaLogin() {
    await this.tocar(this.abaLogin);
  }

  async irParaFormularios() {
    await this.tocar(this.abaFormularios);
  }

  async irParaSwipe() {
    await this.tocar(this.abaSwipe);
  }

  async irParaWebview() {
    await this.tocar(this.abaWebview);
  }

  async irParaInicio() {
    await this.tocar(this.abaInicio);
  }
}

module.exports = new InicioPagina();
