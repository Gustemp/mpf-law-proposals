'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bot } from 'lucide-react';

export interface AgentNodeData {
  agentId: string;
  name: string;
  role: string;
  goal: string;
  llmModel: string;
}

function AgentNode({ data, selected }: NodeProps<AgentNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-blue-50 dark:bg-blue-950 min-w-[180px] ${
        selected ? 'border-blue-600 shadow-lg' : 'border-blue-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="tools"
        className="!bg-yellow-500 !w-3 !h-3"
        title="Conectar Tools"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded bg-blue-500 text-white">
          <Bot className="h-4 w-4" />
        </div>
        <div className="font-semibold text-sm text-blue-900 dark:text-blue-100">
          {data.name}
        </div>
      </div>
      
      <div className="text-xs text-blue-700 dark:text-blue-300 mb-1">
        {data.role}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
        {data.goal}
      </div>
      
      <div className="mt-2 text-[10px] px-1.5 py-0.5 bg-blue-200 dark:bg-blue-800 rounded inline-block">
        {data.llmModel}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="tasks"
        className="!bg-green-500 !w-3 !h-3"
        title="Conectar Tasks"
      />
    </div>
  );
}

export default memo(AgentNode);
