/**
 * Gestos comuns para Appium (scroll/swipe).
 */
async function deslizarParaEsquerda() {
  const { width, height } = await driver.getWindowSize();
  await driver.performActions([
    {
      type: 'pointer',
      id: 'dedo1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: Math.floor(width * 0.8), y: Math.floor(height * 0.5) },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 200 },
        { type: 'pointerMove', duration: 600, x: Math.floor(width * 0.2), y: Math.floor(height * 0.5) },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ]);
  await driver.releaseActions();
}

module.exports = { deslizarParaEsquerda };
