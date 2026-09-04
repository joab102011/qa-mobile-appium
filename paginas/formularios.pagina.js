const PaginaBase = require('./pagina.base');

class FormulariosPagina extends PaginaBase {
  get telaFormularios() {
    return $('~Forms-screen');
  }

  get campoTexto() {
    return $('~text-input');
  }

  get textoDigitado() {
    return $('~input-text-result');
  }

  get interruptor() {
    return $('~switch');
  }

  get textoInterruptor() {
    return $('~switch-text');
  }

  get dropdown() {
    return $('~Dropdown');
  }

  get botaoAtivo() {
    return $('~button-Active');
  }

  get botaoInativo() {
    return $('~button-Inactive');
  }

  get alertaTitulo() {
    return $('//*[@resource-id="android:id/alertTitle"]');
  }

  get botaoOkAlerta() {
    return $('//*[@resource-id="android:id/button1"]');
  }

  async preencherFormulario(texto) {
    await this.preencher(this.campoTexto, texto);
  }

  async alternarInterruptor() {
    await this.tocar(this.interruptor);
  }

  async abrirDropdown() {
    await this.tocar(this.dropdown);
  }

  async selecionarOpcaoDropdown(textoOpcao) {
    const opcao = $(`//*[@text="${textoOpcao}"]`);
    await this.tocar(opcao);
  }

  async ativarBotao() {
    await this.tocar(this.botaoAtivo);
  }
}

module.exports = new FormulariosPagina();
