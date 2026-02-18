'use client'

import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminTemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Templates</h1>
        <p className="text-muted-foreground">Gerencie os modelos de proposta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  )
}
