# MPF Proposals

Sistema de Propostas Comerciais Automáticas com IA para MPFLaw.

## Status: v0.7.0 ✅ Funcional

**Serviços:** Frontend (:3000) | Backend (:3001) | AI Agents (:3002)

**Credenciais:** `admin@mpflaw.com` / `Admin@123`

---

## Stack

- **Frontend:** Next.js 14, TailwindCSS, shadcn/ui, Zustand
- **Backend:** NestJS, Prisma, PostgreSQL, JWT
- **AI:** OpenAI/Anthropic (4 agentes em pipeline)

---

## Módulos Implementados

| Backend | Frontend |
|---------|----------|
| Auth (JWT + Refresh) | Login/Logout |
| Users CRUD | Admin Usuários |
| Proposals CRUD | Listagem + Wizard IA |
| Briefings CRUD | Listagem + Modal |
| Templates CRUD | Admin Templates |
| Styles CRUD | Admin Estilos |
| Layouts CRUD | Admin Layouts |

---

## Executar

```bash
# Backend
cd apps/backend && npm run dev

# Frontend  
cd apps/frontend && npm run dev

# AI Agents (opcional)
cd apps/ai-agents-service && npm run dev
```

---

## Docs

- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - **Estado atual do projeto** (atualizado frequentemente)
- [CHANGELOG.md](./CHANGELOG.md) - Histórico de versões
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detalhes técnicos

© MPFLaw 2026
