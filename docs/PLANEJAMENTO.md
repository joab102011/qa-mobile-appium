# Planejamento — qa-mobile-appium

## Objetivo

Atender o Case Técnico de **Automação de Testes Mobile** com 10 cenários no native-demo-app (WebdriverIO), padrão Page Object, Appium 2, evidências (screenshot + Allure) e CI preparado (GitLab + GitHub Actions, inativos).

## Decisão de stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Motor | **Appium 2** + UiAutomator2 | Exigência do desafio |
| Cliente/runner | WebdriverIO + Mocha + Chai | Stack do enunciado |
| Emulador local | **`WdioDemo_API34` em `emulador/avd`** | AVD **deste** repositório; gratuito; sem AVD de outros projetos |
| Cloud (opcional) | BrowserStack | Alternativa paga/trial; usada nos YAMLs de CI |
| CI | GitLab + GitHub Actions (inativos) | GitLab no enunciado; Actions como espelho |

Arquitetura local:

```
testes → paginas → WDIO → Appium → emulador WdioDemo_API34 (pasta do repo)
```

## Ambientes

1. **Local (oficial grátis):** `npm run preparar` → `npm run emulador:iniciar` → `npm run testar:android:local`  
   Emulador exclusivo: **`WdioDemo_API34`** em `emulador/avd` (não usa AVD de outros projetos).
2. **BrowserStack (opcional/pago):** secrets `BROWSERSTACK_*` + `npm run testar:android:bs`
3. **CI:** YAMLs inativos; job BrowserStack auto-suficiente com Node 20

## Padrao DADO / QUANDO / ENTAO

Specs usam `dado()` / `quando()` / `entao()` (`utilitarios/passos.bdd.js`).

## CI/CD

| Arquivo | Uso |
|---------|-----|
| `.gitlab-ci.yml` | Exigência Mobile |
| `.github/workflows/ci.yml` | Espelho GitHub |

Inativos por padrão. Ativação no README.

## Evolução

1. Scaffold → Page Objects → 10 cenários → Allure  
2. Emulador **do projeto** (`WdioDemo_API34`) + scripts  
3. BrowserStack opcional + CI inativa  
