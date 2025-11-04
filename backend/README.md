# Bingo API

   

API de gerenciamento de jogos de bingo online, desenvolvida com NestJS, Prisma e WebSockets para uma experiência em tempo real.

## 🚀 Funcionalidades

  * **Autenticação e Autorização**:
      * Registro e login de usuários com JWT (JSON Web Tokens).
      * Proteção de rotas e diferenciação entre usuários comuns e administradores.
  * **Gerenciamento de Usuários**:
      * Visualização e atualização de perfil.
      * Recarga de créditos.
      * CRUD de usuários para administradores.
  * **Salas e Jogos**:
      * Criação e gerenciamento de salas de bingo por administradores.
      * Agendamento de novos jogos.
      * Compra de cartelas pelos usuários.
  * **Gameplay em Tempo Real**:
      * Sorteio de números transmitido em tempo real para todos os jogadores na sala via WebSockets.
      * Detecção automática de vencedores.
      * Distribuição de prêmios.
  * **Sistema de Prêmios**:
      * Administradores podem criar e gerenciar prêmios para os jogos.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

  * **Backend**: [NestJS](https://nestjs.com/)
  * **Banco de Dados**: MySQL (gerenciado com [Prisma ORM](https://www.prisma.io/))
  * **Autenticação**: [Passport.js](http://www.passportjs.org/) com estratégia JWT
  * **Comunicação em Tempo Real**: [Socket.IO](https://socket.io/)
  * **Validação**: [class-validator](https://github.com/typestack/class-validator), [Joi](https://joi.dev/)
  * **Linguagem**: [TypeScript](https://www.typescriptlang.org/)

## ⚙️ Instalação e Configuração

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

  * [Node.js](https://nodejs.org/) (versão \>= 16)
  * [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
  * Um servidor de banco de dados [MySQL](https://www.mysql.com/)

### Passos

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/bingo-api.git
    cd bingo-api
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

      * Renomeie o arquivo `.env.example` para `.env`.
      * Abra o arquivo `.env` e configure as variáveis, principalmente a `DATABASE_URL`:
        ```env
        # Configurações da Aplicação
        NODE_ENV=development
        PORT=3333

        # Conexão com o Banco de Dados
        DATABASE_URL="mysql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"

        # Segredos para JWT
        JWT_SECRET="bingo-tec-web-periodo-2025-2-comp-ufsj"
        JWT_EXPIRATION_TIME="1h"
        ```

4.  **Execute as migrações do banco de dados:**

      * O Prisma usará o `schema.prisma` para criar as tabelas no seu banco de dados.

    <!-- end list -->

    ```bash
    npx prisma migrate dev --name init
    ```

## ▶️ Executando a Aplicação

Para iniciar a aplicação, utilize um dos seguintes comandos:

```bash
# Modo de desenvolvimento com hot-reload
npm run start:dev

# Modo de produção
npm run start:prod
```

Após a inicialização, a API estará disponível em `http://localhost:3333`.

## Endpoints da API

Abaixo estão as principais rotas da API. Rotas marcadas com 🔒 requerem autenticação e as com 🛡️ requerem permissão de administrador.

### Autenticação (`/auth`)

  * `POST /auth/register`: Registra um novo usuário.
  * `POST /auth/login`: Realiza o login e retorna um token JWT.
  * `GET /auth/profile` 🔒: Retorna os dados do usuário logado.

### Usuários (`/users`)

  * `GET /users/me` 🔒: Retorna o perfil do usuário logado.
  * `PATCH /users/me` 🔒: Atualiza o perfil do usuário logado.
  * `POST /users/me/recharge` 🔒: Adiciona créditos à conta do usuário.
  * `GET /users` 🛡️: Lista todos os usuários.
  * `POST /users` 🛡️: Cria um novo usuário (admin).
  * `GET /users/:id` 🛡️: Busca um usuário por ID.
  * `DELETE /users/:id` 🛡️: Remove um usuário.

### Salas (`/rooms`)

  * `GET /rooms` 🔒: Lista todas as salas de bingo.
  * `GET /rooms/:id` 🔒: Busca uma sala por ID.
  * `POST /rooms` 🛡️: Cria uma nova sala.
  * `PATCH /rooms/:id` 🛡️: Atualiza uma sala.
  * `DELETE /rooms/:id` 🛡️: Remove uma sala.

### Jogos (`/games`)

  * `GET /games` 🔒: Lista todos os jogos.
  * `GET /games/:id` 🔒: Detalhes de um jogo específico.
  * `POST /games/:id/buy-cards` 🔒: Compra cartelas para um jogo.
  * `POST /games` 🛡️: Cria um novo jogo.
  * `PATCH /games/:id` 🛡️: Atualiza um jogo.
  * `DELETE /games/:id` 🛡️: Remove um jogo.

### Prêmios (`/prizes`)

  * `GET /prizes` 🛡️: Lista todos os prêmios.
  * *Endpoints de CRUD para prêmios, acessíveis apenas por administradores.*

## websocket Eventos

O servidor emite e escuta os seguintes eventos para a interação em tempo real:

### Eventos do Cliente para o Servidor

  * `joinGameRoom (gameId: number)`: Entra na sala de um jogo específico para receber atualizações.
  * `leaveGameRoom (gameId: number)`: Sai da sala de um jogo.

### Eventos do Servidor para o Cliente

  * `joinedGame (message: string)`: Confirmação de que o cliente entrou na sala.
  * `numberDrawn ({ number: number, order: number })`: Informa um novo número sorteado.
  * `gameWinner (winnerInfo: any)`: Anuncia o vencedor do jogo.
  * `gameEnded ({ message: string })`: Anuncia o fim de um jogo sem vencedores.

## 🗂️ Estrutura do Projeto

```
/
├── prisma/
│   └── schema.prisma       # Schema do banco de dados
├── src/
│   ├── auth/               # Autenticação e estratégias de segurança
│   ├── bingo-engine/       # Lógica do jogo, WebSocket e agendamento
│   ├── games/              # Módulo de gerenciamento de jogos
│   ├── prizes/             # Módulo de gerenciamento de prêmios
│   ├── rooms/              # Módulo de gerenciamento de salas
│   ├── shared/             # Módulos compartilhados (ex: Prisma)
│   ├── users/              # Módulo de gerenciamento de usuários
│   ├── app.module.ts       # Módulo principal da aplicação
│   └── main.ts             # Arquivo de inicialização
├── .env                    # Variáveis de ambiente
└── package.json
```
