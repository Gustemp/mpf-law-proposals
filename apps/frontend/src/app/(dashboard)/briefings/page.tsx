'use client'

import { useState } from 'react'
import { Plus, Search, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const mockBriefings = [
  { id: '1', title: 'Briefing Empresa ABC', content: 'Análise de contrato societário...', createdAt: '2026-02-15' },
  { id: '2', title: 'Briefing XYZ Consultoria', content: 'Consultoria tributária para...', createdAt: '2026-02-14' },
  { id: '3', title: 'Briefing Grupo Delta', content: 'Assessoria em fusões e aquisições...', createdAt: '2026-02-13' },
  { id: '4', title: 'Briefing Fundo Investimentos', content: 'Due diligence completa...', createdAt: '2026-02-12' },
]

export default function BriefingsPage() {
  const [search, setSearch] = useState('')

  const filteredBriefings = mockBriefings.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Briefings</h1>
          <p className="text-muted-foreground">Gerencie seus briefings de propostas</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Briefing
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar briefings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBriefings.map((briefing) => (
          <Card key={briefing.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{briefing.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {briefing.content}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {briefing.createdAt}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBriefings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhum briefing encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comece criando um novo briefing
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Briefing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
