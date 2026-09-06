# Emulador deste projeto

AVD: **`WdioDemo_API34`**  
Porta padrão: **`5560`** → UDID **`emulator-5560`**

Isso evita conflito com emuladores de outros projetos que costumam usar `5554`.

- Criar: `npm run emulador:criar`
- Iniciar (UI): `npm run emulador:iniciar`
- Iniciar (headless): `npm run emulador:iniciar:headless`
- Porta alternativa: `$env:PORTA_EMULADOR_PROJETO=5562; npm run emulador:iniciar`

Os scripts definem `ANDROID_AVD_HOME` para esta pasta, salvam o UDID em `udid-ativo.txt` e **recusam** AVD que não seja `WdioDemo_*`.
