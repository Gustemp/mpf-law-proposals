from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import traceback
from datetime import datetime

from .executor import CrewExecutor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CrewAI Executor Service",
    description="Service to execute CrewAI flows",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AgentConfig(BaseModel):
    id: str
    name: str
    role: str
    goal: str
    backstory: Optional[str] = ""
    llmProvider: str = "openai"
    llmModel: str = "gpt-4-turbo-preview"
    tools: List[str] = []


class TaskConfig(BaseModel):
    id: str
    name: str
    description: str
    expectedOutput: str
    agentId: Optional[str] = None
    contextTaskIds: List[str] = []
    order: int = 0


class CrewConfig(BaseModel):
    name: str
    process: str = "sequential"
    verbose: bool = True


class ExecuteRequest(BaseModel):
    crew: CrewConfig
    agents: List[AgentConfig]
    tasks: List[TaskConfig]
    tools: List[str] = []
    inputs: Dict[str, Any] = {}
    apiKeys: Optional[Dict[str, str]] = None


class ExecuteResponse(BaseModel):
    status: str
    output: Optional[str] = None
    logs: List[Dict[str, Any]] = []
    error: Optional[str] = None
    executionTime: Optional[float] = None


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.post("/execute", response_model=ExecuteResponse)
async def execute_crew(request: ExecuteRequest):
    logger.info(f"Executing crew: {request.crew.name}")
    logger.info(f"Agents: {len(request.agents)}, Tasks: {len(request.tasks)}")
    
    try:
        executor = CrewExecutor(
            api_keys=request.apiKeys or {}
        )
        
        result = executor.execute(
            crew_config=request.crew.model_dump(),
            agents_config=[a.model_dump() for a in request.agents],
            tasks_config=[t.model_dump() for t in request.tasks],
            tools_config=request.tools,
            inputs=request.inputs
        )
        
        return ExecuteResponse(
            status="completed",
            output=result["output"],
            logs=result["logs"],
            executionTime=result["execution_time"]
        )
        
    except Exception as e:
        logger.error(f"Execution failed: {str(e)}")
        logger.error(traceback.format_exc())
        return ExecuteResponse(
            status="failed",
            error=str(e),
            logs=[{
                "timestamp": datetime.now().isoformat(),
                "level": "error",
                "message": str(e)
            }]
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3003)
