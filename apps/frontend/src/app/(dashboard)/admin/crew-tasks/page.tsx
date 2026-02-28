'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, ListTodo, Bot } from 'lucide-react';
import crewTasksService, { CrewTask } from '@/services/crew-tasks.service';
import crewAgentsService, { CrewAgent } from '@/services/crew-agents.service';

export default function CrewTasksPage() {
  const [tasks, setTasks] = useState<CrewTask[]>([]);
  const [agents, setAgents] = useState<CrewAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    expectedOutput: '',
    agentId: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, agentsData] = await Promise.all([
        crewTasksService.findAll(),
        crewAgentsService.findAll(),
      ]);
      setTasks(tasksData);
      setAgents(agentsData);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível carregar os dados', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', expectedOutput: '', agentId: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.expectedOutput) return;
    setSaving(true);
    try {
      const data = {
        ...form,
        agentId: form.agentId || undefined,
      };
      if (editingId) {
        const updated = await crewTasksService.update(editingId, data);
        setTasks(tasks.map((t) => (t.id === editingId ? updated : t)));
        toast({ title: 'Sucesso', description: 'Task atualizada' });
      } else {
        const created = await crewTasksService.create(data);
        setTasks([created, ...tasks]);
        toast({ title: 'Sucesso', description: 'Task criada' });
      }
      resetForm();
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível salvar a task', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task: CrewTask) => {
    setForm({
      name: task.name,
      description: task.description,
      expectedOutput: task.expectedOutput,
      agentId: task.agentId || '',
    });
    setEditingId(task.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta task?')) return;
    try {
      await crewTasksService.remove(id);
      setTasks(tasks.filter((t) => t.id !== id));
      toast({ title: 'Sucesso', description: 'Task excluída' });
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
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Gerencie as tarefas para os agentes executarem</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Task
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Task' : 'Nova Task'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Pesquisar casos" />
              </div>
              <div className="space-y-2">
                <Label>Agente Responsável</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.agentId}
                  onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                >
                  <option value="">Selecione um agente</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descreva o que a task deve fazer..."
              />
            </div>
            <div className="space-y-2">
              <Label>Output Esperado</Label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.expectedOutput}
                onChange={(e) => setForm({ ...form, expectedOutput: e.target.value })}
                placeholder="Descreva o resultado esperado..."
              />
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
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">{task.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(task.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              {task.agent && (
                <CardDescription className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  {task.agent.name}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium">Output:</span> {task.expectedOutput.slice(0, 50)}...
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ListTodo className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma task criada ainda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
