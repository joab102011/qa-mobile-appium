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

  async abrirAbaCadastro() {
    await this.tocar(this.abaCadastro);
  }

  async realizarCadastro(email, senha, repetirSenha = senha) {
    await this.abrirAbaCadastro();
    await this.preencher(this.campoEmail, email);
    await this.preencher(this.campoSenha, senha);
    await this.preencher(this.campoRepetirSenha, repetirSenha);
    await this.tocar(this.botaoCadastrar);
  }

  async textoAlerta() {
    await this.aguardarExibir(this.alertaTitulo);
    return this.alertaTitulo.getText();
  }

  async fecharAlerta() {
    if (await this.botaoOkAlerta.isDisplayed()) {
      await this.tocar(this.botaoOkAlerta);
    }
  }
}

module.exports = new CadastroPagina();
