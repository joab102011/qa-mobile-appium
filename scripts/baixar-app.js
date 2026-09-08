const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Baixa APK Android + ZIP iOS (simulador) do native-demo-app.
 * Releases: https://github.com/webdriverio/native-demo-app/releases
 *
 * Flags:
 *   --android-only | --ios-only
 */
const soAndroid = process.argv.includes('--android-only');
const soIos = process.argv.includes('--ios-only');

const urlApk =
  process.env.URL_APK_DEMO ||
  'https://github.com/webdriverio/native-demo-app/releases/download/v1.0.8/android.wdio.native.app.v1.0.8.apk';

const urlIosZip =
  process.env.URL_IOS_DEMO ||
  'https://github.com/webdriverio/native-demo-app/releases/download/v1.0.8/ios.simulator.wdio.native.app.v1.0.8.zip';

const pastaApps = path.join(process.cwd(), 'apps');
const destinoApk = path.join(pastaApps, 'android.wdio.native.app.apk');
const destinoZip = path.join(pastaApps, 'ios.simulator.wdio.native.app.zip');
const destinoAppCanonico = path.join(pastaApps, 'ios.simulator.wdio.native.app.app');

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
        rejeitar(new Error(`Falha ao baixar: HTTP ${resposta.statusCode} (${url})`));
        return;
      }
      const fluxo = fs.createWriteStream(arquivo);
      resposta.pipe(fluxo);
      fluxo.on('finish', () => {
        fluxo.close();
        console.log(`Salvo: ${arquivo}`);
        resolver();
      });
    });
    requisicao.on('error', rejeitar);
  });
}

function acharApp(dirRaiz) {
  const fila = [dirRaiz];
  while (fila.length) {
    const dir = fila.pop();
    let nomes;
    try {
      nomes = fs.readdirSync(dir);
    } catch (e) {
      continue;
    }
    for (const nome of nomes) {
      const cheio = path.join(dir, nome);
      let st;
      try {
        st = fs.statSync(cheio);
      } catch (e) {
        continue;
      }
      if (st.isDirectory()) {
        if (nome.endsWith('.app')) {
          return cheio;
        }
        fila.push(cheio);
      }
    }
  }
  return null;
}

function extrairIos(zipPath) {
  const pastaTemp = path.join(pastaApps, '_ios_extract');
  fs.rmSync(pastaTemp, { recursive: true, force: true });
  fs.mkdirSync(pastaTemp, { recursive: true });

  // tar nativo no Windows evita Expand-Archive travar em zips grandes do .app
  execSync(`tar -xf "${zipPath}" -C "${pastaTemp}"`, { stdio: 'inherit' });

  const encontrado = acharApp(pastaTemp);
  if (!encontrado) {
    throw new Error('ZIP iOS baixado, mas nenhum .app encontrado apos extracao');
  }

  fs.rmSync(destinoAppCanonico, { recursive: true, force: true });
  fs.renameSync(encontrado, destinoAppCanonico);
  fs.rmSync(pastaTemp, { recursive: true, force: true });
  console.log(`App iOS (Simulator) pronto: ${destinoAppCanonico}`);
}

async function main() {
  const fazerAndroid = soIos ? false : true;
  const fazerIos = soAndroid ? false : true;

  if (fazerAndroid) {
    if (fs.existsSync(destinoApk) && fs.statSync(destinoApk).size > 1000) {
      console.log(`APK ja presente: ${destinoApk}`);
    } else {
      await baixar(urlApk, destinoApk);
    }
  }
  if (fazerIos) {
    if (fs.existsSync(destinoAppCanonico)) {
      console.log(`App iOS ja presente: ${destinoAppCanonico}`);
    } else {
      if (!(fs.existsSync(destinoZip) && fs.statSync(destinoZip).size > 1000)) {
        await baixar(urlIosZip, destinoZip);
      } else {
        console.log(`ZIP iOS ja presente: ${destinoZip}`);
      }
      extrairIos(destinoZip);
    }
  }
}

main().catch((erro) => {
  console.error(erro.message || erro);
  process.exit(1);
});
