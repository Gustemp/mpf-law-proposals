import { Node, Edge } from 'reactflow';

export interface CrewAIAgent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory?: string;
  llmProvider: string;
  llmModel: string;
  tools: string[];
}

export interface CrewAITask {
  id: string;
  name: string;
  description: string;
  expectedOutput: string;
  agentId: string | null;
  contextTaskIds: string[];
  order: number;
}

export interface CrewAIFlow {
  crew: {
    name: string;
    process: string;
    verbose: boolean;
  };
  agents: CrewAIAgent[];
  tasks: CrewAITask[];
  tools: string[];
}

export function flowToCrewAI(
  nodes: Node[],
  edges: Edge[],
  crewName: string = 'Crew'
): CrewAIFlow {
  const agentNodes = nodes.filter((n) => n.type === 'agent');
  const taskNodes = nodes.filter((n) => n.type === 'task');
  const toolNodes = nodes.filter((n) => n.type === 'tool');

  // Mapear tools para agents
  const agentTools: Record<string, string[]> = {};
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    
    if (sourceNode?.type === 'tool' && targetNode?.type === 'agent') {
      const agentId = targetNode.data.agentId;
      const toolId = sourceNode.data.toolId;
      if (!agentTools[agentId]) agentTools[agentId] = [];
      agentTools[agentId].push(toolId);
    }
  });

  // Mapear agents para tasks
  const taskAgents: Record<string, string> = {};
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    
    if (sourceNode?.type === 'agent' && targetNode?.type === 'task') {
      taskAgents[targetNode.data.taskId] = sourceNode.data.agentId;
    }
  });

  // Mapear contexto entre tasks
  const taskContexts: Record<string, string[]> = {};
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    
    if (
      sourceNode?.type === 'task' &&
      targetNode?.type === 'task' &&
      edge.sourceHandle === 'output' &&
      edge.targetHandle === 'context'
    ) {
      const targetTaskId = targetNode.data.taskId;
      const sourceTaskId = sourceNode.data.taskId;
      if (!taskContexts[targetTaskId]) taskContexts[targetTaskId] = [];
      taskContexts[targetTaskId].push(sourceTaskId);
    }
  });

  // Ordenar tasks pela posição Y (de cima para baixo)
  const sortedTaskNodes = [...taskNodes].sort(
    (a, b) => a.position.y - b.position.y
  );

  // Construir agents
  const agents: CrewAIAgent[] = agentNodes.map((node) => ({
    id: node.data.agentId,
    name: node.data.name,
    role: node.data.role,
    goal: node.data.goal,
    backstory: node.data.backstory || '',
    llmProvider: node.data.llmProvider || 'openai',
    llmModel: node.data.llmModel || 'gpt-4-turbo-preview',
    tools: agentTools[node.data.agentId] || [],
  }));

  // Construir tasks
  const tasks: CrewAITask[] = sortedTaskNodes.map((node, index) => ({
    id: node.data.taskId,
    name: node.data.name,
    description: node.data.description,
    expectedOutput: node.data.expectedOutput,
    agentId: taskAgents[node.data.taskId] || null,
    contextTaskIds: taskContexts[node.data.taskId] || [],
    order: index,
  }));

  // Coletar IDs de tools usadas
  const usedToolIds = new Set<string>();
  Object.values(agentTools).forEach((tools) => {
    tools.forEach((toolId) => usedToolIds.add(toolId));
  });

  return {
    crew: {
      name: crewName,
      process: 'sequential',
      verbose: true,
    },
    agents,
    tasks,
    tools: Array.from(usedToolIds),
  };
}

export function validateFlow(nodes: Node[], edges: Edge[]): string[] {
  const errors: string[] = [];

  const taskNodes = nodes.filter((n) => n.type === 'task');
  const agentNodes = nodes.filter((n) => n.type === 'agent');

  // Verificar se há pelo menos um agent e uma task
  if (agentNodes.length === 0) {
    errors.push('O fluxo precisa de pelo menos um Agent');
  }

  if (taskNodes.length === 0) {
    errors.push('O fluxo precisa de pelo menos uma Task');
  }

  // Verificar se todas as tasks têm um agent conectado
  taskNodes.forEach((taskNode) => {
    const hasAgent = edges.some(
      (edge) =>
        edge.target === taskNode.id &&
        nodes.find((n) => n.id === edge.source)?.type === 'agent'
    );

    if (!hasAgent) {
      errors.push(`Task "${taskNode.data.name}" não tem um Agent conectado`);
    }
  });

  return errors;
}
