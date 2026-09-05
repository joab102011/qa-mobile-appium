# Planejamento — qa-mobile-appium

## Objetivo

Atender o Case Técnico de **Automação de Testes Mobile** com 10 cenários no native-demo-app (WebdriverIO), padrão Page Object, Appium 2, evidências (screenshot + Allure) e CI preparado (GitLab + GitHub Actions, inativos).

## Decisão de stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Motor | **Appium 2** + UiAutomator2 | Exigência do desafio; automação nativa |
| Cliente/runner | WebdriverIO + Mocha + Chai | Stack sugerida no PDF |
| Relatório | Allure | Resumo, screenshots de falha, ambiente |
| Cloud | BrowserStack | Devices reais (Android); iOS configurado |
| CI | GitLab CI + GitHub Actions (inativos) | GitLab obrigatório no enunciado; Actions como espelho |

Arquitetura:

```
testes (Mocha/Chai)
   → paginas (Page Object)
      → WebdriverIO
         → Appium Server / BrowserStack Hub
            → Emulador Android ou device cloud
```

## Organização de pastas

| Pasta | Responsabilidade |
|-------|------------------|
| `paginas/` | Page Objects (locators + ações) |
| `testes/` | 10 cenários |
| `dados/` | JSON data-driven |
| `utilitarios/` | Gestos e Allure |
| `apps/` | APK (baixado via script, não versionado) |
| `docs/` | Planejamento e matriz |

## Ambientes

1. **Android local (Windows):** Appium via `@wdio/appium-service` + emulador
2. **BrowserStack Android:** hub `hub.browserstack.com` + `BROWSERSTACK_*`
3. **BrowserStack iOS:** config pronta; execução depende do plano/upload do `.zip` de simulador

## Padrao DADO / QUANDO / ENTAO

Cada cenario nas specs usa `dado()`, `quando()` e `entao()` (`utilitarios/passos.bdd.js`) com steps no Allure — mesmo padrao BDD da suite de API e dos desafios anteriores.

## CI/CD

Dois YAMLs espelhados, **inativos por padrão** (ver README — Estratégia de CI):

| Arquivo | Uso |
|---------|-----|
| `.gitlab-ci.yml` | Exigência do enunciado Mobile |
| `.github/workflows/ci.yml` | Espelho no GitHub (remoto público atual) |

- Job principal: `testar_android_browserstack` (quando secrets existirem)
- Artifacts always: `allure-results/`, `capturas/`
- Emulador no SaaS não é o caminho oficial (pesado) — validação local + CI em cloud
- Ativação documentada no README

## Evolução (fases de commit)

1. Scaffold Appium/WDIO
2. Config Android local + script APK
3. Page Objects
4. Cenários login/cadastro
5. Formulários e navegação
6. Erros + data-driven
7. Screenshots/Allure
8. BrowserStack
9. GitLab CI + GitHub Actions (espelho, inativos)
10. Documentação final
