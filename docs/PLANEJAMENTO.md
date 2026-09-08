# Planejamento — qa-mobile-appium

## Objetivo

Suite mobile no native-demo-app: 10 cenários, Page Object, Appium 2, evidências (screenshot, Allure, vídeo local) e CI híbrida — gate estrutural sempre; UI real no emulador local (ou BrowserStack com secrets).

## Stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Motor | **Appium 2** + UiAutomator2 (+ XCUITest no Mac) | Exigência do desafio |
| Cliente/runner | WebdriverIO + Mocha + Chai | Stack do enunciado; DADO/QUANDO/ENTÃO |
| Emulador Android | **`WdioDemo_API34` em `emulador/avd`** | Porta **5560** pra não misturar com outros AVDs |
| Simulator iOS | Xcode (macOS) | Mesma suite; app oficial só pro Simulator |
| Cloud (opcional) | BrowserStack | Extensão; não substitui o local |
| CI | GitLab + GitHub Actions (híbrido) | Gate sempre; UI na nuvem só com credencial |

```
testes → paginas → WDIO → Appium
                    ├─ Android: WdioDemo_API34 (:5560)
                    └─ iOS:     Xcode Simulator (macOS)
```

Comandos: [`COMANDOS.md`](COMANDOS.md).

## Ambientes

1. **Android local:** `npm run preparar:android` → `npm run emulador:iniciar` → `npm run testar:android:local`  
   Sem UDID do projeto (`udid-ativo.txt` / `UDID_ANDROID`) a suite aborta.
2. **iOS local (macOS):** `npm run preparar:ios` → Simulator → `npm run testar:ios:local`  
   Fora de Darwin o comando falha de propósito.
3. **BrowserStack:** secrets `BROWSERSTACK_*` + `testar:android:bs` / `testar:ios:bs`.
4. **CI:** `npm run verificar:ci` sempre; smoke/regressão BS só com secrets. Runner não sobe AVD nem Simulator.

## Flake (local)

| Medida | Motivo |
|--------|--------|
| Um spec por processo (`rodar-suite-local.js`) | Evita sessão contaminada no mesmo device |
| UDID obrigatório (Android) | Isola o AVD do projeto |
| Fail-fast fora de macOS p/ iOS local | Não fingir que Simulator existe no Windows |
| Health-check adb no onPrepare | Emulador caiu → feedback imediato |
| Vídeo + screenshot em falha | Diagnóstico |

## DADO / QUANDO / ENTÃO

Specs usam `dado()` / `quando()` / `entao()` (`utilitarios/passos.bdd.js`) — o Allure herda os steps.

## CI na entrega

Mobile só fica confiável com app, driver, device, massa e evidência sob controle. A esteira não tenta provar tudo no mesmo job.

Critérios: feedback rápido, sinal estável, alinhamento ao enunciado (local gratuito; BS opcional), custo e clareza do que CI vs E2E validou.

| Camada | Onde | O que prova |
|--------|------|-------------|
| Gate | GitHub / GitLab (sempre) | `npm ci` + APK + app iOS Simulator + configs WDIO |
| UI Android | Emulador `WdioDemo_API34` (local) | 10 cenários com evidências |
| UI iOS | Simulator (macOS) ou BrowserStack | Mesma suite |
| Nuvem | BrowserStack (condicional) | Só com secrets |

`verificar:ci` roda em todo push/PR. Jobs BS só entram se houver secrets (checagem no step).

Deixei de fora de propósito:

- Emulador no GitHub Actions (lento, flaky, perde o isolamento da porta 5560).
- BrowserStack como gate sem secrets (vermelho por credencial, não por bug).
- Job “verde” que não abre o app e se vende como regressão mobile.

Como ler o resultado: gate verde = projeto estruturalmente ok; Allure/capturas/vídeos locais = prova dos 10 cenários; BS condicional = caminho de nuvem existe, entrega mínima não depende dele.

## CI/CD

| Arquivo | Uso |
|---------|-----|
| `.github/workflows/ci.yml` | Gate sempre; BrowserStack condicional |
| `.gitlab-ci.yml` | Espelho (enunciado cita GitLab) |

Secrets `BROWSERSTACK_*` ligam a nuvem. Sem isso, só o gate — esperado.

## Evolução

1. Scaffold → Page Objects → 10 cenários → Allure  
2. AVD do projeto (`WdioDemo_API34`) + porta 5560 / UDID  
3. BrowserStack opcional  
4. CI híbrida (gate + nuvem condicional)  
5. iOS local no Mac + `COMANDOS.md`
