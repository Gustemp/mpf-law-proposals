'use client'

import { useState } from 'react'
import { Plus, Search, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusConfig = {
  DRAFT: { label: 'Rascunho', color: 'bg-gray-500', icon: FileText },
  BRIEFING: { label: 'Briefing', color: 'bg-blue-500', icon: Clock },
  REVIEW: { label: 'Revisão', color: 'bg-yellow-500', icon: AlertCircle },
  STYLING: { label: 'Estilização', color: 'bg-purple-500', icon: Clock },
  LAYOUT: { label: 'Diagramação', color: 'bg-orange-500', icon: Clock },
  COMPLETED: { label: 'Concluída', color: 'bg-green-500', icon: CheckCircle },
}

const mockProposals = [
  { id: '1', title: 'Proposta Empresa ABC', status: 'COMPLETED', createdAt: '2026-02-15', client: 'Empresa ABC Ltda' },
  { id: '2', title: 'Consultoria Jurídica XYZ', status: 'REVIEW', createdAt: '2026-02-14', client: 'XYZ Consultoria' },
  { id: '3', title: 'Assessoria Tributária', status: 'STYLING', createdAt: '2026-02-13', client: 'Grupo Delta' },
  { id: '4', title: 'Due Diligence M&A', status: 'BRIEFING', createdAt: '2026-02-12', client: 'Fundo Investimentos' },
  { id: '5', title: 'Contrato Societário', status: 'DRAFT', createdAt: '2026-02-11', client: 'Startup Tech' },
]

export default function ProposalsPage() {
  const [search, setSearch] = useState('')

  const filteredProposals = mockProposals.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Propostas</h1>
          <p className="text-muted-foreground">Gerencie suas propostas comerciais</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Proposta
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar propostas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProposals.map((proposal) => {
          const status = statusConfig[proposal.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

          return (
            <Card key={proposal.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg ${status.color} flex items-center justify-center`}>
                      <StatusIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{proposal.title}</h3>
                      <p className="text-sm text-muted-foreground">{proposal.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-sm text-muted-foreground">{proposal.createdAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProposals.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhuma proposta encontrada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comece criando uma nova proposta
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Proposta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
