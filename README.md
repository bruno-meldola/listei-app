# 🛒 Listei! - Lista de Compras Inteligente & Calculadora em Tempo Real

<p align="center">
  <strong>Aplicativo web progressivo (PWA) offline-first para planejamento de compras, cálculo automático de subtotais e controle de orçamento em tempo real.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/Material_Icons-Google-007FFF?logo=materialdesign&logoColor=white" alt="Material Design Icons" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## 🎯 Sobre o Projeto

O **Listei!** foi desenvolvido para solucionar a dor comum de calcular compras no mercado alternando entre bloco de notas e calculadora. 

Ele unifica a lista de compras, o cálculo automático de produtos unitários e pesáveis (por kg ou gramas), o monitoramento de teto de gastos e a organização visual dos corredores via drag 'n drop — funcionando **100% offline**.

---

## ✨ Funcionalidades Principais

- 🧮 **Calculadora em Tempo Real**: Cálculo instantâneo de subtotais (`quantidade × preço unitário` ou `peso × preço/kg`) com atualização imediata do valor total da compra.
- ⚖️ **Suporte a Itens Pesáveis**: Gestão de produtos de hortifrúti/açougue por quilo (`kg`) ou gramas (`g`), com tag identificadora e campo para lançamento direto do valor da balança.
- 🎯 **Controle de Teto de Gastos (Budget Tracker)**: Definição de orçamento máximo com barra de progresso em tempo real e avisos visuais de limite.
- 🖐️ **Organização com Drag 'n Drop**: Reordenação ergonômica de itens com sensores adaptados para toque em smartphones e mouse em desktops.
- 📁 **Gerenciamento de Múltiplas Listas**: Criação, renomeação, duplicação e exclusão de listas independentes.
- 💬 **Integração Inteligente com WhatsApp**: Importador de texto com detecção automática de quantidades/unidades e exportação do resumo formatado para compartilhamento.
- 🌓 **Tema Claro e Escuro (Material Design)**: Suporte completo a Modo Claro, Modo Escuro e sincronização com o tema do sistema operacional.
- 📶 **PWA & Offline-First**: Instalação nativa na tela inicial (Android/iOS/Desktop) e persistência de dados local sem necessidade de conexão com a internet.

---

## 🛠️ Tecnologias & Arquitetura

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Ícones**: [Google Material Icons](https://mui.com/material-ui/material-icons/) via `@mui/icons-material`
- **Drag & Drop**: [@dnd-kit/core](https://dndkit.com/) + `@dnd-kit/sortable`
- **PWA & Cache**: `vite-plugin-pwa` + `Workbox`
- **Persistência**: Web LocalStorage API com sincronização reativa via Custom Hooks

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Gerenciador de pacotes npm, yarn ou pnpm

### Passo a passo:

```bash
# 1. Clonar o repositório
git clone https://github.com/bruno-meldola/listei-app.git

# 2. Acessar a pasta do projeto
cd listei-app

# 3. Instalar as dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Link da aplicação: [EM BREVE]

---

## 📋 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento com Hot Module Replacement (HMR). |
| `npm run build` | Valida tipagens com o TypeScript compiler e gera o bundle de produção otimizado na pasta `dist/`. |
| `npm run preview` | Executa localmente a versão final gerada na pasta `dist/`. |
| `npm run lint` | Executa a análise estática de código com o Oxlint. |

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
