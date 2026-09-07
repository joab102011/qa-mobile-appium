# Planejamento — qa-mobile-appium

## Objetivo

Entregar o case de **Automação de Testes Mobile** com cobertura rastreável (10 cenários no native-demo-app), Page Object, Appium 2, evidências úteis para diagnóstico (screenshot, Allure, vídeo local) e uma esteira de CI que **sinalize qualidade de forma honesta** — sem confundir “pipeline verde” com “app validado na UI”.

## Decisão de stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Motor | **Appium 2** + UiAutomator2 | Exigência do desafio; padrão de mercado para nativo Android |
| Cliente/runner | WebdriverIO + Mocha + Chai | Stack do enunciado; specs legíveis com DADO/QUANDO/ENTÃO |
| Emulador local | **`WdioDemo_API34` em `emulador/avd`** | Ambiente **controlado e reproduzível**; porta **5560** evita colisão com AVDs de outros projetos |
| Cloud (opcional) | BrowserStack | Extensão de cobertura de dispositivo real/nuvem; não substitui o caminho local oficial |
| CI | GitLab + GitHub Actions (**ativos**, modelo híbrido) | Feedback contínuo no push/PR; jobs de UI na nuvem só com credencial |

Arquitetura local:

```
testes → paginas → WDIO → Appium → emulador WdioDemo_API34 (pasta do repo)
```

## Ambientes

1. **Local (oficial / evidência E2E):** `npm run preparar` → `npm run emulador:iniciar` → `npm run testar:android:local`  
   Emulador exclusivo: **`WdioDemo_API34`** porta **5560**.  
   O WDIO **falha no onPrepare** se não houver `udid-ativo.txt` / `UDID_ANDROID` — fail-fast contra conexão acidental em AVD alheio.
2. **BrowserStack (opcional):** secrets `BROWSERSTACK_*` + `npm run testar:android:bs` — útil quando há necessidade de dispositivo/OS diferentes; depende de conta/trial.
3. **CI (híbrida):** gate de integridade **sempre**; smoke/regressão BrowserStack **somente** se os secrets existirem. O runner **não cria AVD**.

## Política de flake (local)

| Medida | Motivo |
|--------|--------|
| Um spec por processo (`rodar-suite-local.js`) | Reduz contaminação de sessão em um único emulador |
| UDID obrigatório do projeto | Isolamento de ambiente — princípio básico de automação confiável |
| Health-check adb no onPrepare | Feedback imediato se o dispositivo caiu antes da suite |
| Vídeo + screenshot em falha | Diagnóstico orientado a evidência, não a “re-rodar até passar” |

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
| Gate de integridade | GitHub Actions / GitLab (sempre) | Projeto instala, APK sobe, configs WDIO carregam, specs/massa existem — **pronto para executar** |
| Regressão UI | Emulador **`WdioDemo_API34`** (local) | Os **10 cenários** de negócio com evidências (Allure, screenshot, vídeo) |
| Extensão de dispositivo | BrowserStack (condicional) | Mesma suite em dispositivo/OS de nuvem **quando** há secrets |

Na prática: `npm run verificar:ci` no job `verificar_projeto` a cada push/PR. Smoke e regressão BrowserStack só entram se `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY` e `BROWSERSTACK_APP_ID` estiverem configurados.

### O que foi deliberadamente deixado de fora

- **Emulador Android dentro do GitHub Actions.** Sobe o tempo de feedback, aumenta flakiness (boot, KVM, GPU, timeouts) e dilui a responsabilidade de ambiente que o projeto já resolveu com AVD dedicado na porta 5560. Um vermelho intermitente na entrega comunica o oposto de qualidade.
- **BrowserStack como gate obrigatório sem secrets.** Isso gera **falso negativo**: pipeline vermelha por ausência de credencial, não por regressão. Em garantia de qualidade, sinal sujo é pior que sinal incompleto — desde que a incompletude esteja explícita.
- **Job que “passa” sem exercitar o app e se vende como regressão mobile.** Isso seria **falso positivo** de confiança. O gate não substitui a suite E2E; ele apenas certifica que o repositório está íntegro e executável.

### Como ler o resultado na entrega

- **Actions/GitLab verde no gate** → o projeto está estruturalmente saudável e a esteira está viva (mesmo espírito da API, com responsabilidades diferentes por natureza do teste).
- **Allure + capturas + vídeos da execução local** → prova dos 10 cenários no ambiente controlado do desafio.
- **Jobs BrowserStack presentes e condicionais** → a porta para cobertura em nuvem existe; não depende dela para a entrega mínima ser honesta.

Em resumo: optei por uma esteira que **não mente sobre o que testou**. Automação madura privilegia sinal confiável e ambientes explícitos — não a ilusão de “tudo verde na nuvem” sem dispositivo, nem a fragilidade de emular Android em todo commit.

## CI/CD

| Arquivo | Uso |
|---------|-----|
| `.github/workflows/ci.yml` | GitHub Actions — gate sempre; BrowserStack condicional |
| `.gitlab-ci.yml` | Espelho (enunciado Mobile cita GitLab) |

Ativação BrowserStack: cadastrar secrets/variáveis `BROWSERSTACK_*`. Sem isso, só o gate roda — e isso é comportamento esperado, não falha.

## Evolução

1. Scaffold → Page Objects → 10 cenários → Allure  
2. Emulador **do projeto** (`WdioDemo_API34`) + scripts de isolamento (porta 5560 / UDID)  
3. BrowserStack opcional (configs Android/iOS)  
4. CI híbrida ativa: gate de integridade + nuvem condicional  
