'use client'

import { useState, useEffect } from 'react'
import { FileText, Plus, Search, Loader2, AlertCircle, Trash2, Edit, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import templatesService, { Template } from '@/services/templates.service'

export default function AdminTemplatesPage() {
  const [search, setSearch] = useState('')
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', content: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadTemplates() }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const data = await templatesService.getAll()
      setTemplates(data)
      setError(null)
    } catch { setError('Erro ao carregar templates') }
    finally { setLoading(false) }
  }

  const handleCreate = () => {
    setEditingTemplate(null)
    setFormData({ name: '', description: '', content: '' })
    setShowModal(true)
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setFormData({ name: template.name, description: template.description || '', content: template.content })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.content.trim()) { alert('Preencha nome e conteúdo'); return }
    setSaving(true)
    try {
      if (editingTemplate) {
        const updated = await templatesService.update(editingTemplate.id, formData)
        setTemplates(templates.map(t => t.id === updated.id ? updated : t))
      } else {
        const created = await templatesService.create(formData)
        setTemplates([created, ...templates])
      }
      setShowModal(false)
    } catch { alert('Erro ao salvar template') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este template?')) return
    try { await templatesService.delete(id); setTemplates(templates.filter(t => t.id !== id)) }
    catch { alert('Erro ao excluir') }
  }

  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Templates</h1>
          <p className="text-muted-foreground">Modelos de proposta</p>
        </div>
        <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />Novo Template</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : error ? (
        <Card><CardContent className="p-12 text-center"><AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" /><p>{error}</p><Button onClick={loadTemplates} className="mt-4">Tentar novamente</Button></CardContent></Card>
      ) : filteredTemplates.length === 0 ? (
        <Card><CardContent className="p-12 text-center"><FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p>Nenhum template</p><Button onClick={handleCreate} className="mt-4"><Plus className="h-4 w-4 mr-2" />Criar</Button></CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map(template => (
            <Card key={template.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center"><FileText className="h-5 w-5 text-white" /></div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{template.description || 'Sem descrição'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {template.isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(template)}><Edit className="h-3 w-3 mr-1" />Editar</Button>
                  <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(template.id)}><Trash2 className="h-3 w-3" /></Button>
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
              <h2 className="text-lg font-semibold mb-4">{editingTemplate ? 'Editar' : 'Novo'} Template</h2>
              <div className="space-y-4">
                <div><Label>Nome</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                <div><Label>Descrição</Label><Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                <div><Label>Conteúdo</Label><textarea className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background text-sm" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} /></div>
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
