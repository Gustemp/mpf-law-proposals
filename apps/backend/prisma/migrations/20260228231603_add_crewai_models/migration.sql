-- CreateTable
CREATE TABLE "crew_agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "backstory" TEXT NOT NULL,
    "llmProvider" TEXT NOT NULL DEFAULT 'openai',
    "llmModel" TEXT NOT NULL DEFAULT 'gpt-4-turbo-preview',
    "verbose" BOOLEAN NOT NULL DEFAULT false,
    "allowDelegation" BOOLEAN NOT NULL DEFAULT true,
    "maxIter" INTEGER NOT NULL DEFAULT 15,
    "memory" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crew_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_tools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'custom',
    "parameters" JSONB,
    "code" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crew_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_agent_tools" (
    "agentId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,

    CONSTRAINT "crew_agent_tools_pkey" PRIMARY KEY ("agentId","toolId")
);

-- CreateTable
CREATE TABLE "crew_tasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "agentId" TEXT,
    "asyncExecution" BOOLEAN NOT NULL DEFAULT false,
    "humanInput" BOOLEAN NOT NULL DEFAULT false,
    "outputFile" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crew_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_task_tools" (
    "taskId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,

    CONSTRAINT "crew_task_tools_pkey" PRIMARY KEY ("taskId","toolId")
);

-- CreateTable
CREATE TABLE "crew_task_contexts" (
    "contextTaskId" TEXT NOT NULL,
    "dependentTaskId" TEXT NOT NULL,

    CONSTRAINT "crew_task_contexts_pkey" PRIMARY KEY ("contextTaskId","dependentTaskId")
);

-- CreateTable
CREATE TABLE "crews" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "process" TEXT NOT NULL DEFAULT 'sequential',
    "verbose" BOOLEAN NOT NULL DEFAULT true,
    "memory" BOOLEAN NOT NULL DEFAULT false,
    "managerLlm" TEXT,
    "maxRpm" INTEGER,
    "variables" JSONB,
    "flowData" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "crews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_crew_agents" (
    "crewId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "crew_crew_agents_pkey" PRIMARY KEY ("crewId","agentId")
);

-- CreateTable
CREATE TABLE "crew_crew_tasks" (
    "crewId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "crew_crew_tasks_pkey" PRIMARY KEY ("crewId","taskId")
);

-- CreateTable
CREATE TABLE "crew_executions" (
    "id" TEXT NOT NULL,
    "crewId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "inputs" JSONB,
    "output" TEXT,
    "logs" JSONB,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "crew_executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "crew_tools_name_key" ON "crew_tools"("name");

-- AddForeignKey
ALTER TABLE "crew_agent_tools" ADD CONSTRAINT "crew_agent_tools_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "crew_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_agent_tools" ADD CONSTRAINT "crew_agent_tools_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "crew_tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_tasks" ADD CONSTRAINT "crew_tasks_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "crew_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_task_tools" ADD CONSTRAINT "crew_task_tools_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "crew_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_task_tools" ADD CONSTRAINT "crew_task_tools_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "crew_tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_task_contexts" ADD CONSTRAINT "crew_task_contexts_contextTaskId_fkey" FOREIGN KEY ("contextTaskId") REFERENCES "crew_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_task_contexts" ADD CONSTRAINT "crew_task_contexts_dependentTaskId_fkey" FOREIGN KEY ("dependentTaskId") REFERENCES "crew_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crews" ADD CONSTRAINT "crews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_crew_agents" ADD CONSTRAINT "crew_crew_agents_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_crew_agents" ADD CONSTRAINT "crew_crew_agents_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "crew_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_crew_tasks" ADD CONSTRAINT "crew_crew_tasks_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_crew_tasks" ADD CONSTRAINT "crew_crew_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "crew_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_executions" ADD CONSTRAINT "crew_executions_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
