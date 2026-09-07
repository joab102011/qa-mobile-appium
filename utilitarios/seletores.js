/**
 * Seletores multiplataforma (Android emulador / iOS Simulator).
 */
function ehIos() {
  try {
    return Boolean(driver && driver.isIOS);
  } catch (e) {
    return String(process.env.PLATFORM || '').toLowerCase() === 'ios';
  }
}

function tituloAlerta() {
  if (ehIos()) {
    return $('-ios predicate string:type == "XCUIElementTypeAlert"');
  }
  return $('//*[@resource-id="android:id/alertTitle"]');
}

function botaoOkAlerta() {
  if (ehIos()) {
    return $(
      '-ios predicate string:type == "XCUIElementTypeButton" AND (label == "OK" OR name == "OK")',
    );
  }
  return $('//*[@resource-id="android:id/button1"]');
}

function textoContem(trecho) {
  if (ehIos()) {
    return $(
      `-ios predicate string:label CONTAINS "${trecho}" OR name CONTAINS "${trecho}" OR value CONTAINS "${trecho}"`,
    );
  }
  return $(`android=new UiSelector().textContains("${trecho}")`);
}

function opcaoPorTexto(texto) {
  if (ehIos()) {
    return $(`-ios predicate string:label == "${texto}" OR name == "${texto}"`);
  }
  return $(`//*[@text="${texto}"]`);
}

module.exports = {
  ehIos,
  tituloAlerta,
  botaoOkAlerta,
  textoContem,
  opcaoPorTexto,
};
