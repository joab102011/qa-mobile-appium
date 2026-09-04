/**
 * Página base — waits e helpers comuns Appium/WDIO.
 */
class PaginaBase {
  async aguardarExibir(elemento, tempoMs = 15000) {
    await elemento.waitForDisplayed({ timeout: tempoMs });
    return elemento;
  }

  async tocar(elemento) {
    await this.aguardarExibir(elemento);
    await elemento.click();
  }

  async preencher(elemento, texto) {
    await this.aguardarExibir(elemento);
    await elemento.setValue(texto);
  }

  async textoVisivel(elemento) {
    await this.aguardarExibir(elemento);
    return elemento.getText();
  }
}

module.exports = PaginaBase;
