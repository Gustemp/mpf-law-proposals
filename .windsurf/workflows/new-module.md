---
description: Criar novo módulo NestJS seguindo a arquitetura do projeto
---

# Workflow: Criar Novo Módulo NestJS

## Pré-requisitos
1. Ler o README.md para entender a arquitetura
2. Verificar se o módulo já não existe com `find_by_name`

## Passos

### 1. Verificar se o módulo já existe
// turbo
```bash
find apps/backend/src/modules -name "*<nome-modulo>*" -type d
```

### 2. Criar estrutura do módulo
Criar os seguintes arquivos em `apps/backend/src/modules/<nome-modulo>/`:

```
<nome-modulo>/
├── <nome-modulo>.module.ts
├── <nome-modulo>.controller.ts
├── <nome-modulo>.service.ts
├── dto/
│   ├── create-<nome-modulo>.dto.ts
│   └── update-<nome-modulo>.dto.ts
└── entities/
    └── <nome-modulo>.entity.ts
```

### 3. Estrutura do Module
```typescript
// <nome-modulo>.module.ts
import { Module } from '@nestjs/common';
import { <NomeModulo>Controller } from './<nome-modulo>.controller';
import { <NomeModulo>Service } from './<nome-modulo>.service';

@Module({
  controllers: [<NomeModulo>Controller],
  providers: [<NomeModulo>Service],
  exports: [<NomeModulo>Service],
})
export class <NomeModulo>Module {}
```

### 4. Estrutura do Controller
```typescript
// <nome-modulo>.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { <NomeModulo>Service } from './<nome-modulo>.service';
import { Create<NomeModulo>Dto } from './dto/create-<nome-modulo>.dto';
import { Update<NomeModulo>Dto } from './dto/update-<nome-modulo>.dto';

@Controller('<nome-modulo>')
export class <NomeModulo>Controller {
  constructor(private readonly <nomeModulo>Service: <NomeModulo>Service) {}

  @Post()
  create(@Body() createDto: Create<NomeModulo>Dto) {
    return this.<nomeModulo>Service.create(createDto);
  }

  @Get()
  findAll() {
    return this.<nomeModulo>Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.<nomeModulo>Service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Update<NomeModulo>Dto) {
    return this.<nomeModulo>Service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.<nomeModulo>Service.remove(id);
  }
}
```

### 5. Estrutura do Service
```typescript
// <nome-modulo>.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Create<NomeModulo>Dto } from './dto/create-<nome-modulo>.dto';
import { Update<NomeModulo>Dto } from './dto/update-<nome-modulo>.dto';

@Injectable()
export class <NomeModulo>Service {
  constructor(private prisma: PrismaService) {}

  async create(createDto: Create<NomeModulo>Dto) {
    // TODO: Implementar
  }

  async findAll() {
    // TODO: Implementar
  }

  async findOne(id: string) {
    // TODO: Implementar
  }

  async update(id: string, updateDto: Update<NomeModulo>Dto) {
    // TODO: Implementar
  }

  async remove(id: string) {
    // TODO: Implementar
  }
}
```

### 6. Registrar no AppModule
Adicionar o módulo em `apps/backend/src/app.module.ts`:

```typescript
import { <NomeModulo>Module } from './modules/<nome-modulo>/<nome-modulo>.module';

@Module({
  imports: [
    // ... outros módulos
    <NomeModulo>Module,
  ],
})
export class AppModule {}
```

### 7. Atualizar CHANGELOG.md
Adicionar entrada no CHANGELOG.md:
```
- **FEAT** - Criação do módulo <nome-modulo> - `apps/backend/src/modules/<nome-modulo>/`
```

## Convenções
- Nomes de arquivos: kebab-case
- Nomes de classes: PascalCase
- Nomes de variáveis: camelCase
