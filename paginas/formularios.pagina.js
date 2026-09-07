const PaginaBase = require('./pagina.base');
const {
  tituloAlerta,
  botaoOkAlerta: seletorBotaoOk,
  opcaoPorTexto,
} = require('../utilitarios/seletores');

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
    return tituloAlerta();
  }

  get botaoOkAlerta() {
    return seletorBotaoOk();
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
    await this.tocar(opcaoPorTexto(textoOpcao));
  }

  async ativarBotao() {
    await this.tocar(this.botaoAtivo);
  }
}

module.exports = new FormulariosPagina();
