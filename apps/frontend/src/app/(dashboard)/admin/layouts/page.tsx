'use client'

import { useState, useEffect } from 'react'
import { Layout, Plus, Search, Loader2, AlertCircle, Trash2, Edit, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import layoutsService, { Layout as LayoutType } from '@/services/layouts.service'

export default function AdminLayoutsPage() {
  const [search, setSearch] = useState('')
  const [layouts, setLayouts] = useState<LayoutType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingLayout, setEditingLayout] = useState<LayoutType | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', fontFamily: '', fontSize: '', margins: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadLayouts() }, [])

  const loadLayouts = async () => {
    try {
      setLoading(true)
      const data = await layoutsService.getAll()
      setLayouts(data)
      setError(null)
    } catch { setError('Erro ao carregar layouts') }
    finally { setLoading(false) }
  }

  const handleCreate = () => {
    setEditingLayout(null)
    setFormData({ name: '', description: '', fontFamily: '', fontSize: '', margins: '' })
    setShowModal(true)
  }

  const handleEdit = (layout: LayoutType) => {
    setEditingLayout(layout)
    const config = layout.config as { fontFamily?: string; fontSize?: string; margins?: string }
    setFormData({ name: layout.name, description: layout.description || '', fontFamily: config.fontFamily || '', fontSize: config.fontSize || '', margins: config.margins || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) { alert('Preencha o nome'); return }
    setSaving(true)
    try {
      const payload = { name: formData.name, description: formData.description, config: { fontFamily: formData.fontFamily, fontSize: formData.fontSize, margins: formData.margins } }
      if (editingLayout) {
        const updated = await layoutsService.update(editingLayout.id, payload)
        setLayouts(layouts.map(l => l.id === updated.id ? updated : l))
      } else {
        const created = await layoutsService.create(payload)
        setLayouts([created, ...layouts])
      }
      setShowModal(false)
    } catch { alert('Erro ao salvar layout') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este layout?')) return
    try { await layoutsService.delete(id); setLayouts(layouts.filter(l => l.id !== id)) }
    catch { alert('Erro ao excluir') }
  }

  const filteredLayouts = layouts.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Layouts</h1>
          <p className="text-muted-foreground">Regras de diagramação</p>
        </div>
        <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />Novo Layout</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : error ? (
        <Card><CardContent className="p-12 text-center"><AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" /><p>{error}</p><Button onClick={loadLayouts} className="mt-4">Tentar novamente</Button></CardContent></Card>
      ) : filteredLayouts.length === 0 ? (
        <Card><CardContent className="p-12 text-center"><Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p>Nenhum layout</p><Button onClick={handleCreate} className="mt-4"><Plus className="h-4 w-4 mr-2" />Criar</Button></CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLayouts.map(layout => (
            <Card key={layout.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center"><Layout className="h-5 w-5 text-white" /></div>
                    <div>
                      <h3 className="font-medium">{layout.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{layout.description || 'Sem descrição'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${layout.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {layout.isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(layout)}><Edit className="h-3 w-3 mr-1" />Editar</Button>
                  <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(layout.id)}><Trash2 className="h-3 w-3" /></Button>
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
              <h2 className="text-lg font-semibold mb-4">{editingLayout ? 'Editar' : 'Novo'} Layout</h2>
              <div className="space-y-4">
                <div><Label>Nome</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                <div><Label>Descrição</Label><Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                <div><Label>Fonte</Label><Input value={formData.fontFamily} onChange={e => setFormData({...formData, fontFamily: e.target.value})} placeholder="Ex: Arial, Times New Roman" /></div>
                <div><Label>Tamanho da Fonte</Label><Input value={formData.fontSize} onChange={e => setFormData({...formData, fontSize: e.target.value})} placeholder="Ex: 12pt, 14px" /></div>
                <div><Label>Margens</Label><Input value={formData.margins} onChange={e => setFormData({...formData, margins: e.target.value})} placeholder="Ex: 2cm, 1in" /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button className="flex-1" onClick={handleSave} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Salvar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
