# qa-mobile-appium

Automação de testes **mobile nativos** com **Appium 2** + **WebdriverIO** + Mocha + Chai no [native-demo-app](https://github.com/webdriverio/native-demo-app).

## Ideia em uma frase

**Android local** é o caminho oficial de evidência E2E (emulador `WdioDemo_API34`, porta **5560**).  
**iOS local** existe para quem está em **macOS + Xcode** (Simulator).  
**BrowserStack** é opcional (nuvem).  
**CI** prova integridade do projeto — não substitui a suite na UI.

Lista completa de comandos: [`docs/COMANDOS.md`](docs/COMANDOS.md) · Racional: [`docs/PLANEJAMENTO.md`](docs/PLANEJAMENTO.md)

## Stack

| Item | Tecnologia |
|------|------------|
| Motor | Appium 2 (UiAutomator2 + XCUITest no Mac) |
| Runner | WebdriverIO + Mocha + Chai |
| Android local | AVD **`WdioDemo_API34`** (porta **5560**) |
| iOS local | Xcode Simulator (somente macOS; app só para Simulator) |
| Cloud | BrowserStack (Android/iOS, opcional) |
| CI | GitHub Actions + GitLab (gate sempre; BS condicional) |

---

## Atalhos — o que rodar

### Android (Windows / Linux / macOS com SDK)

```bash
npm run preparar:android
npm run emulador:iniciar
npm run testar:android:local
```

| Objetivo | Comando |
|----------|---------|
| Smoke | `npm run testar:android:smoke` |
| Uma spec (ex. login) | `npm run testar:android:login` |
| Headless | `npm run emulador:iniciar:headless` depois a suite |

### iOS local (somente Mac)

```bash
npm run preparar:ios
npx appium driver install xcuitest
open -a Simulator
npm run testar:ios:local
```

| Objetivo | Comando |
|----------|---------|
| Smoke | `npm run testar:ios:smoke` |
| Uma spec | `npm run testar:ios:login` |

Fora de macOS esses comandos **falham de propósito** (mensagem clara). Use Android local ou `npm run testar:ios:bs`.

### CI / gate (local ou pipeline)

```bash
npm ci
npm run verificar:ci
```

Baixa APK + app iOS Simulator, valida configs. **Não** sobe emulador.

### BrowserStack (opcional)

```bash
npm run testar:android:bs:smoke
npm run testar:ios:bs
```

---

## 1) Pré-requisitos

| Plataforma | Ferramentas |
|------------|-------------|
| Qualquer (Android) | Node 20, Android SDK, `ANDROID_HOME` |
| macOS (iOS local) | Xcode + Simulator + driver `xcuitest` no Appium |

```powershell
$env:ANDROID_HOME = "D:\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:PATH"
```

> AVD **`WdioDemo_API34`** é deste repo. Não use emulador de outro projeto.

---

## 2) Preparar

| Comando | O que faz |
|---------|-----------|
| `npm run preparar:android` | `npm ci` + APK + cria AVD do projeto |
| `npm run preparar:ios` | `npm ci` + baixa/extrai `.app` do Simulator |
| `npm run preparar` | Alias de `preparar:android` |
| `npm run baixar:app` | APK **e** iOS |
| `npm run baixar:app:android` / `:ios` | Só uma plataforma |

---

## 3) Evidências locais

Vídeos em `capturas/videos-ultima-execucao/` · screenshots em falha · Allure:

```bash
npm run relatorio:allure
```

---

## 4) CI (híbrido, responsável)

| Camada | Quando | Comando |
|--------|--------|---------|
| Gate `verificar_projeto` | Todo push/PR | `npm run verificar:ci` |
| Smoke/regressão BS | Só com secrets | `testar:android:bs*` |

O runner **não cria AVD** e **não** sobe Simulator. Verde no gate ≠ 10 cenários E2E — esses vêm da execução local (ou BS com secrets).

Arquivos: [`.github/workflows/ci.yml`](.github/workflows/ci.yml) · [`.gitlab-ci.yml`](.gitlab-ci.yml)

---

## Rastreabilidade

| Requisito | Como | IDs |
|-----------|------|-----|
| 10 cenários | Mocha DADO/QUANDO/ENTÃO | MOB-01…10 |
| Page Object | `paginas/*.js` + seletores multiplataforma | — |
| Data-driven | `dados/usuarios-login.json` | MOB-01, MOB-02 |
| Android + iOS | Android local 5560; iOS Simulator (Mac) ou BS | `wdio.android.*` / `wdio.ios.*` |
| Evidências | Screenshot, Allure, vídeo | `capturas/` |
| CI honesta | Gate sempre; BS condicional | workflows |

---

## Estrutura

```
qa-mobile-appium/
├── emulador/avd/
├── apps/
├── paginas/  testes/  dados/
├── scripts/
├── wdio.android.local.conf.js
├── wdio.ios.local.conf.js
├── wdio.*.browserstack.conf.js
└── docs/COMANDOS.md
```

## Documentação

- [`docs/COMANDOS.md`](docs/COMANDOS.md)
- [`docs/PLANEJAMENTO.md`](docs/PLANEJAMENTO.md)
- [`docs/casos-de-teste.md`](docs/casos-de-teste.md)

---

Feito por [Joab Cruz](https://github.com/joab102011)
