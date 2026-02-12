---
description: Criar novo componente React seguindo a arquitetura do projeto
---

# Workflow: Criar Novo Componente React

## Pré-requisitos
1. Ler o README.md para entender a arquitetura
2. Verificar se o componente já não existe

## Passos

### 1. Verificar se o componente já existe
// turbo
```bash
find apps/frontend/src/components -name "*<nome-componente>*" -type f
```

### 2. Determinar localização correta

| Tipo de Componente | Localização |
|-------------------|-------------|
| UI genérico (shadcn) | `apps/frontend/src/components/ui/` |
| Formulários | `apps/frontend/src/components/forms/` |
| Editores | `apps/frontend/src/components/editors/` |
| Layouts | `apps/frontend/src/components/layouts/` |
| Feature-specific | `apps/frontend/src/components/<feature>/` |

### 3. Estrutura do Componente

```typescript
// <nome-componente>.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface <NomeComponente>Props {
  className?: string;
  // adicionar props específicas
}

export function <NomeComponente>({ className, ...props }: <NomeComponente>Props) {
  return (
    <div className={cn('', className)} {...props}>
      {/* Conteúdo do componente */}
    </div>
  );
}
```

### 4. Se necessário, criar barrel export
Se o componente estiver em uma pasta de feature, criar/atualizar `index.ts`:

```typescript
// index.ts
export { <NomeComponente> } from './<nome-componente>';
```

### 5. Atualizar CHANGELOG.md
```
- **FEAT** - Criação do componente <NomeComponente> - `apps/frontend/src/components/<path>/<nome-componente>.tsx`
```

## Convenções
- Nomes de arquivos: kebab-case (ex: `proposal-card.tsx`)
- Nomes de componentes: PascalCase (ex: `ProposalCard`)
- Usar `'use client'` apenas se necessário (hooks, eventos)
- Sempre aceitar `className` como prop para composição
- Usar `cn()` do lib/utils para merge de classes
