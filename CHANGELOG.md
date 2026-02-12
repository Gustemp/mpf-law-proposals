# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### Adicionado
- Estrutura inicial do projeto definida

---

## [0.1.0] - 2026-02-12

### Adicionado
- **DOCS** - Criação do README.md com arquitetura completa do sistema
  - Stack tecnológico (NestJS, Next.js 14, PostgreSQL, Prisma, Redis)
  - Estrutura de diretórios do monorepo
  - Arquitetura desacoplada dos agentes de IA (ai-agents-service)
  - Pipeline de processamento dos 4 agentes (Briefing, Draft, Style, Layout)
  - Contratos da API de Agentes (IAgentRequest, IAgentResponse)
  - Modelo de dados Prisma (User, Briefing, Proposal, Template, Style, Layout)
  - Endpoints da API principal e do AI Agents Service
  - Páginas do frontend (auth, dashboard, admin)
  - Configurações de ambiente
  - Arquivos: `README.md`

- **CHORE** - Criação do .windsurfrules para proteção de contexto e código
  - Regras de edição mínima e cirúrgica
  - Proteção contra alucinações de IA
  - Arquitetura obrigatória do projeto
  - Convenções de nomenclatura
  - Regras de criação de novos arquivos
  - Proibições críticas
  - Arquivos: `.windsurfrules`

- **DOCS** - Criação do CHANGELOG.md para versionamento
  - Formato Keep a Changelog
  - Versionamento Semântico
  - Arquivos: `CHANGELOG.md`

---

## Formato de Registro

```
[DATA] - [TIPO] - [DESCRIÇÃO] - [ARQUIVOS AFETADOS]
```

### Tipos de Alteração

- **FEAT** - Nova funcionalidade
- **FIX** - Correção de bug
- **REFACTOR** - Refatoração de código (sem mudança de funcionalidade)
- **DOCS** - Alterações em documentação
- **STYLE** - Formatação, ponto e vírgula, etc (sem mudança de código)
- **TEST** - Adição ou correção de testes
- **CHORE** - Tarefas de manutenção (build, configs, etc)
- **PERF** - Melhorias de performance
- **SECURITY** - Correções de segurança

---

## Links

- [Repositório](https://github.com/mpflaw/mpf-proposals)
- [Issues](https://github.com/mpflaw/mpf-proposals/issues)
