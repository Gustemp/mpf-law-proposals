'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Wrench, Code } from 'lucide-react';
import crewToolsService, { CrewTool } from '@/services/crew-tools.service';

export default function CrewToolsPage() {
  const [tools, setTools] = useState<CrewTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    displayName: '',
    description: '',
    type: 'custom',
    code: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const data = await crewToolsService.findAll();
      setTools(data);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível carregar as tools', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', displayName: '', description: '', type: 'custom', code: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.displayName || !form.description) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await crewToolsService.update(editingId, form);
        setTools(tools.map((t) => (t.id === editingId ? updated : t)));
        toast({ title: 'Sucesso', description: 'Tool atualizada' });
      } else {
        const created = await crewToolsService.create(form);
        setTools([created, ...tools]);
        toast({ title: 'Sucesso', description: 'Tool criada' });
      }
      resetForm();
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível salvar a tool', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tool: CrewTool) => {
    setForm({
      name: tool.name,
      displayName: tool.displayName,
      description: tool.description,
      type: tool.type,
      code: tool.code || '',
    });
    setEditingId(tool.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta tool?')) return;
    try {
      await crewToolsService.remove(id);
      setTools(tools.filter((t) => t.id !== id));
      toast({ title: 'Sucesso', description: 'Tool excluída' });
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível excluir', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tools</h1>
          <p className="text-muted-foreground">Gerencie as ferramentas disponíveis para os agentes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tool
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Tool' : 'Nova Tool'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome (identificador)</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="search_database" />
              </div>
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Search Database" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="O que esta tool faz..." />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="custom">Custom</option>
                <option value="builtin">Builtin</option>
              </select>
            </div>
            {form.type === 'custom' && (
              <div className="space-y-2">
                <Label>Código Python</Label>
                <textarea
                  className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="def search_database(query: str) -> str:&#10;    # Implementação&#10;    return results"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-lg">{tool.displayName}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(tool)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(tool.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <CardDescription className="font-mono text-xs">{tool.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`px-2 py-1 rounded ${tool.type === 'builtin' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {tool.type}
                </span>
                {tool.code && <Code className="h-3 w-3 text-muted-foreground" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tools.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma tool criada ainda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
