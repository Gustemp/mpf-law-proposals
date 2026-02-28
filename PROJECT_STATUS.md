# MPF Proposals - Status do Projeto

**Última atualização:** 2026-02-28  
**Versão:** 0.9.0

---

## Deploy (Railway)

| Serviço | Status | URL |
|---------|--------|-----|
| Frontend | ✅ Online | `frontend-production-*.up.railway.app` |
| Backend | ✅ Online | `backend-production-bcaf.up.railway.app` |
| AI Agents | ✅ Online | `ai-agents-service-*.up.railway.app` |
| PostgreSQL | ✅ Online | Railway interno |

---

## Funcionalidades

### ✅ Funcionando (Produção)

- **Autenticação:** Login/logout com JWT
- **CRUD Usuários:** Admin pode gerenciar usuários
- **CRUD Templates:** Criar/editar/deletar templates
- **CRUD Styles:** Criar/editar/deletar estilos
- **CRUD Layouts:** Criar/editar/deletar layouts
- **CRUD Briefings:** Criar/editar/deletar briefings
- **CRUD Proposals:** Criar/editar/deletar propostas
- **Dashboard:** Página inicial com navegação
- **Sidebar:** Navegação entre módulos
- **Settings:** Configuração de API keys OpenAI/Anthropic (criptografadas)

### 🟡 Protótipo (Precisa refinamento)

- **Wizard de Proposta:** UI existe, integração com IA parcial
- **AI Agents Service:** Providers configurados, usuário pode fornecer API keys via Settings
- **Páginas Admin:** Funcionais mas sem paginação/filtros avançados
- **Dashboard:** Dados estáticos, precisa métricas reais

### 🔴 A Implementar

| Prioridade | Funcionalidade | Descrição |
|------------|----------------|-----------|
| **ALTA** | **Editor Visual CrewAI** | Interface drag-and-drop para criar fluxos de agentes |
| Alta | CRUD Agents/Tasks/Tools/Crews | Backend e frontend para gerenciar componentes |
| Alta | AI Executor Service (Python) | Serviço que executa fluxos CrewAI |
| Média | Geração de PDF | Exportar proposta final |
| Baixa | Notificações | Alertas de status |
| Baixa | Testes E2E | Cobertura de testes |

---

## Credenciais de Teste

- **Admin:** `admin@mpflaw.com` / `Admin@123`

---

## Variáveis de Ambiente (Railway)

### Backend
- `JWT_SECRET` ✅
- `DATABASE_URL` ✅ (referência ao Postgres)

### Frontend
- `NEXT_PUBLIC_API_URL` ✅

### AI Agents Service
- `OPENAI_API_KEY` ❌ (opcional, usuário fornece)
- `ANTHROPIC_API_KEY` ❌ (opcional, usuário fornece)

---

## Próximos Passos (Editor Visual CrewAI)

1. [ ] Schema Prisma para CrewAgent, CrewTask, CrewTool, Crew
2. [ ] Módulos NestJS com CRUD completo
3. [ ] Páginas Admin (agents, tasks, tools, crews)
4. [ ] Editor Visual com React Flow
5. [ ] AI Executor Service (Python + CrewAI)
6. [ ] Integração e testes

**Documentação:**
- `docs/CREWAI_REFERENCE.md` - Referência interna do CrewAI
- `docs/VISUAL_EDITOR_ARCHITECTURE.md` - Arquitetura do editor visual

---

## Histórico de Status

| Data | Versão | Mudanças |
|------|--------|----------|
| 2026-02-28 | 0.9.0 | Documentação CrewAI e arquitetura do editor visual, nova direção do projeto |
| 2026-02-27 | 0.8.1 | Fix CORS para produção Railway |
| 2026-02-21 | 0.8.0 | Tela de Settings para API keys, criptografia AES-256-GCM, componentes toast/select |
| 2026-02-19 | 0.7.0 | Deploy Railway completo, PostgreSQL configurado, admin criado |
| 2026-02-18 | 0.6.0 | Módulos Styles/Layouts, páginas admin CRUD |
| 2026-02-17 | 0.5.0 | AI Agents Service desacoplado |
| 2026-02-17 | 0.4.0 | Integração frontend/backend |
