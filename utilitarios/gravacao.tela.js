/**
 * Gravacao de tela Appium — salva MP4 da ultima execucao local por teste.
 */
const fs = require('fs');
const path = require('path');

const PASTA_VIDEOS = path.join(process.cwd(), 'capturas', 'videos-ultima-execucao');

function garantirPasta() {
  fs.mkdirSync(PASTA_VIDEOS, { recursive: true });
}

function limparVideosUltimaExecucao() {
  garantirPasta();
  for (const arquivo of fs.readdirSync(PASTA_VIDEOS)) {
    if (arquivo.endsWith('.mp4') || arquivo.endsWith('.mkv')) {
      fs.unlinkSync(path.join(PASTA_VIDEOS, arquivo));
    }
  }
}

function nomeArquivoSeguro(titulo) {
  return String(titulo || 'teste')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 80);
}

async function iniciarGravacao() {
  garantirPasta();
  try {
    await driver.startRecordingScreen({
      timeLimit: '180',
      videoType: 'mp4',
      bitRate: 2500000,
      forceRestart: true,
    });
    return true;
  } catch (erro) {
    console.warn(`[gravacao] nao iniciou: ${erro.message || erro}`);
    return false;
  }
}

/**
 * Encerra gravacao e grava MP4 em capturas/videos-ultima-execucao/.
 * @returns {string|null} caminho do arquivo ou null
 */
async function finalizarGravacao(tituloTeste) {
  try {
    const base64 = await driver.stopRecordingScreen();
    if (!base64) {
      return null;
    }
    garantirPasta();
    const nome = `${nomeArquivoSeguro(tituloTeste)}.mp4`;
    const destino = path.join(PASTA_VIDEOS, nome);
    fs.writeFileSync(destino, Buffer.from(base64, 'base64'));
    return destino;
  } catch (erro) {
    console.warn(`[gravacao] nao finalizou: ${erro.message || erro}`);
    return null;
  }
}

module.exports = {
  PASTA_VIDEOS,
  limparVideosUltimaExecucao,
  iniciarGravacao,
  finalizarGravacao,
  garantirPasta,
};
