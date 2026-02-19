# MPF Proposals - Status do Projeto

**Última atualização:** 2026-02-19  
**Versão:** 0.7.0

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

### 🟡 Protótipo (Precisa refinamento)

- **Wizard de Proposta:** UI existe, integração com IA parcial
- **AI Agents Service:** Providers configurados mas sem API keys
- **Páginas Admin:** Funcionais mas sem paginação/filtros avançados
- **Dashboard:** Dados estáticos, precisa métricas reais

### 🔴 A Implementar

| Prioridade | Funcionalidade | Descrição |
|------------|----------------|-----------|
| Alta | Tela de Settings | Usuário configura API key OpenAI/Anthropic |
| Alta | Geração de PDF | Exportar proposta final |
| Alta | Pipeline IA completo | briefing → draft → style → layout |
| Média | Editor de Proposta | Editar conteúdo gerado |
| Média | Histórico/Versões | Versionar propostas |
| Baixa | Notificações | Alertas de status |
| Baixa | Testes E2E | Cobertura de testes |
| Baixa | Mobile | Responsividade |

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

## Próximos Passos

1. [ ] Implementar tela de Settings para API keys
2. [ ] Testar pipeline completo de geração com IA
3. [ ] Adicionar geração de PDF
4. [ ] Melhorar UI das páginas admin (paginação, filtros)
5. [ ] Adicionar métricas reais no dashboard

---

## Histórico de Status

| Data | Versão | Mudanças |
|------|--------|----------|
| 2026-02-19 | 0.7.0 | Deploy Railway completo, PostgreSQL configurado, admin criado |
| 2026-02-18 | 0.6.0 | Módulos Styles/Layouts, páginas admin CRUD |
| 2026-02-17 | 0.5.0 | AI Agents Service desacoplado |
| 2026-02-17 | 0.4.0 | Integração frontend/backend |
