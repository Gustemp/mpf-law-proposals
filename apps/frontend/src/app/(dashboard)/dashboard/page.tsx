import { FileText, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const stats = [
  {
    title: 'Total de Propostas',
    value: '24',
    description: '+3 este mês',
    icon: FileText,
  },
  {
    title: 'Em Andamento',
    value: '8',
    description: '4 aguardando revisão',
    icon: Clock,
  },
  {
    title: 'Concluídas',
    value: '16',
    description: '67% de conclusão',
    icon: CheckCircle,
  },
  {
    title: 'Taxa de Conversão',
    value: '78%',
    description: '+5% vs mês anterior',
    icon: TrendingUp,
  },
]

const recentProposals = [
  {
    id: '1',
    title: 'Proposta Comercial - Empresa ABC',
    status: 'Em Revisão',
    date: '2024-02-12',
  },
  {
    id: '2',
    title: 'Contrato de Consultoria - XYZ Corp',
    status: 'Rascunho',
    date: '2024-02-11',
  },
  {
    id: '3',
    title: 'Proposta de Honorários - Cliente DEF',
    status: 'Concluída',
    date: '2024-02-10',
  },
  {
    id: '4',
    title: 'Acordo Comercial - GHI Ltda',
    status: 'Em Andamento',
    date: '2024-02-09',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral das suas propostas comerciais
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Nova Proposta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Proposals */}
      <Card>
        <CardHeader>
          <CardTitle>Propostas Recentes</CardTitle>
          <CardDescription>
            Suas últimas propostas criadas ou editadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="font-medium">{proposal.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(proposal.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    proposal.status === 'Concluída'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : proposal.status === 'Em Revisão'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : proposal.status === 'Rascunho'
                      ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
                >
                  {proposal.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
