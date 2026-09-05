const PaginaBase = require('./pagina.base');

class LoginPagina extends PaginaBase {
  get telaLogin() {
    return $('~Login-screen');
  }

  get campoEmail() {
    return $('~input-email');
  }

  get campoSenha() {
    return $('~input-password');
  }

  get botaoLogin() {
    return $('~button-LOGIN');
  }

  get abaLoginFormulario() {
    return $('~button-login-container');
  }

  get mensagemErroSenha() {
    return $('android=new UiSelector().textContains("password")');
  }

  get mensagemErroEmail() {
    return $('android=new UiSelector().textContains("email")');
  }

  get alertaSucesso() {
    return $('//*[@resource-id="android:id/alertTitle"]');
  }

  get botaoOkAlerta() {
    return $('//*[@resource-id="android:id/button1"]');
  }

  async abrirAbaLogin() {
    if (await this.abaLoginFormulario.isExisting()) {
      await this.tocar(this.abaLoginFormulario);
    }
  }

  async realizarLogin(email, senha) {
    await this.abrirAbaLogin();
    await this.aguardarExibir(this.campoEmail);
    await this.campoEmail.click();
    await this.campoEmail.clearValue();
    await this.campoEmail.setValue(email);
    await this.campoSenha.click();
    await this.campoSenha.clearValue();
    await this.campoSenha.setValue(senha);
    await this.esconderTeclado();
    await this.tocar(this.botaoLogin);
  }

  async textoAlerta() {
    await this.aguardarExibir(this.alertaSucesso);
    return this.alertaSucesso.getText();
  }

  async fecharAlerta() {
    if (await this.botaoOkAlerta.isDisplayed().catch(() => false)) {
      await this.tocar(this.botaoOkAlerta);
    }
  }

  async fecharAlertaSeExistir() {
    try {
      if (await this.alertaSucesso.isDisplayed().catch(() => false)) {
        await this.fecharAlerta();
        await browser.pause(400);
      }
    } catch (e) {
      // sem alerta aberto
    }
  }

  async esconderTeclado() {
    try {
      await driver.hideKeyboard();
    } catch (e) {
      await driver.back().catch(() => undefined);
    }
  }
}

module.exports = new LoginPagina();
