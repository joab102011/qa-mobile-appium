/**
 * Roda cada spec em processo WDIO separado (mais estavel em 1 emulador).
 * Uso: node scripts/rodar-suite-local.js
 */
const { spawnSync } = require('child_process');
const path = require('path');

const raiz = path.join(__dirname, '..');
const specs = [
  'cadastro.spec.js',
  'erros.spec.js',
  'formularios.spec.js',
  'login.spec.js',
  'navegacao.spec.js',
];

const resultados = [];

for (const spec of specs) {
  console.log(`\n======== RODANDO ${spec} ========\n`);
  const r = spawnSync(
    'npx',
    ['wdio', 'run', 'wdio.android.local.conf.js', '--spec', `./testes/${spec}`],
    {
      cwd: raiz,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    },
  );
  const codigo = r.status == null ? 1 : r.status;
  resultados.push({ spec, codigo });
  // Pausa entre specs para o UiAutomator2 / emulador respirar
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

process.exit(falhas > 0 ? 1 : 0);
