const PaginaBase = require('./pagina.base');
const {
  tituloAlerta,
  botaoOkAlerta: seletorBotaoOk,
  ehIos,
} = require('../utilitarios/seletores');

const PACOTE_ANDROID = 'com.wdiodemoapp';
const BUNDLE_IOS =
  process.env.BUNDLE_ID_IOS ||
  process.env.BUNDLE_ID_APP ||
  'org.reactjs.native.example.wdiodemoapp';

class InicioPagina extends PaginaBase {
  get abaInicio() {
    return $('~Home');
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

  get alertaTitulo() {
    return tituloAlerta();
  }

  get botaoOkAlerta() {
    return seletorBotaoOk();
  }

  async fecharAlertaSeExistir() {
    for (let i = 0; i < 4; i += 1) {
      if (!ehIos()) {
        const anrWait = await $('//*[@resource-id="android:id/aerr_wait"]')
          .isDisplayed()
          .catch(() => false);
        if (anrWait) {
          await $('//*[@resource-id="android:id/aerr_wait"]').click();
          await browser.pause(1500);
          continue;
        }
        const anrClose = await $('//*[@resource-id="android:id/aerr_close"]')
          .isDisplayed()
          .catch(() => false);
        if (anrClose) {
          await $('//*[@resource-id="android:id/aerr_close"]').click();
          await browser.pause(800);
          await this.ativarApp();
          continue;
        }
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
    const idApp = ehIos() ? BUNDLE_IOS : PACOTE_ANDROID;
    try {
      await driver.activateApp(idApp);
    } catch (e) {
      if (!ehIos()) {
        try {
          await driver.startActivity(PACOTE_ANDROID, 'com.wdiodemoapp.MainActivity');
        } catch (e2) {
          // segue
        }
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

  async irParaInicio() {
    await this.aguardarMenuInferior();
    await this.tocar(this.abaInicio);
  }
}

module.exports = new InicioPagina();
