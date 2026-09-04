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

  get mensagemErroEmail() {
    return $('~error-message-email');
  }

  get mensagemErroSenha() {
    return $('//*[@text="Please enter a valid password"]');
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
    await this.preencher(this.campoEmail, email);
    await this.preencher(this.campoSenha, senha);
    await this.tocar(this.botaoLogin);
  }

  async textoAlerta() {
    await this.aguardarExibir(this.alertaSucesso);
    return this.alertaSucesso.getText();
  }

  async fecharAlerta() {
    if (await this.botaoOkAlerta.isDisplayed()) {
      await this.tocar(this.botaoOkAlerta);
    }
  }
}

module.exports = new LoginPagina();
