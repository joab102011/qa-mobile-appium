# qa-mobile-appium

Automação de testes **mobile nativos** com **Appium 2** + **WebdriverIO** + Mocha + Chai no [native-demo-app](https://github.com/webdriverio/native-demo-app).

## Ideia em uma frase

Fluxo **gratuito e local**: Node.js + SDK Android + emulador **`WdioDemo_API34` criado dentro deste repositório** (pasta `emulador/avd`).  
**Não usa AVD de outros projetos.** BrowserStack é opcional (nuvem, em geral pago/trial).

Os YAMLs de CI (GitLab + GitHub, **inativos**) usam BrowserStack quando ativados — sem emulador no runner.

## Stack

| Item | Tecnologia |
|------|------------|
| Motor | Appium 2 + UiAutomator2 |
| Runner | WebdriverIO |
| Testes | Mocha + Chai |
| Emulador local | **`WdioDemo_API34`** (deste projeto, em `emulador/avd`) |
| Cloud (opcional) | BrowserStack |
| CI/CD | GitLab CI + GitHub Actions (prontos, **inativos**) |

---

## 1) O que instalar no PC (uma vez)

| Ferramenta | Para quê |
|------------|----------|
| **Node.js 20 LTS** | [nodejs.org](https://nodejs.org) |
| **Android SDK** | `platform-tools`, `emulator` e system-image `android-34;google_apis;x86_64` |
| Variável **`ANDROID_HOME`** | Caminho do SDK (ex.: `D:\Android\Sdk`) |

```powershell
$env:ANDROID_HOME = "D:\Android\Sdk"   # ajuste se o seu SDK estiver em outro lugar
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:PATH"
node -v
```

> O AVD **`WdioDemo_API34`** é criado **pelo projeto** (`npm run emulador:criar`). Não use emulador de outro app/repositório.

---

## 2) Preparar (uma vez)

Na pasta `qa-mobile-appium`:

```bash
npm run preparar
```

Isso:

1. Instala dependências (`npm ci`)  
2. Baixa o APK do demo  
3. Cria o emulador **`WdioDemo_API34`** em `emulador/avd/` (só deste repo)

---

## 3) Como executar (local / grátis)

### A) Todas as specs **com UI** (você vê o emulador)

```bash
npm run emulador:iniciar
npm run testar:android:local
```

> `testar:android:local` roda **cada arquivo de spec em processo separado** (mais estável em um único emulador).

### B) Somente **uma** spec (com UI)

```bash
npm run emulador:iniciar
npm run testar:android:login
```

| Spec | Comando |
|------|---------|
| Login | `npm run testar:android:login` |
| Cadastro | `npm run testar:android:cadastro` |
| Formulários | `npm run testar:android:formularios` |
| Navegação | `npm run testar:android:navegacao` |
| Erros | `npm run testar:android:erros` |

### C) Headless + **uma** spec (emulador sem janela)

```bash
npm run emulador:iniciar:headless
npm run testar:android:login
```

### Resumo

| Objetivo | Comandos |
|----------|----------|
| Preparar projeto + AVD deste repo | `npm run preparar` |
| Subir emulador **do projeto** (UI) | `npm run emulador:iniciar` |
| Subir emulador **do projeto** (headless) | `npm run emulador:iniciar:headless` |
| Todas as specs | `npm run testar:android:local` |
| Uma spec | `npm run testar:android:login` (etc.) |

### Vídeos da última execução local

Ao final de **cada teste**, o Appium grava a tela e salva um MP4 em:

`capturas/videos-ultima-execucao/`

- Rodando **uma** spec (`npm run testar:android:login`): a pasta é limpa e ficam só os vídeos dessa execução.  
- Rodando a **suite** (`npm run testar:android:local`): limpa no início e acumula o vídeo de todos os cenários daquela rodada.  
- Também anexado ao Allure (quando gerar relatório).

```bash
# apos os testes
explorer capturas\videos-ultima-execucao
```

---

## 4) BrowserStack (opcional / nuvem)

Em geral **pago** (ou trial). Não é necessário se o emulador local do projeto estiver ok.

```powershell
$env:BROWSERSTACK_USERNAME = "..."
$env:BROWSERSTACK_ACCESS_KEY = "..."
$env:BROWSERSTACK_APP_ID = "bs://..."
npm run testar:android:bs
```

---

## 5) CI (GitLab + GitHub Actions) — inativos

Pipelines auto-suficientes com Node + `npm run preparar` + BrowserStack (quando secrets existirem).  
**Inativos** por padrão — ver comentários nos YAMLs e como ativar abaixo.

| Arquivo | Plataforma |
|---------|------------|
| [`.gitlab-ci.yml`](.gitlab-ci.yml) | GitLab |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | GitHub Actions |

**Ativar:** secrets `BROWSERSTACK_*` + liberar `workflow.rules` / remover `if: false`.

---

## Estrutura

```
qa-mobile-appium/
├── emulador/avd/          # AVD WdioDemo_API34 (deste projeto)
├── paginas/
├── testes/
├── scripts/
│   ├── criar-emulador-projeto.js
│   ├── iniciar-emulador-projeto.js
│   ├── rodar-suite-local.js
│   └── baixar-app.js
├── capturas/videos-ultima-execucao/  # MP4 da ultima execucao local
├── wdio.android.local.conf.js
└── ...
```

## Documentação

- [`docs/PLANEJAMENTO.md`](docs/PLANEJAMENTO.md)
- [`docs/casos-de-teste.md`](docs/casos-de-teste.md)

---

Feito por [Joab Cruz](https://github.com/joab102011)
