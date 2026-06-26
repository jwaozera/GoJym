# GoJym

O **GoJym** é uma aplicação web **mobile-first** para gerenciamento de treinos de academia, desenvolvida como projeto acadêmico.

A plataforma permite criar treinos personalizados, executar sessões, registrar séries realizadas, acompanhar métricas de desempenho e visualizar a evolução do usuário por meio de análises e recordes pessoais.

O projeto possui um **frontend em React + TypeScript**, um **backend em Spring Boot** e utiliza **PostgreSQL** para persistência dos dados, com comunicação através de uma API REST.


## Links

- **Deploy:** https://go-jym.vercel.app
- **Protótipo (Figma):** https://www.figma.com/design/7mStvl2prXsiOmN24Ufw8Z/Wireframe-App-Academia---GoJym?m=auto&t=kPvUnQwN2BfPJYne-6
- **Documentação final:** [docs/GoJym_Documentacao_Final.pdf](docs/GoJym_Documentacao_Final.pdf)


## Funcionalidades

- Autenticação de usuários (login, cadastro e recuperação de senha)
- Gerenciamento de treinos personalizados
- Execução de sessões com registro de séries e timer de descanso
- Dashboard com resumo semanal, calendário e indicadores de desempenho
- Análises por período (4, 8 e 12 semanas)
- Evolução da carga por exercício
- Recordes pessoais de desempenho
- Gerenciamento do perfil do usuário


## Tecnologias

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT
- PostgreSQL
- Maven


## Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/jwaozera/GoJym.git
cd GoJym
```

### 2. Iniciar o banco de dados

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

### 4. Executar o frontend

Abra outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8080
```


## Estrutura do projeto

```text
GoJym/
├── frontend/
├── backend/
├── docs/
├── docker-compose.yml
└── README.md
```


## Equipe

- **João Lima** — Desenvolvedor Back-end
- **João Euclides** — Desenvolvedor Front-end
- **Artur Ferreira** — Desenvolvedor Full-stack