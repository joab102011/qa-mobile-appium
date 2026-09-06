/**
 * Roda cada spec em processo WDIO separado (mais estavel em 1 emulador).
 * Uso: node scripts/rodar-suite-local.js
 *      node scripts/rodar-suite-local.js --smoke
 *
 * Limpa videos uma vez no inicio e mantem todos os MP4 da suite em
 * capturas/videos-ultima-execucao/.
 */
const { spawnSync } = require('child_process');
const path = require('path');
const { limparVideosUltimaExecucao } = require('../utilitarios/gravacao.tela');

const raiz = path.join(__dirname, '..');
const soSmoke = process.argv.includes('--smoke');

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
  soSmoke
    ? '[gravacao] smoke (@smoke) — videos limpos; gravando execucao local'
    : '[gravacao] videos da execucao anterior removidos; gravando nova suite local',
);

const resultados = [];
const envFilho = {
  ...process.env,
  MANTER_VIDEOS: '1',
  ...(soSmoke ? { MOCHA_GREP: '@smoke' } : {}),
};

for (const spec of specs) {
  console.log(`\n======== RODANDO ${spec}${soSmoke ? ' (smoke)' : ''} ========\n`);
  const r = spawnSync(
    'npx',
    ['wdio', 'run', 'wdio.android.local.conf.js', '--spec', `./testes/${spec}`],
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

const pastaVideos = path.join(raiz, 'capturas', 'videos-ultima-execucao');
console.log(`\nVideos da ultima execucao local: ${pastaVideos}`);

process.exit(falhas > 0 ? 1 : 0);
