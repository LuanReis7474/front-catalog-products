Tecnologias do Projeto
Backend:
Node.js, TypeScript, Express, Prisma ORM, PostgreSQL

Frontend:
React, Vite, CSS, TypeScript, Axios

Base da aplicação com padrão MVC, mas com arquitetura em camadas para separar responsabilidades.

# 📦 BACKEND: Product Catalog Backend

## Como Executar

### 1. Pré-requisitos
* Node.js instalado (v18+)
* Banco de dados PostgreSQL rodando

### 2. Instalação
1. Clone o repositório e acesse a pasta.
2. Instale as dependências:
   npm install
3. Crie um arquivo .env na raiz e configure sua URL de conexão:
   DATABASE_URL="postgresql://user:password@localhost:5432/nome_do_banco?schema=public"
4. Execute as migrações para criar as tabelas:
   npx prisma migrate dev
5. Rodar o Projeto
   npm run dev
6. O servidor iniciará em http://localhost:3000  (ou na porta que foi executado)

## 🎨 FRONTEND: `front-catalog-products`

## 🚀 Como Executar
### 1. Pré-requisitos
    * Node.js instalado (v18+)
    * Backend em execução: A API (project-catalog-products) deve estar rodando localmente para que as funcionalidades de listagem e checkout funcionem.

### 1. Instalação
1. Clone o repositório.
2. Entre na pasta do projeto React:
   cd produtos
3. Instale as dependências:
   npm install
4. Certifique-se de que a URL base do backend está correta no arquivo src/services/api.ts (de acordo com o porta onde esta sendo executado a API)
   baseURL: 'http://localhost:3000/api/v1'
5. Rodar o Projeto
   npm run dev
6. Acesse http://localhost:5173 no seu navegador (ou na porta que foi executado)
