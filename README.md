# GoJym

Aplicação web mobile-first para controle de treinos de academia.

O GoJym permite criar treinos, executar sessões, registrar séries, acompanhar métricas semanais e visualizar evolução por período. Nesta etapa, o projeto está focado no front-end, com dados mockados/localizados e estrutura preparada para futura integração com back-end e banco de dados.

## Links

- Deploy: https://go-jym.vercel.app
- Figma: https://www.figma.com/design/7mStvl2prXsiOmN24Ufw8Z/Wireframe-App-Academia---GoJym?m=auto&t=kPvUnQwN2BfPJYne-6
- Documentação AB1: [docs/GoJym_Documentacao_AB1.pdf](docs/GoJym_Documentacao_AB1.pdf)

## Funcionalidades principais

- Autenticação com login, cadastro e recuperação de senha
- Home com resumo semanal, calendário, streak e gráfico de séries por dia
- Criação, edição, listagem e detalhe de treinos
- Execução de sessão com registro de séries e timer de descanso
- Resumo de sessão concluída ou encerrada parcialmente
- Análise por período, exercício, ritmo e destaques
- Perfil com edição de dados, recordes pessoais e logout

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router
- Vercel

## Como rodar localmente

Clone o repositório:

```bash
git clone https://github.com/jwaozera/GoJym.git
```

Entre na pasta:

```bash
cd GoJym
```

Instale as dependências:

```bash
npm install
```

Rode o projeto:

```bash
npm run dev
```

No Windows, se houver bloqueio do PowerShell:

```bash
npm.cmd run dev
```

## Build

```bash
npm run build
```

No Windows:

```bash
npm.cmd run build
```

## Status do projeto

O front-end está funcional e publicado na Vercel.

Atualmente, os dados são mockados/localizados. A integração real com back-end, banco de dados e persistência definitiva está prevista para a próxima etapa do projeto.

## Equipe

- João Lima — Desenvolvedor Back-end
- João Euclides — Desenvolvedor Front-end
- Artur Ferreira — Desenvolvedor Full-stack