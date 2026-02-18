'use client'

import { Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminStylesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Estilos de Escrita</h1>
        <p className="text-muted-foreground">Gerencie os estilos de escrita do escritório</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Lista de Estilos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  )
}
