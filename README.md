# Teste Prático Back-end BeTalent - Nível 2

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![AdonisJS](https://img.shields.io/badge/AdonisJS-220052?style=for-the-badge&logo=AdonisJS&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)

Este repositório contém a solução do teste prático para Back-end da BeTalent, focado nos requisitos e entrega definidos no **Nível 2**, mas com adição de diferenciais técnicos extras.

## Índice

1. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
2. [Arquitetura e Diferenciais Técnicos](#-arquitetura-e-diferenciais-técnicos)
3. [Requisitos do Ambiente](#-requisitos-do-ambiente)
4. [Como Instalar e Rodar o Projeto](#-como-instalar-e-rodar-o-projeto)
5. [Testando a API e Usuário Padrão](#-testando-a-api-e-usuário-padrão)
6. [Documentação da API (OpenAPI/Swagger)](#-documentação-da-api-openapiswagger)
7. [Utilitários CLI (Makefile)](#️-utilitários-cli-makefile)

---

## 🚀 Tecnologias Utilizadas

- **Node.js** com **AdonisJS** (Framework HTTP e injeção de dependências)
- **Lucid ORM** (Gestão de Banco de Dados)
- **VineJS** (Validação de Dados)
- **MySQL** (Banco de dados relacional)
- **Docker & Docker Compose** (Orquestração do ambiente)
- **Swagger/OpenAPI** (Documentação)

---

## 🧠 Arquitetura e Diferenciais Técnicos

Este projeto adota boas práticas de desenvolvimento para garantir manutenção futura, escalabilidade e manuseio de erros consistentes. Alguns dos principais diferenciais técnicos implementados:

- 🛡️ **Estratégia de Fallback (Resiliência):** O principal desafio deste caso de uso. O sistema foi desenhado para lidar com múltiplos Gateways de Pagamento de forma inteligente. Se o provedor principal de pagamento falhar por instabilidade ou rejeição temporária, a API automaticamente transaciona a compra usando o próximo Gateway disponível pela ordem de prioridade.
- 🏗️ **Padrões de Projeto (Design Patterns):**
  - **Service Pattern:** Regras de negócio complexas de transações e cálculos de juros/descontos isoladas dos Controladores HTTP.
  - **Data Transfer Objects (Transformers):** As respostas devolvidas para o cliente (JSON) são transformadas e padronizadas, ocultando dados sensíveis ou informações de infraestrutura de banco de dados do *output* final da API.
  - **Validations:** A integridade dos dados de entrada (payloads de criação de usuários, transações ou edição) são rigidamente validados pelo VineJS antes que qualquer processamento lógico seja iniciado.

- 🚨 **Global Exception Handling:** A API possui um tratador de erros centralizado nativo, de forma que exceções de domínio ou quebras de banco de dados sempre retornam ao usuário final no mesmo formato consistente de erro em JSON, com o Status HTTP (ex: 400, 422, 500) apropriado, protegendo a aplicação contra crash/vazamento de stack traces não tratadas.

---

## 📋 Requisitos do Ambiente

Para rodar este projeto localmente você precisará ter instalado em sua máquina:

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- *(Opcional)* [Node.js](https://nodejs.org/) e **Make** (Para rodar comandos de atalho)

---

## 🔧 Como Instalar e Rodar o Projeto

Este projeto está totalmente dockerizado, incluindo a API principal, o banco de dados MySQL e os **Mock Gateways**.

1. Clone o repositório:

   ```bash
   git clone https://github.com/pedro-henrique1/teste-pratico-backend-beTalent.git
   cd teste-pratico-backend-beTalent
   ```

2. Crie seu arquivo de ambiente (`.env`) baseado no exemplo de configuração:

   ```bash
   cp .env.example .env
   ```

   *(Verifique se o `.env` existe e possui as credenciais do banco e URLs dos Gateways como `http://mock-gateways:3001` e `http://mock-gateways:3002`)*

3. Suba as aplicações via Docker Compose:

   ```bash
   docker compose up --build -d 
   ```

   Ou utilize o Makefile:

   ```bash
   make up-build
   ```

   *Este comando irá construir a imagem da API, baixar as imagens do MySQL e do Mock Gateways, e iniciar todos os serviços simultaneamente.*

4. Rode as *migrations* e os *seeders* para inicializar a estrutura e popular usuários/produtos base:
   **(Caso o container não resolva automaticamente na inicialização)**

   ```bash
   docker compose exec app node ace migration:run
   docker compose exec app node ace db:seed
   ```

   > **Via Makefile:** Você pode rodar apenas `make migrate` e `make seed`.

O servidor da API estará disponível através de **`http://localhost:3333`**.

---

## 📖 Documentação da API (OpenAPI/Swagger)

A API possui uma especificação técnica detalhada seguindo o padrão *OpenAPI 3.0*. O arquivo de documentação está localizado na raiz do projeto:

- *Arquivo:* openapi.yaml

Para visualizar a documentação de forma interativa, você pode:

1. Importar o arquivo openapi.yaml no *Swagger Editor* ou *Postman*.
2. Utilizar extensões de visualização no VS Code (como OpenAPI (Swagger) Editor).
3. Abrir o arquivo em qualquer ferramenta compatível com Swagger/OpenAPI.

---

## 🛣️ Detalhamento de Rotas

Abaixo estão as principais rotas contempladas pela aplicação. Rotas privadas necessitam do envio de um **Bearer Token** no cabeçalho HTTP (`Authorization: Bearer <seu_token>`).

### Rotas Públicas

| Método    | Endpoint                   | Descrição                                         |
| :-------- | :------------------------- | :------------------------------------------------ |
| **POST**  | `/api/v1/auth/login`       | Realiza o login na aplicação, devolve JWT.        |
| **POST**  | `/api/v1/auth/signup`      | Cadastra um novo usuário.                         |
| **POST**  | `/api/v1/transactions`     | Processa o checkout (compra).                     |

### Rotas Privadas (Necessitam Autenticação)

| Recurso       | Método     | Endpoint                          | Descrição                                                       |
| :------------ | :--------- | :-------------------------------- | :-------------------------------------------------------------- |
| **Usuários**  | **GET**    | `/api/v1/users`                   | Lista todos os usuários.                                        |
|               | **GET**    | `/api/v1/users/:id`               | Detalha um usuário específico.                                  |
|               | **PUT**    | `/api/v1/users/:id`               | Atualiza dados do usuário.                                      |
|               | **DELETE** | `/api/v1/users/:id`               | Deleta o usuário.                                               |
| **Produtos**  | **CRUD**   | `/api/v1/products`                | Operações de (GET, POST, PUT, DELETE) padrão do Resource.       |
| **Transações**| **GET**    | `/api/v1/transactions`            | Filtra e lista todo o histórico das compras e integrações.      |
|               | **GET**    | `/api/v1/transactions/:id`        | Retorna detalhes de uma transação específica.                   |
| **Clientes**  | **GET**    | `/api/v1/clients`                 | Lista todos os clientes que já participaram de uma transação.   |
|               | **GET**    | `/api/v1/clients/:id`             | Lista as informações de um cliente e seu histórico de compras.  |
| **Gateways**  | **PATCH**  | `/api/v1/gateways/:id/toggle`     | Habilita ou desabilita (Ativo/Inativo) o gateway.               |
|               | **PATCH**  | `/api/v1/gateways/:id/priority`   | Altera a prioridade do Gateway no fallback.                     |

## 🧪 Testando a API e Usuário Padrão

Para facilitar a avaliação, este projeto já inclui ferramentas prontas para teste:

1. **Credenciais do Usuário Padrão**
   Ao rodar as *migrations* e *seeders* (`make seed`), um usuário administrador é criado automaticamente no banco para que você não precise se cadastrar na mão. Você pode usar as seguintes credenciais na rota de login (`/api/v1/auth/login`):
   - **Email:** `dev@betalent.tech`
   - **Senha:** `FEC9BB078BF338F464F96B48089EB498`

2. **Collection do Postman**
   Na raiz do repositório, existe o arquivo **`Postman_Collection.json`**.
   Basta importá-lo no seu [Postman](https://www.postman.com/) para ter todas as rotas (com body, headers e tokens base) previamente configuradas e prontas para uso!

## 🛠️ Utilitários CLI (Makefile)

Para facilitar a execução de tarefas diárias sem precisar digitar comandos complexos do Docker todas as vezes, o projeto conta com um arquivo `Makefile` na raiz.

Pelo seu terminal (na raiz do projeto), você pode utilizar os seguintes atalhos:

- `make help` - Exibe todos os atalhos disponíveis.
- `make up` - Sobe os containers em background.
- `make up-build` - Sobe os containers recriando as imagens (build).
- `make down` - Derruba os containers.
- `make restart` - Reinicia os containers.
- `make logs` - Exibe os logs contínuos da aplicação.
- `make sh` - Acessa o terminal interativo do container da API.
- `make migrate` - Roda as migrations do banco de dados.
- `make seed` - Popula o banco de dados com os seeders iniciais.
- `make fresh` - Reseta o banco de dados e roda as migrations e seeders do zero.
- `make install` - Roda `npm install` dentro do container da aplicação.
