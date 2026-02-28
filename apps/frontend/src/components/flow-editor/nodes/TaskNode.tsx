'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ListTodo } from 'lucide-react';

export interface TaskNodeData {
  taskId: string;
  name: string;
  description: string;
  expectedOutput: string;
  agentName?: string;
}

function TaskNode({ data, selected }: NodeProps<TaskNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-green-50 dark:bg-green-950 min-w-[200px] ${
        selected ? 'border-green-600 shadow-lg' : 'border-green-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="agent"
        className="!bg-blue-500 !w-3 !h-3"
        style={{ top: '30%' }}
        title="Conectar Agent"
      />
      
      <Handle
        type="target"
        position={Position.Top}
        id="context"
        className="!bg-purple-500 !w-3 !h-3"
        title="Contexto de outra Task"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded bg-green-500 text-white">
          <ListTodo className="h-4 w-4" />
        </div>
        <div className="font-semibold text-sm text-green-900 dark:text-green-100">
          {data.name}
        </div>
      </div>
      
      <div className="text-xs text-green-700 dark:text-green-300 line-clamp-2 mb-1">
        {data.description}
      </div>
      
      {data.agentName && (
        <div className="text-[10px] px-1.5 py-0.5 bg-blue-200 dark:bg-blue-800 rounded inline-block">
          Agent: {data.agentName}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-purple-500 !w-3 !h-3"
        title="Output / Contexto"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="next"
        className="!bg-green-500 !w-3 !h-3"
        title="Próxima Task"
      />
    </div>
  );
}

export default memo(TaskNode);
