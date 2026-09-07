# Planejamento — qa-mobile-appium

## Objetivo

Entregar o case de **Automação de Testes Mobile** com cobertura rastreável (10 cenários no native-demo-app), Page Object, Appium 2, evidências úteis para diagnóstico (screenshot, Allure, vídeo local) e uma esteira de CI que **sinalize qualidade de forma honesta** — sem confundir “pipeline verde” com “app validado na UI”.

## Decisão de stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Motor | **Appium 2** + UiAutomator2 (+ XCUITest no Mac) | Exigência do desafio; padrão de mercado para nativo |
| Cliente/runner | WebdriverIO + Mocha + Chai | Stack do enunciado; specs legíveis com DADO/QUANDO/ENTÃO |
| Emulador Android | **`WdioDemo_API34` em `emulador/avd`** | Ambiente **controlado**; porta **5560** evita colisão com AVDs alheios |
| Simulator iOS | Xcode (somente macOS) | Mesma suite; app oficial só para Simulator (limitação Apple) |
| Cloud (opcional) | BrowserStack | Extensão de cobertura; não substitui o caminho local |
| CI | GitLab + GitHub Actions (**ativos**, híbrido) | Gate sempre; UI na nuvem só com credencial |

Arquitetura local:

```
testes → paginas (seletores multiplataforma) → WDIO → Appium
                                              ├─ Android: WdioDemo_API34 (:5560)
                                              └─ iOS:     Xcode Simulator (macOS)
```

Comandos operacionais: [`COMANDOS.md`](COMANDOS.md).

## Ambientes

1. **Android local (evidência E2E padrão):**  
   `npm run preparar:android` → `npm run emulador:iniciar` → `npm run testar:android:local`  
   Fail-fast se não houver UDID do projeto (`udid-ativo.txt` / `UDID_ANDROID`).
2. **iOS local (macOS):**  
   `npm run preparar:ios` → Simulator aberto → `npm run testar:ios:local`  
   Fora de Darwin o comando aborta com erro explícito (evita falsa expectativa no Windows).
3. **BrowserStack (opcional):** secrets `BROWSERSTACK_*` + `npm run testar:android:bs` / `testar:ios:bs`.
4. **CI (híbrida):** `npm run verificar:ci` **sempre**; smoke/regressão BS **somente** com secrets. Runner **não** cria AVD nem sobe Simulator.

## Política de flake (local)

| Medida | Motivo |
|--------|--------|
| Um spec por processo (`rodar-suite-local.js`) | Reduz contaminação de sessão em um único dispositivo |
| UDID obrigatório do projeto (Android) | Isolamento de ambiente |
| Fail-fast fora de macOS para iOS local | Sinal honesto: iOS Simulator não existe no Windows |
| Health-check adb no onPrepare | Feedback imediato se o emulador caiu |
| Vídeo + screenshot em falha | Diagnóstico orientado a evidência |

## Padrao DADO / QUANDO / ENTAO

Specs usam `dado()` / `quando()` / `entao()` (`utilitarios/passos.bdd.js`), alinhando intenção do cenário à evidência no Allure.

---

## Decisão de CI na entrega

### Contexto de qualidade

Em automação mobile, o resultado só é confiável quando estão sob controle, ao mesmo tempo: **o app sob teste**, **o driver (Appium)**, **o dispositivo/emulador**, **a massa** e **a evidência de falha**. Quebrar qualquer um desses elos gera ruído: falha que não é defeito do produto, ou pior — sucesso que não exercitou a UI.

Por isso a esteira deste repositório não tenta “provar tudo no mesmo job”. Ela separa o que a pipeline pode garantir de forma estável do que exige um ambiente de execução mobile real.

### Critérios da decisão

Avaliei as opções (emulador no GitHub Actions, BrowserStack obrigatório, ou CI só documental) sob cinco critérios:

1. **Velocidade do feedback** — o time (ou o avaliador) precisa de sinal rápido no push.
2. **Confiabilidade do sinal** — verde/vermelho precisa significar a mesma coisa amanhã.
3. **Alinhamento ao enunciado** — caminho local gratuito é o oficial; BrowserStack é opcional.
4. **Custo** — minutos de runner, flakiness e assinatura de nuvem.
5. **Rastreabilidade** — fica claro o que foi validado em CI versus o que foi validado na suite E2E.

### Estratégia adotada (híbrida)

A pirâmide de confiança deste case ficou assim:

| Camada | Onde | O que prova |
|--------|------|-------------|
| Gate de integridade | GitHub Actions / GitLab (sempre) | `npm ci` + APK + app iOS Simulator + configs WDIO — **pronto para executar** |
| Regressão UI Android | Emulador **`WdioDemo_API34`** (local) | Os **10 cenários** com evidências |
| Regressão UI iOS | Xcode Simulator (macOS) ou BrowserStack | Mesma suite; local só onde o SO permite |
| Extensão de dispositivo | BrowserStack (condicional) | Nuvem **quando** há secrets |

Na prática: `npm run verificar:ci` no job `verificar_projeto` a cada push/PR. Smoke e regressão BrowserStack só entram se os secrets existirem (detecção em step, sem `secrets` no `if` de job).

### O que foi deliberadamente deixado de fora

- **Emulador Android dentro do GitHub Actions.** Sobe o tempo de feedback, aumenta flakiness e dilui o isolamento do AVD na porta 5560.
- **BrowserStack como gate obrigatório sem secrets.** Gera **falso negativo** (vermelho por credencial, não por regressão).
- **Job que “passa” sem exercitar o app e se vende como regressão mobile.** Seria **falso positivo** de confiança.

### Como ler o resultado na entrega

- **Actions/GitLab verde no gate** → projeto estruturalmente saudável; esteira viva.
- **Allure + capturas + vídeos da execução local** → prova dos 10 cenários.
- **Jobs BrowserStack condicionais** → porta para nuvem existe; entrega mínima não depende dela.

Em resumo: optei por uma esteira que **não mente sobre o que testou**. Comandos explícitos por plataforma estão em [`COMANDOS.md`](COMANDOS.md).

## CI/CD

| Arquivo | Uso |
|---------|-----|
| `.github/workflows/ci.yml` | GitHub Actions — gate sempre; BrowserStack condicional |
| `.gitlab-ci.yml` | Espelho (enunciado Mobile cita GitLab) |

Ativação BrowserStack: cadastrar secrets/variáveis `BROWSERSTACK_*`. Sem isso, só o gate roda — comportamento esperado.

## Evolução

1. Scaffold → Page Objects → 10 cenários → Allure  
2. Emulador **do projeto** (`WdioDemo_API34`) + scripts de isolamento (porta 5560 / UDID)  
3. BrowserStack opcional (configs Android/iOS)  
4. CI híbrida ativa: gate de integridade + nuvem condicional  
5. iOS local no Mac (`wdio.ios.local.conf.js`) + comandos explícitos em `COMANDOS.md`  
