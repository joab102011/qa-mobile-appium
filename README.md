# qa-mobile-appium

Automação de testes **mobile nativos** com **Appium 2** (motor) + **WebdriverIO** (cliente) + Mocha + Chai no [native-demo-app](https://github.com/webdriverio/native-demo-app).

## Stack

| Item | Tecnologia |
|------|------------|
| Motor | Appium 2 + UiAutomator2 |
| Runner | WebdriverIO |
| Testes | Mocha + Chai |
| Padrão | Page Object (`paginas/`) |
| Relatórios | Allure + screenshots em falha |
| Cloud | BrowserStack |
| CI/CD | GitLab CI |

## Pré-requisitos (Android local)

1. Node.js 18+
2. JDK 11+
3. Android Studio com emulador (AVD) ligado
4. Variáveis `ANDROID_HOME` / `JAVA_HOME` configuradas

## Setup

```bash
npm ci
npm run baixar:app
```

O script baixa o APK oficial do native-demo-app para `apps/android.wdio.native.app.apk`.

## Como executar

### Android local (Appium)

Com o emulador aberto:

```bash
npm run testar:android:local
```

### BrowserStack (Android)

Configure no CI ou no shell:

- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`
- `BROWSERSTACK_APP_ID` (após upload do APK)

```bash
npm run testar:android:bs
```

### BrowserStack (iOS)

```bash
npm run testar:ios:bs
```

> O build iOS do demo app é para **simulador**. Em Windows local o iOS não roda; use cloud ou Mac.

## Relatórios

- Screenshots de falha em `capturas/`
- Allure results em `allure-results/`

```bash
npm run relatorio:allure
```

## Cenários (10)

Ver [`docs/casos-de-teste.md`](docs/casos-de-teste.md) — login, cadastro, formulários, navegação e erros. Data-driven em `dados/usuarios-login.json`.

## CI/CD GitLab

Arquivo [`.gitlab-ci.yml`](.gitlab-ci.yml) dispara `testar:android:bs` quando as variáveis BrowserStack estão definidas. Artefatos publicados **sempre**.

## Estrutura

```
qa-mobile-appium/
├── paginas/           # Page Objects
├── testes/            # 10 cenários
├── dados/             # JSON data-driven
├── utilitarios/       # Gestos e Allure
├── apps/              # APK (não versionado)
├── scripts/           # Download do app
├── docs/
├── wdio.*.conf.js
└── .gitlab-ci.yml
```

## Limitações

- iOS local exige macOS (não disponível neste ambiente Windows)
- CI usa BrowserStack em vez de emulador no runner SaaS
- Selectors baseados em accessibility id do demo app (`~Login`, `~Forms`, etc.)

## Documentação

- [`docs/PLANEJAMENTO.md`](docs/PLANEJAMENTO.md)
- [`docs/casos-de-teste.md`](docs/casos-de-teste.md)

---

Feito por [Joab Cruz](https://github.com/joab102011)
