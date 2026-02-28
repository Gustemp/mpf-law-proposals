'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Play, Edit, Trash2, Users, ListTodo } from 'lucide-react';
import crewsService, { Crew } from '@/services/crews.service';
import Link from 'next/link';

export default function CrewsPage() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newCrewName, setNewCrewName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadCrews();
  }, []);

  const loadCrews = async () => {
    try {
      const data = await crewsService.findAll();
      setCrews(data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os crews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCrewName.trim()) return;
    setCreating(true);
    try {
      const crew = await crewsService.create({ name: newCrewName });
      setCrews([crew, ...crews]);
      setNewCrewName('');
      toast({ title: 'Sucesso', description: 'Crew criado com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o crew',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este crew?')) return;
    try {
      await crewsService.remove(id);
      setCrews(crews.filter((c) => c.id !== id));
      toast({ title: 'Sucesso', description: 'Crew excluído' });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o crew',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Crews</h1>
          <p className="text-muted-foreground">
            Gerencie seus fluxos de agentes de IA
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Crew</CardTitle>
          <CardDescription>Crie um novo fluxo de agentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nome do crew..."
              value={newCrewName}
              onChange={(e) => setNewCrewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button onClick={handleCreate} disabled={creating || !newCrewName.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Criar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {crews.map((crew) => (
          <Card key={crew.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{crew.name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/crews/${crew.id}/editor`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(crew.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {crew.description && (
                <CardDescription>{crew.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{crew.agents?.length || 0} agents</span>
                </div>
                <div className="flex items-center gap-1">
                  <ListTodo className="h-4 w-4" />
                  <span>{crew.tasks?.length || 0} tasks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  <span>{crew._count?.executions || 0} runs</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/crews/${crew.id}/editor`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Fluxo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {crews.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum crew criado ainda</p>
            <p className="text-sm text-muted-foreground">
              Crie seu primeiro fluxo de agentes acima
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
