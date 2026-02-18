'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, FileText, Clock, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import proposalsService, { Proposal } from '@/services/proposals.service'

const statusConfig = {
  DRAFT: { label: 'Rascunho', color: 'bg-gray-500', icon: FileText },
  BRIEFING: { label: 'Briefing', color: 'bg-blue-500', icon: Clock },
  REVIEW: { label: 'Revisão', color: 'bg-yellow-500', icon: AlertCircle },
  STYLING: { label: 'Estilização', color: 'bg-purple-500', icon: Clock },
  LAYOUT: { label: 'Diagramação', color: 'bg-orange-500', icon: Clock },
  COMPLETED: { label: 'Concluída', color: 'bg-green-500', icon: CheckCircle },
}

export default function ProposalsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProposals()
  }, [])

  const loadProposals = async () => {
    try {
      setLoading(true)
      const data = await proposalsService.getAll()
      setProposals(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar propostas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta proposta?')) return
    try {
      await proposalsService.delete(id)
      setProposals(proposals.filter(p => p.id !== id))
    } catch (err) {
      alert('Erro ao excluir proposta')
    }
  }

  const filteredProposals = proposals.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Propostas</h1>
          <p className="text-muted-foreground">Gerencie suas propostas comerciais</p>
        </div>
        <Button onClick={() => router.push('/proposals/new')}>
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="font-medium mb-2">{error}</h3>
            <Button onClick={loadProposals}>Tentar novamente</Button>
          </CardContent>
        </Card>
      ) : filteredProposals.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhuma proposta encontrada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comece criando uma nova proposta
            </p>
            <Button onClick={() => router.push('/proposals/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Proposta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProposals.map((proposal) => {
            const status = statusConfig[proposal.status as keyof typeof statusConfig] || statusConfig.DRAFT
            const StatusIcon = status.icon

            return (
              <Card key={proposal.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/proposals/${proposal.id}`)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg ${status.color} flex items-center justify-center`}>
                        <StatusIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Criado em {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                        {status.label}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(proposal.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
