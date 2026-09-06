/**
 * Inicia o emulador exclusivo deste projeto (WdioDemo_API34).
 * Usa ANDROID_AVD_HOME = <repo>/emulador/avd — nunca AVDs de outros projetos.
 * Porta padrão 5560 (UDID emulator-5560) para não conflitar com 5554 de outros AVDs.
 */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const NOME_AVD = 'WdioDemo_API34';
const PORTA_EMULADOR = Number(process.env.PORTA_EMULADOR_PROJETO || 5560);
const UDID_ESPERADO = `emulator-${PORTA_EMULADOR}`;
const raizProjeto = path.join(__dirname, '..');
const pastaAvdHome = path.join(raizProjeto, 'emulador', 'avd');
const configAvd = path.join(pastaAvdHome, `${NOME_AVD}.avd`, 'config.ini');

const sdk =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  (process.platform === 'win32' ? 'D:\\Android\\Sdk' : path.join(process.env.HOME || '', 'Android', 'Sdk'));

const emulatorBin = path.join(
  sdk,
  'emulator',
  process.platform === 'win32' ? 'emulator.exe' : 'emulator',
);
const adbBin = path.join(
  sdk,
  'platform-tools',
  process.platform === 'win32' ? 'adb.exe' : 'adb',
);

function sleep(ms) {
  try {
    if (process.platform === 'win32') {
      execSync(`powershell -NoProfile -Command "Start-Sleep -Milliseconds ${ms}"`, {
        stdio: 'ignore',
      });
    } else {
      execSync(`sleep ${Math.ceil(ms / 1000)}`, { stdio: 'ignore' });
    }
  } catch {
    const fim = Date.now() + ms;
    while (Date.now() < fim) {
      /* wait */
    }
  }
}

if (!fs.existsSync(configAvd)) {
  console.error(`[erro] AVD do projeto não existe. Rode antes: npm run emulador:criar`);
  process.exit(1);
}

if (!fs.existsSync(emulatorBin)) {
  console.error(`[erro] emulator não encontrado em ${emulatorBin}. Defina ANDROID_HOME.`);
  process.exit(1);
}

const headless = process.argv.includes('--headless');
const args = [
  '-avd',
  NOME_AVD,
  '-port',
  String(PORTA_EMULADOR),
  '-gpu',
  'swiftshader_indirect',
  '-no-snapshot',
  '-no-audio',
  '-no-boot-anim',
  '-memory',
  '3072',
];
if (headless) {
  args.push('-no-window');
}

const env = {
  ...process.env,
  ANDROID_HOME: sdk,
  ANDROID_SDK_ROOT: sdk,
  ANDROID_AVD_HOME: pastaAvdHome,
};

console.log(`[info] ANDROID_AVD_HOME=${pastaAvdHome}`);
console.log(`[info] Porta ${PORTA_EMULADOR} → UDID ${UDID_ESPERADO} (evita conflito com 5554 de outros projetos)`);
console.log(`[info] Iniciando ${NOME_AVD}${headless ? ' (headless)' : ' (com UI)'}...`);

const filho = spawn(emulatorBin, args, {
  env,
  detached: true,
  stdio: 'ignore',
  windowsHide: false,
});
filho.unref();

function adb(cmdArgs) {
  try {
    return execSync(`"${adbBin}" ${cmdArgs}`, {
      env,
      encoding: 'utf8',
      windowsHide: true,
      timeout: 15_000,
    }).trim();
  } catch {
    return '';
  }
}

function nomeAvd(udid) {
  const bruto = adb(`-s ${udid} emu avd name`);
  return (bruto.split(/\r?\n/)[0] || '').trim();
}

const inicio = Date.now();
const limiteMs = 360_000;
let pronto = false;
let udidOk = '';

while (Date.now() - inicio < limiteMs) {
  const devices = adb('devices');
  const linha = devices
    .split(/\r?\n/)
    .find((l) => new RegExp(`${UDID_ESPERADO}\\s+device`).test(l));
  if (linha) {
    const udid = linha.split(/\s+/)[0];
    const nome = nomeAvd(udid);
    if (nome && !/WdioDemo/i.test(nome)) {
      console.error(
        `[erro] ${udid} não é o AVD do projeto (nome="${nome}"). Abortando — não usamos AVD de outro projeto.`,
      );
      process.exit(1);
    }
    const boot = adb(`-s ${udid} shell getprop sys.boot_completed`);
    if (boot === '1') {
      udidOk = udid;
      console.log(`[ok] Emulador do projeto pronto: ${udid} (${nome || NOME_AVD})`);
      pronto = true;
      break;
    }
  }
  sleep(3000);
}

if (!pronto) {
  console.error(
    `[erro] Timeout aguardando boot de ${UDID_ESPERADO} (${NOME_AVD}).`,
  );
  process.exit(1);
}

const udidFile = path.join(raizProjeto, 'emulador', 'udid-ativo.txt');
fs.writeFileSync(udidFile, udidOk, 'utf8');
console.log(`[ok] UDID salvo em emulador/udid-ativo.txt`);
