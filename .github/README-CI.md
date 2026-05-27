# Build automático na nuvem (GitHub Actions)

Este projeto inclui um workflow que compila o **.aab** para a Google Play Store sem precisar de Android Studio.

## Como ativar

### 1. Suba o projeto para um repositório GitHub

```bash
git init
git add .
git commit -m "Setup 89 Fm Curitiba"
gh repo create 89rockcuritiba-android --private --source=. --push
```

### 2. Crie um keystore localmente (apenas uma vez)

```bash
keytool -genkey -v -keystore 89rockcuritiba.jks -alias 89rockcuritiba \
  -keyalg RSA -keysize 2048 -validity 10000
```

**Guarde com extrema segurança** — sem ele você não pode publicar atualizações na Play Store.

### 3. Converta o keystore em base64

```bash
base64 -i 89rockcuritiba.jks | tr -d '\n' > keystore.base64.txt
```

### 4. Configure os secrets no GitHub

Acesse **Settings → Secrets and variables → Actions** no seu repositório e adicione:

| Secret | Valor |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | conteúdo de `keystore.base64.txt` |
| `ANDROID_KEY_ALIAS` | `89rockcuritiba` |
| `ANDROID_KEYSTORE_PASSWORD` | senha do keystore |
| `ANDROID_KEY_PASSWORD` | senha da chave (geralmente igual à do keystore) |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | conteúdo do JSON da service account do Google Play |

### 4b. Configurar Service Account do Google Play (publicação automática)

Esta rádio está marcada para **publicação automática** na faixa `internal` com status `draft`.

1. No [Google Cloud Console](https://console.cloud.google.com), crie uma **Service Account** com a role *Service Account User*
2. Gere uma chave **JSON** para essa service account e baixe
3. No [Google Play Console](https://play.google.com/console), vá em **Setup → API access**
4. Vincule a service account criada e dê permissão de **Release manager**
5. Cole o conteúdo do JSON inteiro no secret `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` do GitHub

> ⚠️ A primeira versão (v1) precisa ser enviada **manualmente** pela Play Console antes que o upload automático funcione.

### 5. Rode o workflow

- **Automático:** todo push na branch `main` gera um `.aab` e envia para a Play Store.
- **Manual:** vá em **Actions → Build Android AAB → Run workflow**.

### 6. Baixe o .aab

Quando o workflow terminar (≈5–10 min), abra a execução e baixe o artifact **`89rockcuritiba-release-aab`**.

Como **publicação automática está ativa**, o `.aab` também já foi enviado para a faixa `internal` da Play Console.

## Sem keystore?

O workflow detecta automaticamente e faz build **debug (.apk)** que você pode instalar direto no celular para testar — mas **não serve para a Play Store**.

## Atualizações

Para nova versão na Play Store:

1. No painel admin do Lovable, incremente `version_code` e `version_name`
2. Gere um novo ZIP, substitua no repositório, commite e push
3. O CI faz o upload automaticamente para a faixa configurada.
