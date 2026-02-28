import os
import time
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

logger = logging.getLogger(__name__)


class CrewExecutor:
    def __init__(self, api_keys: Dict[str, str] = None):
        self.api_keys = api_keys or {}
        self.logs: List[Dict[str, Any]] = []
        
    def _log(self, level: str, message: str):
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "level": level,
            "message": message
        }
        self.logs.append(log_entry)
        logger.info(f"[{level.upper()}] {message}")
        
    def _get_llm(self, provider: str, model: str):
        if provider == "openai":
            api_key = self.api_keys.get("openai") or os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OpenAI API key not provided")
            return ChatOpenAI(
                model=model,
                api_key=api_key,
                temperature=0.7
            )
        elif provider == "anthropic":
            api_key = self.api_keys.get("anthropic") or os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                raise ValueError("Anthropic API key not provided")
            return ChatAnthropic(
                model=model,
                api_key=api_key,
                temperature=0.7
            )
        else:
            raise ValueError(f"Unknown LLM provider: {provider}")
    
    def _create_agents(self, agents_config: List[Dict]) -> Dict[str, Agent]:
        agents = {}
        
        for config in agents_config:
            self._log("info", f"Creating agent: {config['name']}")
            
            llm = self._get_llm(config["llmProvider"], config["llmModel"])
            
            agent = Agent(
                role=config["role"],
                goal=config["goal"],
                backstory=config.get("backstory", ""),
                llm=llm,
                verbose=True,
                allow_delegation=False
            )
            
            agents[config["id"]] = agent
            
        return agents
    
    def _create_tasks(
        self, 
        tasks_config: List[Dict], 
        agents: Dict[str, Agent]
    ) -> List[Task]:
        tasks = []
        task_map: Dict[str, Task] = {}
        
        sorted_tasks = sorted(tasks_config, key=lambda x: x.get("order", 0))
        
        for config in sorted_tasks:
            self._log("info", f"Creating task: {config['name']}")
            
            agent = None
            if config.get("agentId"):
                agent = agents.get(config["agentId"])
                if not agent:
                    self._log("warning", f"Agent {config['agentId']} not found for task {config['name']}")
            
            context_tasks = []
            for ctx_id in config.get("contextTaskIds", []):
                if ctx_id in task_map:
                    context_tasks.append(task_map[ctx_id])
            
            task = Task(
                description=config["description"],
                expected_output=config["expectedOutput"],
                agent=agent,
                context=context_tasks if context_tasks else None
            )
            
            tasks.append(task)
            task_map[config["id"]] = task
            
        return tasks
    
    def execute(
        self,
        crew_config: Dict,
        agents_config: List[Dict],
        tasks_config: List[Dict],
        tools_config: List[str],
        inputs: Dict[str, Any]
    ) -> Dict[str, Any]:
        self.logs = []
        start_time = time.time()
        
        try:
            self._log("info", f"Starting execution of crew: {crew_config['name']}")
            
            agents = self._create_agents(agents_config)
            self._log("info", f"Created {len(agents)} agents")
            
            tasks = self._create_tasks(tasks_config, agents)
            self._log("info", f"Created {len(tasks)} tasks")
            
            process = Process.sequential
            if crew_config.get("process") == "hierarchical":
                process = Process.hierarchical
            
            crew = Crew(
                agents=list(agents.values()),
                tasks=tasks,
                process=process,
                verbose=crew_config.get("verbose", True)
            )
            
            self._log("info", "Crew assembled, starting kickoff...")
            
            result = crew.kickoff(inputs=inputs)
            
            execution_time = time.time() - start_time
            self._log("info", f"Execution completed in {execution_time:.2f}s")
            
            return {
                "output": str(result),
                "logs": self.logs,
                "execution_time": execution_time
            }
            
        except Exception as e:
            execution_time = time.time() - start_time
            self._log("error", f"Execution failed: {str(e)}")
            raise
