# Comandos — qa-mobile-appium

Guia operacional. Racional de qualidade: [`PLANEJAMENTO.md`](PLANEJAMENTO.md).

## O que cada tipo de comando prova

| Comando / camada | Onde | O que valida |
|------------------|------|----------------|
| `npm run verificar:ci` | Local ou CI | Integridade: deps, APK, app iOS Simulator, configs WDIO |
| `npm run testar:android:*` | Emulador Android do projeto | UI E2E nos 10 cenarios |
| `npm run testar:ios:local*` | macOS + Xcode Simulator | UI E2E no mesmo suite (app so para Simulator) |
| `npm run testar:*:bs*` | BrowserStack | UI E2E na nuvem (precisa secrets) |

CI responsavel: o Actions/GitLab roda **sempre** o gate (`verificar:ci`). Nao sobe emulador no runner. BrowserStack so com secrets.

---

## Android local (oficial neste PC / Windows)

Pre-requisitos: Node 20, Android SDK, `ANDROID_HOME`.

```bash
npm run preparar:android
npm run emulador:iniciar
npm run testar:android:local
```

| Objetivo | Comando |
|----------|---------|
| Preparar deps + APK + AVD `WdioDemo_API34` | `npm run preparar:android` |
| So baixar APK | `npm run baixar:app:android` |
| Subir emulador (UI) | `npm run emulador:iniciar` |
| Subir emulador (headless) | `npm run emulador:iniciar:headless` |
| Regressao 10 cenarios | `npm run testar:android:local` |
| Smoke (`@smoke`) | `npm run testar:android:smoke` |
| So login | `npm run testar:android:login` |
| So cadastro | `npm run testar:android:cadastro` |
| So formularios | `npm run testar:android:formularios` |
| So navegacao | `npm run testar:android:navegacao` |
| So erros | `npm run testar:android:erros` |

Alias: `npm run preparar` = `preparar:android`.

Emulador exclusivo: porta **5560** (`emulator-5560`). Nao usa AVD de outro projeto.

---

## iOS local (somente macOS + Xcode)

O build publico do demo e **somente para Simulator** (limitacao Apple). Nao roda em iPhone fisico nem em Windows/Linux.

```bash
npm run preparar:ios
npx appium driver install xcuitest   # uma vez
open -a Simulator
npm run testar:ios:local
```

| Objetivo | Comando |
|----------|---------|
| Preparar deps + extrair `.app` do Simulator | `npm run preparar:ios` |
| So baixar/extrair iOS | `npm run baixar:app:ios` |
| Regressao 10 cenarios | `npm run testar:ios:local` |
| Smoke | `npm run testar:ios:smoke` |
| So login | `npm run testar:ios:login` |
| WDIO direto (uma sessao) | `npm run testar:ios:local:wdio` |

Variaveis uteis: `NOME_DISPOSITIVO_IOS` (ex. `iPhone 15`), `VERSAO_IOS`, `UDID_IOS`, `BUNDLE_ID_IOS`.

Fora de macOS, `testar:ios:local` falha de proposito com mensagem clara — use Android local ou BrowserStack.

---

## BrowserStack (nuvem, opcional)

```bash
# Android
export BROWSERSTACK_USERNAME=...
export BROWSERSTACK_ACCESS_KEY=...
export BROWSERSTACK_APP_ID=bs://...
npm run testar:android:bs:smoke
npm run testar:android:bs

# iOS
export BROWSERSTACK_APP_ID_IOS=bs://...
npm run testar:ios:bs:smoke
npm run testar:ios:bs
```

No GitHub Actions os mesmos secrets fazem os jobs de nuvem rodarem apos o gate; sem secrets, so o gate fica verde.

---

## CI (o que a pipeline faz)

```bash
npm ci
npm run verificar:ci
```

Isso e o job `verificar_projeto`. Nao substitui a suite E2E.

Relatorio local apos testes:

```bash
npm run relatorio:allure
```
