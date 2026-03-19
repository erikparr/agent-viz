export interface AgentStep {
  type: 'thinking' | 'code' | 'tool_call' | 'tool_result' | 'final_answer' | 'error';
  stepNumber: number;
  timestamp: number;
  thought?: string;
  code?: string;
  codeOutput?: string;
  toolCall?: {
    name: string;
    arguments: Record<string, any>;
  };
  toolResult?: {
    output: string;
    success: boolean;
  };
  finalAnswer?: string;
}

export interface AgentRun {
  id: string;
  query: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  steps: AgentStep[];
  error?: string;
}
