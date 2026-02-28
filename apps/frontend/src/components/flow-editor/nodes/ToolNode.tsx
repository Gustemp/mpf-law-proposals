'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Wrench } from 'lucide-react';

export interface ToolNodeData {
  toolId: string;
  name: string;
  displayName: string;
  description: string;
  type: string;
}

function ToolNode({ data, selected }: NodeProps<ToolNodeData>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-yellow-50 dark:bg-yellow-950 min-w-[160px] ${
        selected ? 'border-yellow-600 shadow-lg' : 'border-yellow-400'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded bg-yellow-500 text-white">
          <Wrench className="h-4 w-4" />
        </div>
        <div className="font-semibold text-sm text-yellow-900 dark:text-yellow-100">
          {data.displayName}
        </div>
      </div>
      
      <div className="text-xs text-yellow-700 dark:text-yellow-300 line-clamp-2">
        {data.description}
      </div>
      
      <div className="mt-2 text-[10px] px-1.5 py-0.5 bg-yellow-200 dark:bg-yellow-800 rounded inline-block">
        {data.type}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="agent"
        className="!bg-blue-500 !w-3 !h-3"
        title="Conectar a Agent"
      />
    </div>
  );
}

export default memo(ToolNode);
