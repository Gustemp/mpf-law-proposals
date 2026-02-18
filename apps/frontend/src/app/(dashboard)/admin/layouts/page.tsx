'use client'

import { Layout } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLayoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Layouts</h1>
        <p className="text-muted-foreground">Gerencie as regras de diagramação</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Lista de Layouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  )
}
