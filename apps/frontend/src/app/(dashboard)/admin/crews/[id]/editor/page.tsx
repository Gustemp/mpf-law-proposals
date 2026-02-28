'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ArrowLeft, Bot, ListTodo, Wrench, Play } from 'lucide-react';
import crewsService, { Crew } from '@/services/crews.service';
import crewAgentsService, { CrewAgent } from '@/services/crew-agents.service';
import crewTasksService, { CrewTask } from '@/services/crew-tasks.service';
import crewToolsService, { CrewTool } from '@/services/crew-tools.service';
import Link from 'next/link';

const nodeTypes = {};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#6366f1' },
};

export default function CrewEditorPage() {
  const params = useParams();
  const router = useRouter();
  const crewId = params.id as string;
  const { toast } = useToast();

  const [crew, setCrew] = useState<Crew | null>(null);
  const [agents, setAgents] = useState<CrewAgent[]>([]);
  const [tasks, setTasks] = useState<CrewTask[]>([]);
  const [tools, setTools] = useState<CrewTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    loadData();
  }, [crewId]);

  const loadData = async () => {
    try {
      const [crewData, agentsData, tasksData, toolsData] = await Promise.all([
        crewsService.findOne(crewId),
        crewAgentsService.findAll(),
        crewTasksService.findAll(),
        crewToolsService.findAll(),
      ]);

      setCrew(crewData);
      setAgents(agentsData);
      setTasks(tasksData);
      setTools(toolsData);

      if (crewData.flowData) {
        const flowData = crewData.flowData as { nodes: Node[]; edges: Edge[] };
        setNodes(flowData.nodes || []);
        setEdges(flowData.edges || []);
      }
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível carregar os dados', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await crewsService.updateFlow(crewId, { nodes, edges });
      toast({ title: 'Sucesso', description: 'Fluxo salvo com sucesso' });
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível salvar o fluxo', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addAgentNode = (agent: CrewAgent) => {
    const newNode: Node = {
      id: `agent-${agent.id}-${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: (
          <div className="flex items-center gap-2 p-2">
            <Bot className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-medium">{agent.name}</div>
              <div className="text-xs text-gray-500">{agent.role}</div>
            </div>
          </div>
        ),
        agentId: agent.id,
        type: 'agent',
      },
      style: {
        background: '#dbeafe',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '4px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addTaskNode = (task: CrewTask) => {
    const newNode: Node = {
      id: `task-${task.id}-${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: (
          <div className="flex items-center gap-2 p-2">
            <ListTodo className="h-4 w-4 text-green-500" />
            <div>
              <div className="font-medium">{task.name}</div>
              <div className="text-xs text-gray-500 max-w-[150px] truncate">{task.description}</div>
            </div>
          </div>
        ),
        taskId: task.id,
        type: 'task',
      },
      style: {
        background: '#dcfce7',
        border: '2px solid #22c55e',
        borderRadius: '8px',
        padding: '4px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addToolNode = (tool: CrewTool) => {
    const newNode: Node = {
      id: `tool-${tool.id}-${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: (
          <div className="flex items-center gap-2 p-2">
            <Wrench className="h-4 w-4 text-yellow-500" />
            <div>
              <div className="font-medium">{tool.displayName}</div>
              <div className="text-xs text-gray-500">{tool.type}</div>
            </div>
          </div>
        ),
        toolId: tool.id,
        type: 'tool',
      },
      style: {
        background: '#fef9c3',
        border: '2px solid #eab308',
        borderRadius: '8px',
        padding: '4px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex gap-4">
      {/* Sidebar com componentes */}
      <div className="w-64 space-y-4 overflow-y-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/crews">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold truncate">{crew?.name}</h1>
        </div>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-500" />
              Agentes
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-1">
            {agents.map((agent) => (
              <Button
                key={agent.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => addAgentNode(agent)}
              >
                {agent.name}
              </Button>
            ))}
            {agents.length === 0 && (
              <p className="text-xs text-muted-foreground">Nenhum agente</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-green-500" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-1">
            {tasks.map((task) => (
              <Button
                key={task.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => addTaskNode(task)}
              >
                {task.name}
              </Button>
            ))}
            {tasks.length === 0 && (
              <p className="text-xs text-muted-foreground">Nenhuma task</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wrench className="h-4 w-4 text-yellow-500" />
              Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-1">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => addToolNode(tool)}
              >
                {tool.displayName}
              </Button>
            ))}
            {tools.length === 0 && (
              <p className="text-xs text-muted-foreground">Nenhuma tool</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Canvas do React Flow */}
      <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
          <Panel position="top-right" className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </Button>
            <Button variant="outline" disabled>
              <Play className="h-4 w-4 mr-2" />
              Executar
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
