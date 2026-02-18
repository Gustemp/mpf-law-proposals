'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, FileText, Calendar, Loader2, AlertCircle, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import briefingsService, { Briefing } from '@/services/briefings.service'

export default function BriefingsPage() {
  const [search, setSearch] = useState('')
  const [briefings, setBriefings] = useState<Briefing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingBriefing, setEditingBriefing] = useState<Briefing | null>(null)
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBriefings()
  }, [])

  const loadBriefings = async () => {
    try {
      setLoading(true)
      const data = await briefingsService.getAll()
      setBriefings(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar briefings')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBriefing(null)
    setFormData({ title: '', content: '' })
    setShowModal(true)
  }

  const handleEdit = (briefing: Briefing) => {
    setEditingBriefing(briefing)
    setFormData({ title: briefing.title, content: briefing.content })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Preencha todos os campos')
      return
    }
    setSaving(true)
    try {
      if (editingBriefing) {
        const updated = await briefingsService.update(editingBriefing.id, formData)
        setBriefings(briefings.map(b => b.id === updated.id ? updated : b))
      } else {
        const created = await briefingsService.create(formData)
        setBriefings([created, ...briefings])
      }
      setShowModal(false)
    } catch (err) {
      alert('Erro ao salvar briefing')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este briefing?')) return
    try {
      await briefingsService.delete(id)
      setBriefings(briefings.filter(b => b.id !== id))
    } catch (err) {
      alert('Erro ao excluir briefing')
    }
  }

  const filteredBriefings = briefings.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Briefings</h1>
          <p className="text-muted-foreground">Gerencie seus briefings de propostas</p>
        </div>
        <Button onClick={handleCreate}>
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="font-medium mb-2">{error}</h3>
            <Button onClick={loadBriefings}>Tentar novamente</Button>
          </CardContent>
        </Card>
      ) : filteredBriefings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhum briefing encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comece criando um novo briefing
            </p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Briefing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBriefings.map((briefing) => (
            <Card key={briefing.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{briefing.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {briefing.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(briefing.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(briefing)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(briefing.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingBriefing ? 'Editar Briefing' : 'Novo Briefing'}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título do briefing"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Conteúdo</Label>
                  <textarea
                    id="content"
                    className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Descreva o briefing..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
