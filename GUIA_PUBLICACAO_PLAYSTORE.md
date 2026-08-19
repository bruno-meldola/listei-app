# 🚀 Guia Completo e Descomplicado: Como Publicar o "Listei!" na Google Play Store

Este guia foi escrito em **linguagem 100% humana, clara e passo a passo**, para que qualquer pessoa (mesmo sem experiência prévia com desenvolvimento nativo Android) consiga transformar o **Listei!** em um aplicativo oficial na **Google Play Store**.

---

## 💡 Como um PWA vai para a Play Store?

O **Listei!** é um **PWA (Progressive Web App)** moderno com Service Worker, Manifest e capacidade 100% offline. 
O Google permite e incentiva empacotar PWAs como aplicativos Android através da tecnologia **TWA (Trusted Web Activity)**. 

### Vantagens desse modelo:
1. **Mesmo código**: Qualquer melhoria ou atualização que você fizer no site é atualizada automaticamente para os usuários do app na Play Store, sem precisar enviar um novo APK toda hora.
2. **Leve e Ultra-Rápido**: O app pesa menos de 3 MB para baixar na Play Store.
3. **100% Nativo na visão do usuário**: Tem ícone na tela inicial, abre em tela cheia sem barra de navegador, suporta notificações e funciona offline.

---

## 🛠️ Método Recomendado e Mais Fácil: PWABuilder (Sem código, em 10 minutos)

O **PWABuilder** é uma ferramenta oficial gratuita mantida pela comunidade Microsoft/Google que gera o pacote pronto (`.aab` / Android App Bundle) para a Play Store.

### Passo 1: Fazer o Deploy (Hospedar o Listei!)
Para o Google verificar seu app, ele precisa estar publicado em um domínio HTTPS (gratuito).
- Você pode hospedar gratuitamente em 1 clique no **Vercel**, **Netlify**, **Cloudflare Pages** ou **GitHub Pages**.
- Exemplo com Vercel:
  1. Suba o projeto para o seu GitHub.
  2. Acesse [vercel.com](https://vercel.com) e conecte o repositório.
  3. O Vercel fará o build automaticamente e fornecerá um link como `https://listei.vercel.app`.

### Passo 2: Gerar o Pacote no PWABuilder
1. Acesse **[pwabuilder.com](https://www.pwabuilder.com)**.
2. Digite a URL do seu site publicado (ex: `https://listei.vercel.app`) e clique em **Start**.
3. O PWABuilder irá escanear o seu `manifest.json` e Service Worker (ambos já estão configurados no projeto!).
4. Clique em **Package for Stores** e selecione **Android (Google Play)**.
5. Na tela de opções:
   - **Package ID**: Escolha um identificador único (ex: `com.seudominio.listei` ou `app.listei.mercado`).
   - **App Name**: `Listei!`
   - **Launcher Name**: `Listei!`
   - **Theme & Nav Color**: `#121212` (já pré-configurado no projeto).
   - **Signing Key**: Escolha *"Create new"* para gerar sua chave de assinatura (Guarde este arquivo `.keystore` e a senha com sua vida!).
6. Clique em **Generate** e baixe o arquivo zip.

### Passo 3: O que vem no arquivo ZIP baixado?
- O arquivo principal: **`app-release-bundle.aab`** (este é o arquivo que você sobe no painel da Play Store).
- A pasta **`.well-known/assetlinks.json`** (essencial para remover a barra de endereço do navegador no celular).

---

## 🔗 Passo 4: Configurar o `assetlinks.json` (Remover barra de URL)

Para o Android saber que você é o dono legítimo do site e do aplicativo, você deve colocar o arquivo `assetlinks.json` dentro do seu site:

1. No seu projeto React/Vite, coloque o arquivo `assetlinks.json` dentro da pasta `public/.well-known/assetlinks.json`.
2. Faça o deploy do site novamente.
3. Teste no navegador abrindo: `https://seu-dominio.com/.well-known/assetlinks.json`. Se o arquivo abrir mostrando as chaves SHA-256, está 100% aprovado!

---

## 📱 Passo 5: Publicando no Google Play Console

### 1. Criar sua Conta de Desenvolvedor Google
- Acesse [play.google.com/console/signup](https://play.google.com/console/signup).
- É cobrada uma taxa única vitalícia do Google de $25 dólares.

### 2. Criar o Aplicativo
1. No painel do Google Play Console, clique em **Criar app**.
2. Preencha:
   - **Nome do app**: `Listei! - Lista de Mercado e Calculadora`
   - **Idioma padrão**: Português (Brasil)
   - **Tipo**: App
   - **Gratuito ou Pago**: Gratuito
   - Aceite as políticas e confirme.

### 3. Ficha da Loja (O que as pessoas verão na Play Store)
- **Breve descrição**: *Sua lista de compras inteligente com calculadora integrada em tempo real e controle de orçamento.*
- **Descrição completa**: Explique os benefícios (adicionar itens em casa, preencher valores no mercado sem calculadora externa, riscar itens colocados no carrinho, reordenar com drag-and-drop e nunca estourar o orçamento).
- **Ícone do App**: 512x512 PNG (já incluído no projeto em `public/icon-512.png`).
- **Gráfico de Recursos (Banner da Loja)**: 1024x500 PNG.
- **Capturas de tela (Screenshots)**: Tire 3 a 5 prints da tela do Listei no celular mostrando a lista, a calculadora somando e o resumo.

### 4. Enviar o arquivo `.aab`
1. Vá no menu lateral em **Produção** (ou **Teste Fechado**).
2. Clique em **Criar nova versão**.
3. Faça o upload do arquivo **`app-release-bundle.aab`**.
4. Defina o nome da versão (ex: `1.0.0`).
5. Salve e clique em **Revisar e Lançar**.

---

## 📋 Checklist Rápido de Pré-Lançamento

- [x] Web App Manifest com ícones 192px e 512px configurados.
- [x] Service Worker ativo para navegação offline.
- [x] Design responsivo adaptado para qualquer tamanho de tela de smartphone.
- [x] Persistência de dados automática (LocalStorage).
- [ ] Site hospedado com certificado SSL/HTTPS ativo.
- [ ] Arquivo `assetlinks.json` publicado em `/.well-known/assetlinks.json`.
- [ ] Política de Privacidade criada (pode ser gerada gratuitamente em sites como *App Privacy Policy Generator*).

---

Pronto! Seu aplicativo **Listei!** estará pronto para aprovação da equipe do Google e disponível para download por milhões de usuários no Brasil e no mundo! 🛒🎉
