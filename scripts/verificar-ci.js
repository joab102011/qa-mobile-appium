#!/usr/bin/env node
/**
 * Gate de integridade para CI (sem emulador / sem BrowserStack).
 * Garante: APK disponivel, sintaxe dos scripts e configs WDIO carregaveis.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const raiz = path.join(__dirname, '..');
process.chdir(raiz);

function ok(msg) {
  console.log(`[verificar:ci] OK — ${msg}`);
}

function falhar(msg) {
  console.error(`[verificar:ci] FALHA — ${msg}`);
  process.exit(1);
}

console.log('[verificar:ci] baixando APK do demo...');
execSync('node scripts/baixar-app.js', { stdio: 'inherit' });

const apk = path.join(raiz, 'apps', 'android.wdio.native.app.apk');
if (!fs.existsSync(apk) || fs.statSync(apk).size < 1000) {
  falhar(`APK ausente ou invalido: ${apk}`);
}
ok(`APK presente (${fs.statSync(apk).size} bytes)`);

const scriptsCheck = [
  'scripts/baixar-app.js',
  'scripts/verificar-ci.js',
  'scripts/rodar-suite-local.js',
  'wdio.compartilhado.conf.js',
  'wdio.android.local.conf.js',
  'wdio.android.browserstack.conf.js',
  'wdio.ios.browserstack.conf.js',
];
for (const arquivo of scriptsCheck) {
  const absoluto = path.join(raiz, arquivo);
  if (!fs.existsSync(absoluto)) {
    falhar(`arquivo esperado ausente: ${arquivo}`);
  }
  execSync(`node --check "${absoluto}"`, { stdio: 'pipe' });
}
ok('sintaxe Node dos scripts e configs WDIO');

// UDID dummy: o conf local so valida UDID no onPrepare, nao no require
process.env.UDID_ANDROID = process.env.UDID_ANDROID || 'emulator-5560';

try {
  require(path.join(raiz, 'wdio.compartilhado.conf.js'));
  require(path.join(raiz, 'wdio.android.local.conf.js'));
  require(path.join(raiz, 'wdio.android.browserstack.conf.js'));
  require(path.join(raiz, 'wdio.ios.browserstack.conf.js'));
} catch (erro) {
  falhar(`falha ao carregar configs WDIO: ${erro.message || erro}`);
}
ok('configs WDIO carregam sem erro');

const specs = [
  'testes/login.spec.js',
  'testes/cadastro.spec.js',
  'testes/formularios.spec.js',
  'testes/navegacao.spec.js',
  'testes/erros.spec.js',
  'dados/usuarios-login.json',
];
for (const arquivo of specs) {
  if (!fs.existsSync(path.join(raiz, arquivo))) {
    falhar(`artefato de suite ausente: ${arquivo}`);
  }
}
ok('specs e massa data-driven presentes');

console.log('[verificar:ci] gate concluido — projeto integro e pronto para execucao local ou BrowserStack');
