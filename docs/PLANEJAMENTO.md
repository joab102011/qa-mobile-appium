# Planejamento — qa-mobile-appium

## Objetivo

Atender o Case Técnico de **Automação de Testes Mobile** com 10 cenários no native-demo-app (WebdriverIO), padrão Page Object, Appium 2, evidências (screenshot + Allure) e GitLab CI.

## Decisão de stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Motor | **Appium 2** + UiAutomator2 | Exigência do desafio; automação nativa |
| Cliente/runner | WebdriverIO + Mocha + Chai | Stack sugerida no PDF |
| Relatório | Allure | Resumo, screenshots de falha, ambiente |
| Cloud | BrowserStack | Devices reais (Android); iOS configurado |
| CI | GitLab CI | Obrigatório no enunciado |

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

## CI/CD

- Job principal: `testar_android_browserstack` (quando secrets existirem)
- Artifacts always: `allure-results/`, `capturas/`
- Emulador no SaaS não é o caminho oficial (pesado) — documentado no README

## Evolução (fases de commit)

1. Scaffold Appium/WDIO
2. Config Android local + script APK
3. Page Objects
4. Cenários login/cadastro
5. Formulários e navegação
6. Erros + data-driven
7. Screenshots/Allure
8. BrowserStack
9. GitLab CI
10. Documentação final
