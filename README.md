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
| CI/CD | GitLab CI + GitHub Actions (preparados, **inativos**) |

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

## Estratégia de CI (GitLab + GitHub Actions)

O enunciado do Case Mobile pede **GitLab CI**. O repositório também traz GitHub Actions como espelho, porque a entrega pública ficou no GitHub.

| Arquivo | Plataforma | Papel |
|---------|------------|--------|
| [`.gitlab-ci.yml`](.gitlab-ci.yml) | GitLab | Pipeline exigida pelo desafio |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | GitHub Actions | Mesmo job (BrowserStack + artefatos) |

**Estado atual: CI inativo** nos dois YAMLs — sem pipeline automática. A suíte foi validada no **emulador Android local** (`npm run testar:android:local`). Emulador no runner SaaS é pesado; o caminho de CI planejado é **BrowserStack** (secrets no projeto).

### O que a pipeline faz (quando ativada)

1. Job `testar_android_browserstack` — `npm ci` + `npm run testar:android:bs`
2. Artefatos **sempre**: `allure-results/`, `capturas/`
3. Secrets necessários: `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`, `BROWSERSTACK_APP_ID`

### Como ativar

- **GitLab:** em `.gitlab-ci.yml`, troque `workflow.rules` de `when: never` por regras de branch/MR e configure as variáveis BrowserStack.
- **GitHub:** em `.github/workflows/ci.yml`, descomente `push`/`pull_request`, remova o `if: false` e cadastre os secrets no repositório.

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
├── .gitlab-ci.yml     # CI GitLab (inativo)
└── .github/workflows/ # CI GitHub Actions (inativo)
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
