const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Baixa o APK do native-demo-app (release pública WebdriverIO).
 * Ajuste a URL se a versão mudar: https://github.com/webdriverio/native-demo-app/releases
 */
const urlApk =
  process.env.URL_APK_DEMO ||
  'https://github.com/webdriverio/native-demo-app/releases/download/v1.0.8/android.wdio.native.app.v1.0.8.apk';

const pastaApps = path.join(process.cwd(), 'apps');
const destino = path.join(pastaApps, 'android.wdio.native.app.apk');

if (!fs.existsSync(pastaApps)) {
  fs.mkdirSync(pastaApps, { recursive: true });
}

function baixar(url, arquivo) {
  return new Promise((resolver, rejeitar) => {
    const requisicao = https.get(url, (resposta) => {
      if (resposta.statusCode >= 300 && resposta.statusCode < 400 && resposta.headers.location) {
        baixar(resposta.headers.location, arquivo).then(resolver).catch(rejeitar);
        return;
      }
      if (resposta.statusCode !== 200) {
        rejeitar(new Error(`Falha ao baixar APK: HTTP ${resposta.statusCode}`));
        return;
      }
      const fluxo = fs.createWriteStream(arquivo);
      resposta.pipe(fluxo);
      fluxo.on('finish', () => {
        fluxo.close();
        console.log(`APK salvo em ${arquivo}`);
        resolver();
      });
    });
    requisicao.on('error', rejeitar);
  });
}

baixar(urlApk, destino).catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
