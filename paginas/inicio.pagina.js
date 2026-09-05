const PaginaBase = require('./pagina.base');

const PACOTE_APP = 'com.wdiodemoapp';

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

  get alertaTitulo() {
    return $('//*[@resource-id="android:id/alertTitle"]');
  }

  get botaoOkAlerta() {
    return $('//*[@resource-id="android:id/button1"]');
  }

  async fecharAlertaSeExistir() {
    for (let i = 0; i < 4; i += 1) {
      // ANR do sistema (Process isn't responding)
      const anrWait = await $('//*[@resource-id="android:id/aerr_wait"]').isDisplayed().catch(() => false);
      if (anrWait) {
        await $('//*[@resource-id="android:id/aerr_wait"]').click();
        await browser.pause(1500);
        continue;
      }
      const anrClose = await $('//*[@resource-id="android:id/aerr_close"]').isDisplayed().catch(() => false);
      if (anrClose) {
        await $('//*[@resource-id="android:id/aerr_close"]').click();
        await browser.pause(800);
        await this.ativarApp();
        continue;
      }

      const visivel = await this.alertaTitulo.isDisplayed().catch(() => false);
      if (!visivel) {
        return;
      }
      const ok = await this.botaoOkAlerta.isDisplayed().catch(() => false);
      if (ok) {
        await this.botaoOkAlerta.click();
        await browser.pause(400);
      } else {
        await driver.back().catch(() => undefined);
      }
    }
  }

  async ativarApp() {
    try {
      await driver.activateApp(PACOTE_APP);
    } catch (e) {
      try {
        await driver.startActivity(PACOTE_APP, 'com.wdiodemoapp.MainActivity');
      } catch (e2) {
        // segue para wait do menu
      }
    }
    await browser.pause(800);
  }

  async aguardarMenuInferior(tempoMs = 30000) {
    await this.fecharAlertaSeExistir();
    try {
      await browser.waitUntil(
        async () =>
          (await this.abaInicio.isDisplayed().catch(() => false)) ||
          (await this.abaLogin.isDisplayed().catch(() => false)) ||
          (await this.abaFormularios.isDisplayed().catch(() => false)) ||
          (await this.abaSwipe.isDisplayed().catch(() => false)),
        {
          timeout: Math.min(tempoMs, 12000),
          interval: 500,
          timeoutMsg: 'temp',
        },
      );
      return;
    } catch (e) {
      await this.ativarApp();
      await this.fecharAlertaSeExistir();
    }

    await browser.waitUntil(
      async () =>
        (await this.abaInicio.isDisplayed().catch(() => false)) ||
        (await this.abaLogin.isDisplayed().catch(() => false)) ||
        (await this.abaFormularios.isDisplayed().catch(() => false)) ||
        (await this.abaSwipe.isDisplayed().catch(() => false)),
      {
        timeout: tempoMs,
        interval: 500,
        timeoutMsg: 'Menu inferior do demo app nao ficou visivel',
      },
    );
  }

  async irParaLogin() {
    await this.aguardarMenuInferior();
    await this.tocar(this.abaLogin);
  }

  async irParaFormularios() {
    await this.aguardarMenuInferior();
    await this.tocar(this.abaFormularios);
  }

  async irParaSwipe() {
    await this.aguardarMenuInferior();
    await this.tocar(this.abaSwipe);
  }

  async irParaWebview() {
    await this.aguardarMenuInferior();
    await this.tocar(this.abaWebview);
  }

  async irParaInicio() {
    await this.aguardarMenuInferior();
    await this.tocar(this.abaInicio);
  }
}

module.exports = new InicioPagina();
