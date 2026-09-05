const PaginaBase = require('./pagina.base');

class CadastroPagina extends PaginaBase {
  get abaCadastro() {
    return $('~button-sign-up-container');
  }

  get campoEmail() {
    return $('~input-email');
  }

  get campoSenha() {
    return $('~input-password');
  }

  get campoRepetirSenha() {
    return $('~input-repeat-password');
  }

  get botaoCadastrar() {
    return $('~button-SIGN UP');
  }

  get alertaTitulo() {
    return $('//*[@resource-id="android:id/alertTitle"]');
  }

  get botaoOkAlerta() {
    return $('//*[@resource-id="android:id/button1"]');
  }

  async formularioCadastroVisivel() {
    return this.campoRepetirSenha.isDisplayed().catch(() => false);
  }

  /**
   * Abre a aba Sign up sem travar 15s se o formulario ja estiver aberto.
   */
  async abrirAbaCadastro() {
    if (await this.formularioCadastroVisivel()) {
      return;
    }
    const aba = this.abaCadastro;
    if (await aba.isExisting().catch(() => false)) {
      try {
        await aba.waitForDisplayed({ timeout: 8000 });
        await aba.click();
      } catch (e) {
        // tenta seguir se o campo ja estiver visivel
      }
    }
    await this.aguardarExibir(this.campoRepetirSenha, 12000);
  }

  async realizarCadastro(email, senha, repetirSenha = senha) {
    await this.abrirAbaCadastro();
    await this.preencher(this.campoEmail, email);
    await this.preencher(this.campoSenha, senha);
    await this.preencher(this.campoRepetirSenha, repetirSenha);
    try {
      await driver.hideKeyboard();
    } catch (e) {
      await driver.back().catch(() => undefined);
    }
    await this.tocar(this.botaoCadastrar);
  }

  async textoAlerta() {
    await this.aguardarExibir(this.alertaTitulo);
    return this.alertaTitulo.getText();
  }

  async fecharAlerta() {
    if (await this.botaoOkAlerta.isDisplayed().catch(() => false)) {
      await this.tocar(this.botaoOkAlerta);
    }
  }
}

module.exports = new CadastroPagina();
