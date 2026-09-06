# Matriz de casos de teste — Mobile Appium

Legenda: **Smoke** = `npm run testar:android:smoke` (MOB-01, MOB-03, MOB-07)

| ID | Área | Smoke | Cenário | Arquivo | Dados |
|----|------|-------|---------|---------|-------|
| MOB-01 | Login | sim | Login com credenciais válidas | `testes/login.spec.js` | `dados/usuarios-login.json` |
| MOB-02 | Login | | Senha inválida / erro | `testes/login.spec.js` | JSON |
| MOB-03 | Cadastro | sim | Cadastro com dados válidos | `testes/cadastro.spec.js` | — |
| MOB-04 | Cadastro | | E-mail inválido (mensagem explícita) | `testes/cadastro.spec.js` | — |
| MOB-05 | Formulário | | Input, switch e dropdown | `testes/formularios.spec.js` | — |
| MOB-06 | Formulário | | Submeter botão Active | `testes/formularios.spec.js` | — |
| MOB-07 | Navegação | sim | Abas Início / Formulários / Swipe | `testes/navegacao.spec.js` | — |
| MOB-08 | Navegação | | Gesto swipe (texto do carrossel muda) | `testes/navegacao.spec.js` | — |
| MOB-09 | Erro | | Campos vazios no login (mensagem de validação) | `testes/login.spec.js` | — |
| MOB-10 | Erro | | Senhas divergentes (mensagem same password) | `testes/erros.spec.js` | — |
