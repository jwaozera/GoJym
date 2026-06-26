# GoJym

O **GoJym** é uma aplicação web **mobile-first** para gerenciamento de treinos de academia, desenvolvida como projeto acadêmico.

A plataforma permite criar treinos personalizados, executar sessões, registrar séries realizadas, acompanhar métricas de desempenho e visualizar a evolução do usuário por meio de análises e recordes pessoais.

O projeto possui um **frontend em React + TypeScript**, um **backend em Spring Boot** e utiliza **PostgreSQL** para persistência dos dados, com comunicação através de uma API REST.



## Links

- **Deploy:** https://go-jym.vercel.app
- **Protótipo no Figma:** https://www.figma.com/design/7mStvl2prXsiOmN24Ufw8Z/Wireframe-App-Academia---GoJym?m=auto&t=kPvUnQwN2BfPJYne-6
- **Documentação final:** [docs/GoJym_Documentação_Final.pdf](docs/GoJym_Documentação_Final.pdf)



## Funcionalidades

- Autenticação de usuários com login e cadastro
- Gerenciamento de treinos personalizados
- Criação, edição, listagem e detalhamento de treinos
- Execução de sessões com registro de séries
- Timer de descanso durante o treino
- Resumo de sessão concluída ou encerrada parcialmente
- Dashboard com resumo semanal, calendário e indicadores de desempenho
- Análise por período de 4, 8 e 12 semanas
- Evolução de carga por exercício
- Recordes pessoais por sessão e por exercício
- Gerenciamento de perfil e logout



## Tecnologias

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT
- Maven

### Banco de dados e infraestrutura

- PostgreSQL
- Docker Compose

### Deploy

- Vercel



## Como executar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/jwaozera/GoJym.git
cd GoJym
```

### 2. Iniciar o banco de dados

Na raiz do projeto:

```bash
docker compose up -d
```

### 3. Executar o backend

```bash
cd backend
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw spring-boot:run
```

O backend ficará disponível em:

```text
http://localhost:8080
```

### 4. Executar o frontend

Abra outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```



## Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
./mvnw clean package
```

---

## Estrutura do projeto

```text
GoJym/
├── frontend/
├── backend/
├── docs/
├── docker-compose.yml
└── README.md
```

### `frontend/`

Aplicação web mobile-first desenvolvida com React, TypeScript, Vite e Tailwind CSS.

### `backend/`

API REST desenvolvida com Spring Boot, responsável pelas regras de negócio, autenticação, persistência e integração com o banco de dados.

### `docs/`

Documentação do projeto, incluindo a documentação final da entrega.

---

## Estado do projeto

O GoJym está em sua versão final, com:

- frontend funcional
- backend implementado
- autenticação com JWT
- persistência em PostgreSQL
- integração entre frontend e backend
- modo mock preservado para desenvolvimento e demonstração
- análise de desempenho e recordes pessoais integrados

---

## Equipe

- **João Lima** — Desenvolvedor Back-end
- **João Euclides** — Desenvolvedor Front-end
- **Artur Ferreira** — Desenvolvedor Full-stack