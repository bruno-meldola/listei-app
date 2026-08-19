# 🛒 Listei! - Lista de Compras Inteligente & Calculadora em Tempo Real (PWA)

> O aplicativo definitivo para planejar compras em casa e nunca mais perder as contas ou estourar o orçamento no supermercado.

---

## 🧐 O Problema que o Listei! Resolve

Tradicionalmente, ir ao mercado é um processo estressante:
1. O usuário anota o que precisa no WhatsApp ou bloco de notas.
2. No mercado, abre o app de calculadora e fica alternando freneticamente entre o bloco de notas e a calculadora.
3. Precisa multiplicar preços unitários por quantidades (ex: 3 pacotes de café, 1.5kg de maçã) e somar tudo manualmente.
4. No meio das compras, ao alternar entre os aplicativos, a calculadora zera ou se perde e todo o cálculo vai para o ralo.
5. Resultado: susto no caixa com o valor final ultrapassando o orçamento pretendido.

O **Listei!** unifica lista de compras, calculadora automática instantânea, controle de orçamento e reordenação inteligente em um único lugar, funcionando até mesmo **100% offline**.

---

## ✨ Funcionalidades Principais

- 📝 **Criação do Zero & Múltiplas Listas**: Crie e gerencie listas separadas (ex: *Supermercado Mensal*, *Feira do Bairro*, *Churrasco com os Amigos*).
- 📱 **Importação Inteligente do WhatsApp**: Copie sua lista do WhatsApp e cole no Listei! — o aplicativo detecta nomes, quantidades e unidades automaticamente.
- 🧮 **Calculadora Integrada em Tempo Real**: Adicione os produtos sem preço em casa. No mercado, digite o valor unitário (`R$`) e use os botões `+`/`-` para ajustar a quantidade. O subtotal (`quantidade × preço`) e o total da compra são recalculados no mesmo milissegundo.
- ✅ **Checkbox & Efeito Riscado**: Marque os produtos colocados no carrinho para riscar o texto e manter o foco apenas no que ainda falta pegar.
- 🖐️ **Drag 'n Drop Ergonômico**: Reordene os itens arrastando para organizar sua lista na ordem dos corredores do mercado sem ficar rolando a tela sem parar.
- 🎯 **Controle de Teto de Orçamento (Budget Tracker)**: Defina um limite de gastos (ex: R$ 500,00). O aplicativo exibe uma barra de progresso em tempo real e avisa com destaque visual caso você ultrapasse.
- 💾 **Persistência Total (Zero Perda de Dados)**: Cada caractere, preço ou clique é salvo instantaneamente no dispositivo via LocalStorage.
- 📶 **PWA & 100% Offline**: Funcione mesmo nos corredores de supermercados onde não há sinal de internet nem Wi-Fi.
- 📤 **Resumo & Compartilhamento WhatsApp**: Exporte em 1 clique o resumo da compra com valores, subtotais e saldo para enviar de volta no WhatsApp.
- 🔄 **Reutilização de Listas**: Com 1 clique, desmarque todos os produtos e zere os preços para reaproveitar a mesma lista no mês seguinte.

---

## 🎨 Filosofia de Design: Neutro & Foco em UX

O **Listei!** adota um Design System monocromático/neutro de alto contraste:
- **Ergonomia Mobile**: Elementos de toque com área mínima de 44x44px.
- **Barra de Orçamento Fixa**: Totalizador sempre acessível no alcance do polegar.
- **Micro-interações fluidas**: Feedback tátil e transições sem lentidão.
- **Clareza Absoluta**: Se o design funciona com excelência em preto e branco, ele não depende de distrações visuais para ser útil e veloz.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- NPM ou Yarn

### Passo a Passo:
```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# 3. Gerar a build de produção (PWA otimizado)
npm run build

# 4. Pré-visualizar a build de produção
npm run preview
```

---

## 📱 Como Publicar na Google Play Store

O projeto já conta com o arquivo `manifest.json`, Service Worker configurado, ícones em alta resolução e suporte a TWA (Trusted Web Activity).

Consulte o guia completo e didático passo a passo em:
👉 **[GUIA_PUBLICACAO_PLAYSTORE.md](./GUIA_PUBLICACAO_PLAYSTORE.md)**

---

## 📁 Estrutura do Código

```
Listei/
├── public/
│   ├── favicon.svg               # Ícone vetorial do aplicativo
│   ├── icon-192.png              # Ícone PWA / Android 192x192
│   ├── icon-512.png              # Ícone PWA / Play Store 512x512
│   └── manifest.json             # Manifesto Web App / PWA
├── src/
│   ├── components/
│   │   ├── AddItemForm.tsx       # Formulário de inserção rápida de itens
│   │   ├── BudgetBar.tsx         # Barra fixa inferior de orçamento e total
│   │   ├── BudgetModal.tsx       # Modal de configuração do teto de gastos
│   │   ├── EditItemModal.tsx     # Modal de edição detalhada de itens
│   │   ├── Header.tsx            # Cabeçalho e seletor de listas
│   │   ├── ItemCard.tsx          # Card de item com drag handle, checkbox e calculadora
│   │   ├── ItemList.tsx          # Container da lista ordenável com @dnd-kit
│   │   ├── ListManagerModal.tsx  # Gerenciador de múltiplas listas de compras
│   │   ├── QuickPasteModal.tsx   # Importador de texto do WhatsApp
│   │   └── SummaryModal.tsx      # Resumo e exportador formatado
│   ├── hooks/
│   │   └── useShoppingLists.ts   # Hook central de estado, cálculos e persistência
│   ├── styles/
│   │   └── index.css             # Design System Neutro, tokens e animações
│   ├── types/
│   │   └── shopping.ts           # Interfaces e tipos TypeScript
│   ├── utils/
│   │   ├── currency.ts           # Formatadores e máscaras de moeda BRL
│   │   └── parser.ts             # Parser e gerador de mensagens WhatsApp
│   ├── App.tsx                   # Componente raiz da aplicação
│   └── main.tsx                  # Ponto de entrada do React
├── GUIA_PUBLICACAO_PLAYSTORE.md  # Manual passo a passo para a Play Store
├── package.json
├── tsconfig.json
└── vite.config.ts
```
