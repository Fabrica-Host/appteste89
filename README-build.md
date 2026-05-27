# 89 Fm Curitiba — App Android

Projeto Capacitor pronto para gerar o **.aab** para a Google Play Store.

## Resumo

- Package ID: `br.com.89rockcuritiba.app`
- Versão: 1.0.0 (código 1)
- WebView aponta para: https://socialradio.lovable.app/app/89rockcuritiba?source=android

## Duas formas de gerar o .aab

**Opção A — Build na nuvem (recomendado, sem Android Studio):** use o workflow do GitHub Actions incluso em `.github/workflows/build-android.yml`. Veja `.github/README-CI.md`.

**Opção B — Build local:** siga o passo a passo abaixo.

## Pré-requisitos (apenas para build local)

- Node.js 20+
- Java 17 (JDK)
- Android Studio com Android SDK (API 34+)
- Variável `ANDROID_HOME` configurada

## Passo a passo

```bash
# 1. Instalar dependências
npm install

# 2. Adicionar a plataforma Android (cria pasta android/)
npx cap add android

# 3. Gerar todos os ícones e splash em todas as densidades
#    (a partir de resources/icon.png e resources/splash.png)
npx @capacitor/assets generate --android

# 4. Sincronizar configuração com o projeto nativo
npx cap sync android

# 5. (Opcional) Abrir no Android Studio para inspecionar
npx cap open android

# 6. Gerar APK de teste (debug)
cd android && ./gradlew assembleDebug
# resultado: android/app/build/outputs/apk/debug/app-debug.apk

# 7. Gerar Bundle (.aab) para a Play Store
./gradlew bundleRelease
# resultado: android/app/build/outputs/bundle/release/app-release.aab
```

## Assinatura para a Play Store

Antes do `bundleRelease` você precisa de um **keystore**. Crie uma vez e guarde com segurança:

```bash
keytool -genkey -v -keystore 89rockcuritiba.keystore -alias 89rockcuritiba \
  -keyalg RSA -keysize 2048 -validity 10000
```

E adicione em `android/app/build.gradle` dentro de `android { ... }`:

```gradle
signingConfigs {
    release {
        storeFile file('../../89rockcuritiba.keystore')
        storePassword 'SUA_SENHA'
        keyAlias '89rockcuritiba'
        keyPassword 'SUA_SENHA'
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
    }
}
```

## Publicação

1. Acesse https://play.google.com/console
2. Crie um novo app com o pacote `br.com.89rockcuritiba.app`
3. Faça upload do arquivo `app-release.aab`
4. Preencha ficha da loja, classificação, política de privacidade
5. Envie para revisão (1–7 dias)

## Atualizações futuras

O conteúdo do app é carregado da web (https://socialradio.lovable.app/app/89rockcuritiba). Mudanças visuais e funcionais aparecem **sem republicar** o app. Só republique se mudar:

- Ícone, nome ou cores
- Permissões
- Quando exigido pelo Google (segurança/política)

Ao republicar, **incremente `version_code`** no painel admin antes de gerar um novo ZIP.
