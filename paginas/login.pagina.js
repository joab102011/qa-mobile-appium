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
    return $('android=new UiSelector().textContains("at least 8 characters")');
  }

  get mensagemErroEmail() {
    return $('android=new UiSelector().textContains("valid email")');
  }

  get mensagemErroGenerica() {
    return $('android=new UiSelector().textContains("Please enter")');
  }

  get alertaSucesso() {
    return $('//*[@resource-id="android:id/alertTitle"]');
  }

  get botaoOkAlerta() {
    return $('//*[@resource-id="android:id/button1"]');
  }

  async formularioVisivel() {
    return this.campoEmail.isDisplayed().catch(() => false);
  }

  /**
   * Garante a aba Login do formulario. Nao espera 15s se o form ja estiver aberto
   * (apos alerta de sucesso o ~button-login-container pode nao aparecer).
   */
  async abrirAbaLogin() {
    if (await this.formularioVisivel()) {
      return;
    }
    const aba = this.abaLoginFormulario;
    if (await aba.isExisting().catch(() => false)) {
      try {
        await aba.waitForDisplayed({ timeout: 5000 });
        await aba.click();
      } catch (e) {
        // segue: talvez o form ja esteja acessivel
      }
    }
    await this.aguardarExibir(this.campoEmail, 10000);
  }

  async limparCampos() {
    await this.aguardarExibir(this.campoEmail);
    await this.campoEmail.click();
    await this.campoEmail.clearValue();
    await this.campoSenha.click();
    await this.campoSenha.clearValue();
    await this.esconderTeclado();
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

  async alertaVisivel() {
    return this.alertaSucesso.isDisplayed().catch(() => false);
  }

  async fecharAlerta() {
    if (await this.botaoOkAlerta.isDisplayed().catch(() => false)) {
      await this.tocar(this.botaoOkAlerta);
      await browser.pause(400);
    }
  }

  async fecharAlertaSeExistir() {
    for (let i = 0; i < 3; i += 1) {
      try {
        if (await this.alertaVisivel()) {
          await this.fecharAlerta();
        } else {
          break;
        }
      } catch (e) {
        break;
      }
    }
  }

  async esconderTeclado() {
    try {
      await driver.hideKeyboard();
    } catch (e) {
      await driver.back().catch(() => undefined);
    }
  }

  async houveErroValidacao() {
    const checks = [
      this.mensagemErroSenha,
      this.mensagemErroEmail,
      this.mensagemErroGenerica,
    ];
    for (const el of checks) {
      if (await el.isDisplayed().catch(() => false)) {
        return true;
      }
    }
    return false;
  }
}

module.exports = new LoginPagina();
