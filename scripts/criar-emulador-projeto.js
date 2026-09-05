/**
 * Cria o AVD exclusivo deste projeto: WdioDemo_API34
 * Não usa nem referencia AVDs de outros projetos.
 *
 * Requer ANDROID_HOME (ou ANDROID_SDK_ROOT) com system-image android-34 google_apis x86_64.
 */
const fs = require('fs');
const path = require('path');

const NOME_AVD = 'WdioDemo_API34';
const raizProjeto = path.join(__dirname, '..');
const pastaAvdHome = path.join(raizProjeto, 'emulador', 'avd');
const pastaAvd = path.join(pastaAvdHome, `${NOME_AVD}.avd`);
const arquivoIni = path.join(pastaAvdHome, `${NOME_AVD}.ini`);

const sdk =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  (process.platform === 'win32' ? 'D:\\Android\\Sdk' : path.join(process.env.HOME || '', 'Android', 'Sdk'));

const imagemSistema = path.join(
  sdk,
  'system-images',
  'android-34',
  'google_apis',
  'x86_64',
  'system.img',
);

if (!fs.existsSync(imagemSistema)) {
  console.error(`
[erro] System image não encontrada:
  ${imagemSistema}

Instale (com cmdline-tools) a imagem:
  system-images;android-34;google_apis;x86_64

Defina ANDROID_HOME apontando para o SDK Android.
`);
  process.exit(1);
}

fs.mkdirSync(pastaAvd, { recursive: true });

const configIni = `AvdId = ${NOME_AVD}
PlayStore.enabled = false
abi.type = x86_64
avd.ini.displayname = ${NOME_AVD}
avd.ini.encoding = UTF-8
disk.dataPartition.size = 2G
fastboot.forceColdBoot = yes
fastboot.forceFastBoot = no
hw.accelerometer = yes
hw.audioInput = no
hw.battery = yes
hw.camera.back = emulated
hw.camera.front = none
hw.cpu.arch = x86_64
hw.cpu.ncore = 2
hw.dPad = no
hw.device.manufacturer = Google
hw.device.name = pixel_6
hw.gps = yes
hw.gpu.enabled = yes
hw.gpu.mode = swiftshader_indirect
hw.initialOrientation = Portrait
hw.keyboard = yes
hw.lcd.density = 320
hw.lcd.height = 1920
hw.lcd.width = 1080
hw.mainKeys = no
hw.ramSize = 3072
hw.sdCard = no
hw.sensors.orientation = yes
hw.sensors.proximity = yes
hw.trackBall = no
image.sysdir.1 = system-images\\android-34\\google_apis\\x86_64\\
runtime.network.latency = none
runtime.network.speed = full
showDeviceFrame = no
skin.dynamic = yes
tag.display = Google APIs
tag.id = google_apis
vm.heapSize = 512
`;

const caminhoAvdEscapado = pastaAvd.replace(/\\/g, '\\\\');
const ini = `avd.ini.encoding=UTF-8
path=${caminhoAvdEscapado}
path.rel=avd\\${NOME_AVD}.avd
target=android-34
`;

fs.writeFileSync(path.join(pastaAvd, 'config.ini'), configIni, 'utf8');
fs.writeFileSync(arquivoIni, ini, 'utf8');

console.log(`[ok] Emulador do projeto criado: ${NOME_AVD}`);
console.log(`     AVD_HOME: ${pastaAvdHome}`);
console.log(`     Pasta:    ${pastaAvd}`);
console.log(`
Próximo passo:
  npm run emulador:iniciar
`);
