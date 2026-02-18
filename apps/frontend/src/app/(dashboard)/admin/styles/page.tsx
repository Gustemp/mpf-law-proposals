'use client'

import { useState, useEffect } from 'react'
import { Palette, Plus, Search, Loader2, AlertCircle, Trash2, Edit, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import stylesService, { Style } from '@/services/styles.service'

export default function AdminStylesPage() {
  const [search, setSearch] = useState('')
  const [styles, setStyles] = useState<Style[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingStyle, setEditingStyle] = useState<Style | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', tone: '', language: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadStyles() }, [])

  const loadStyles = async () => {
    try {
      setLoading(true)
      const data = await stylesService.getAll()
      setStyles(data)
      setError(null)
    } catch { setError('Erro ao carregar estilos') }
    finally { setLoading(false) }
  }

  const handleCreate = () => {
    setEditingStyle(null)
    setFormData({ name: '', description: '', tone: '', language: '' })
    setShowModal(true)
  }

  const handleEdit = (style: Style) => {
    setEditingStyle(style)
    const config = style.config as { tone?: string; language?: string }
    setFormData({ name: style.name, description: style.description || '', tone: config.tone || '', language: config.language || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) { alert('Preencha o nome'); return }
    setSaving(true)
    try {
      const payload = { name: formData.name, description: formData.description, config: { tone: formData.tone, language: formData.language } }
      if (editingStyle) {
        const updated = await stylesService.update(editingStyle.id, payload)
        setStyles(styles.map(s => s.id === updated.id ? updated : s))
      } else {
        const created = await stylesService.create(payload)
        setStyles([created, ...styles])
      }
      setShowModal(false)
    } catch { alert('Erro ao salvar estilo') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este estilo?')) return
    try { await stylesService.delete(id); setStyles(styles.filter(s => s.id !== id)) }
    catch { alert('Erro ao excluir') }
  }

  const filteredStyles = styles.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Estilos de Escrita</h1>
          <p className="text-muted-foreground">Configurações de tom e linguagem</p>
        </div>
        <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />Novo Estilo</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : error ? (
        <Card><CardContent className="p-12 text-center"><AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" /><p>{error}</p><Button onClick={loadStyles} className="mt-4">Tentar novamente</Button></CardContent></Card>
      ) : filteredStyles.length === 0 ? (
        <Card><CardContent className="p-12 text-center"><Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p>Nenhum estilo</p><Button onClick={handleCreate} className="mt-4"><Plus className="h-4 w-4 mr-2" />Criar</Button></CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStyles.map(style => (
            <Card key={style.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center"><Palette className="h-5 w-5 text-white" /></div>
                    <div>
                      <h3 className="font-medium">{style.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{style.description || 'Sem descrição'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${style.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {style.isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(style)}><Edit className="h-3 w-3 mr-1" />Editar</Button>
                  <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(style.id)}><Trash2 className="h-3 w-3" /></Button>
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
              <h2 className="text-lg font-semibold mb-4">{editingStyle ? 'Editar' : 'Novo'} Estilo</h2>
              <div className="space-y-4">
                <div><Label>Nome</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                <div><Label>Descrição</Label><Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                <div><Label>Tom</Label><Input value={formData.tone} onChange={e => setFormData({...formData, tone: e.target.value})} placeholder="Ex: Formal, Profissional, Técnico" /></div>
                <div><Label>Linguagem</Label><Input value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} placeholder="Ex: Concisa, Detalhada, Objetiva" /></div>
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
