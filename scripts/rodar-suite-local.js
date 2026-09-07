/**
 * Roda cada spec em processo WDIO separado (mais estavel em 1 dispositivo).
 *
 *   node scripts/rodar-suite-local.js              # Android
 *   node scripts/rodar-suite-local.js --smoke       # Android smoke
 *   node scripts/rodar-suite-local.js --ios         # iOS (macOS)
 *   node scripts/rodar-suite-local.js --ios --smoke
 */
const { spawnSync } = require('child_process');
const path = require('path');
const { limparVideosUltimaExecucao } = require('../utilitarios/gravacao.tela');

const raiz = path.join(__dirname, '..');
const soSmoke = process.argv.includes('--smoke');
const soIos = process.argv.includes('--ios');

if (soIos && process.platform !== 'darwin') {
  console.error(
    '[erro] Suite iOS local so roda em macOS + Xcode. Use Android local ou `npm run testar:ios:bs`.',
  );
  process.exit(1);
}

const conf = soIos ? 'wdio.ios.local.conf.js' : 'wdio.android.local.conf.js';
const plataforma = soIos ? 'iOS' : 'Android';

const specs = soSmoke
  ? ['login.spec.js', 'cadastro.spec.js', 'navegacao.spec.js']
  : [
      'cadastro.spec.js',
      'erros.spec.js',
      'formularios.spec.js',
      'login.spec.js',
      'navegacao.spec.js',
    ];

limparVideosUltimaExecucao();
console.log(
  `[suite-local] plataforma=${plataforma} conf=${conf} modo=${soSmoke ? 'smoke' : 'regressao'}`,
);

const resultados = [];
const envFilho = {
  ...process.env,
  MANTER_VIDEOS: '1',
  PLATFORM: plataforma,
  ...(soSmoke ? { MOCHA_GREP: '@smoke' } : {}),
};

for (const spec of specs) {
  console.log(`\n======== ${plataforma} · ${spec}${soSmoke ? ' (smoke)' : ''} ========\n`);
  const r = spawnSync(
    'npx',
    ['wdio', 'run', conf, '--spec', `./testes/${spec}`],
    {
      cwd: raiz,
      stdio: 'inherit',
      shell: true,
      env: envFilho,
    },
  );
  const codigo = r.status == null ? 1 : r.status;
  resultados.push({ spec, codigo });
  spawnSync(
    process.platform === 'win32'
      ? 'powershell -NoProfile -Command "Start-Sleep -Seconds 3"'
      : 'sleep 3',
    { shell: true, stdio: 'ignore' },
  );
}

console.log('\n======== RESUMO ========');
let falhas = 0;
for (const item of resultados) {
  const ok = item.codigo === 0;
  if (!ok) falhas += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${item.spec}`);
}

console.log(
  `\nVideos: ${path.join(raiz, 'capturas', 'videos-ultima-execucao')}`,
);
process.exit(falhas > 0 ? 1 : 0);
