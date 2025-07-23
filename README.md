# MugenOs (無限)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)
![Status](https://img.shields.io/badge/status-Em%20Desenvolvimento-orange.svg)

**Um sistema infinito para a sua organização pessoal.**

Organize projetos, arquivos, finanças e compromissos. O MugenOs é um ecossistema de produtividade construído com tecnologias web modernas, focado numa interface limpa e numa experiência de utilização ágil, sem depender de frameworks pesados.

### ✨ Funcionalidades

| Módulo | Status | Descrição |
| :--- | :--- | :--- |
| 📙 **Projetos** | ✅ **Funcional** | Crie e gira projetos com etapas, prazos e acompanhamento visual do progresso. |
| 📙 **Editor** | ✅ **Funcional** | Um editor de texto puro com um explorador de arquivos lateral para gestão de documentos. |
| 💸 **Finanças** | 🚧 **Em Desenvolvimento** | Controlo completo de receitas e despesas com categorias, contas e relatórios detalhados. |
| 📅 **Compromissos** | 🚧 **Em Desenvolvimento** | Uma agenda integrada com calendário, lembretes e priorização de tarefas. |

### 🏗️ Arquitetura

#### Estado Atual (Frontend Only)
```
┌─────────────────┐
│   Utilizador    │
└─────────┬───────┘
          │
    ┌─────▼─────┐
    │   Vite    │ ← Servidor de desenvolvimento
    │  Dev/Prod │
    └─────┬─────┘
          │
┌─────────▼─────────┐
│     Frontend      │
│ TypeScript + CSS  │ ← Web Components
│   Web Components  │
└─────────┬─────────┘
          │
   ┌──────▼──────┐
   │ localStorage │ ← Armazenamento local temporário
   └─────────────┘
```

#### Arquitetura de Produção (Planeada)
O MugenOs será executado num ambiente de containers, garantindo escalabilidade, segurança e fácil manutenção.

```
┌─────────────────┐
│   Utilizador    │
└─────────┬───────┘
          │
    ┌─────▼─────┐
    │   Nginx   │ ← Reverse Proxy + Static Files
    └─────┬─────┘
          │
┌─────────▼─────────┐
│     Frontend      │
│ TypeScript + CSS  │ ← Interface do utilizador
│   Web Components  │
└─────────┬─────────┘
          │ API REST
    ┌─────▼─────┐
    │Backend (C)│ ← Lógica de negócio
    └─────┬─────┘
          │
    ┌─────▼─────┬─────────────┐
    │PostgreSQL │    MinIO    │
    │(Database) │  (Storage)  │ ← Persistência de dados
    └───────────┴─────────────┘
```

**Componentes:**
- **Frontend (Nginx)**: Serve a interface estática construída com Vite
- **Backend (API em C)**: Lógica de negócio e comunicação com base de dados
- **PostgreSQL**: Dados estruturados (projetos, utilizadores, transações)
- **MinIO**: Armazenamento de arquivos do módulo Editor

### 🚀 Roadmap e Visão Futura

O nosso objetivo é criar um ecossistema de organização completo e integrado.

  - [x] Interface elegante com tema *dark*
  - [x] Sistema de Projetos com gestão de etapas
  - [x] Bloco de Notas inicial com salvamento em `localStorage`
  - [x] Migração da base de código para **Vite + TypeScript**
  - [x] Refatoração do Bloco de Notas para um Editor com explorador de arquivos
  - [ ] Backend em C com uma API RESTful robusta
  - [ ] Integração com **PostgreSQL** para persistência de dados
  - [ ] Integração com **MinIO** para armazenamento de arquivos
  - [ ] Sistema de autenticação de utilizadores
  - [ ] Lançamento do Módulo de Finanças
  - [ ] Lançamento do Módulo de Compromissos
  - [ ] Transformar a aplicação num PWA (Progressive Web App) para uma melhor experiência mobile

### 🛠️ Tecnologias Utilizadas

| Área | Tecnologia |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, TypeScript, Web Components |
| **Ferramentas** | Vite (Servidor de Desenvolvimento e Build) |
| **Backend (Planeado)** | C (API RESTful) |
| **Banco de Dados (Planeado)** | PostgreSQL |
| **Armazenamento (Planeado)** | MinIO |
| **Deploy (Sugestão)** | Docker Compose em qualquer servidor cloud/local |

### 📋 Requisitos do Sistema

#### Para Desenvolvimento
- **Node.js**: v16.0+ (recomendado v18+)
- **npm**: v7.0+ (incluído com Node.js)
- **Browsers suportados**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

#### Para Produção (Futuro)
- **Docker**: v20.0+
- **Docker Compose**: v2.0+
- **Servidor**: Linux/Unix com 2GB RAM mínimo
- **Portas**: 80 (HTTP), 443 (HTTPS), 5432 (PostgreSQL), 9000 (MinIO)

### ⚙️ Como Executar o Projeto Localmente

#### Configuração Inicial

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/mbispo22/MugenOs.git
    cd MugenOs
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

#### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (http://localhost:5173) |
| `npm run build` | Constrói a versão de produção na pasta `dist/` |
| `npm run preview` | Pré-visualiza a build de produção localmente |
| `npm run type-check` | Verifica os tipos TypeScript sem compilar |
| `npm run lint` | Executa o linter para verificar qualidade do código |

#### Desenvolvimento

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

4.  Abra o seu navegador e aceda a `http://localhost:5173`

#### Build de Produção

Para criar uma build otimizada para produção:
```bash
npm run build
npm run preview  # Para testar a build localmente
```

### ⛩️ Filosofia

> "無限" - Sem limites para a sua organização pessoal.

-----

**Desenvolvido com ❤️ por [mbispo22](https://github.com/mbispo22)**
