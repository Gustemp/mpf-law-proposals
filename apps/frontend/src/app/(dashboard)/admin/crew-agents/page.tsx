'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Bot, Wrench } from 'lucide-react';
import crewAgentsService, { CrewAgent } from '@/services/crew-agents.service';

export default function CrewAgentsPage() {
  const [agents, setAgents] = useState<CrewAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    role: '',
    goal: '',
    backstory: '',
    llmProvider: 'openai',
    llmModel: 'gpt-4-turbo-preview',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await crewAgentsService.findAll();
      setAgents(data);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível carregar os agentes', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', role: '', goal: '', backstory: '', llmProvider: 'openai', llmModel: 'gpt-4-turbo-preview' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.role || !form.goal || !form.backstory) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await crewAgentsService.update(editingId, form);
        setAgents(agents.map((a) => (a.id === editingId ? updated : a)));
        toast({ title: 'Sucesso', description: 'Agente atualizado' });
      } else {
        const created = await crewAgentsService.create(form);
        setAgents([created, ...agents]);
        toast({ title: 'Sucesso', description: 'Agente criado' });
      }
      resetForm();
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível salvar o agente', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (agent: CrewAgent) => {
    setForm({
      name: agent.name,
      role: agent.role,
      goal: agent.goal,
      backstory: agent.backstory,
      llmProvider: agent.llmProvider,
      llmModel: agent.llmModel,
    });
    setEditingId(agent.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este agente?')) return;
    try {
      await crewAgentsService.remove(id);
      setAgents(agents.filter((a) => a.id !== id));
      toast({ title: 'Sucesso', description: 'Agente excluído' });
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
          <h1 className="text-3xl font-bold">Agentes</h1>
          <p className="text-muted-foreground">Gerencie os agentes de IA para seus crews</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Agente
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Agente' : 'Novo Agente'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Pesquisador" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Ex: Pesquisador Jurídico" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Goal</Label>
              <Input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="Objetivo principal do agente" />
            </div>
            <div className="space-y-2">
              <Label>Backstory</Label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.backstory}
                onChange={(e) => setForm({ ...form, backstory: e.target.value })}
                placeholder="História e contexto do agente..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Input value={form.llmProvider} onChange={(e) => setForm({ ...form, llmProvider: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input value={form.llmModel} onChange={(e) => setForm({ ...form, llmModel: e.target.value })} />
              </div>
            </div>
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
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(agent)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(agent.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <CardDescription>{agent.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{agent.goal}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-secondary px-2 py-1 rounded">{agent.llmModel}</span>
                {agent.tools && agent.tools.length > 0 && (
                  <span className="flex items-center gap-1"><Wrench className="h-3 w-3" />{agent.tools.length} tools</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {agents.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum agente criado ainda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
