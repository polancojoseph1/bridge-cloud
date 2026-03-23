export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  agentId: string | null;
  createdAt: number;
  isStreaming: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  agentId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  color: string;
  dotColor: string;
  iconName: string;
  endpoint: string;
  available: boolean;
}

export interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeAgentId: string;
  isStreaming: boolean;
  isSidebarOpen: boolean;

  activeConversation: () => Conversation | null;
  activeAgent: () => Agent;

  newConversation: () => string;
  setActiveConversation: (id: string | null) => void;
  setActiveAgent: (agentId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  clearAll: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export interface Instance {
  instanceId: string;
  agentId: string;
  conversationId: string | null;
  label: string;
  createdAt: number;
  isPinned: boolean;
}

export interface InstanceStore {
  instances: Instance[];
  activeInstanceId: string | null;
  activeInstance: () => Instance | null;
  createInstance: (agentId: string) => string;
  closeInstance: (instanceId: string) => void;
  setActiveInstance: (instanceId: string) => void;
  setInstanceConversation: (instanceId: string, conversationId: string) => void;
}

export interface AgentWithHealth extends Agent {
  health?: HealthStatus;
  latencyMs?: number;
  isOnline: boolean;
  healthStatus?: HealthStatus;
}

export type OrchestrationMode = 'single' | 'broadcast' | 'parallel' | 'pipeline' | 'gather';

export interface SubtaskResult {
  nodeId: string;
  nodeName: string;
  status: 'pending' | 'running' | 'done' | 'error' | 'failed' | 'timeout' | 'streaming' | 'sent';
  nodeColor?: string;
  elapsedMs?: number;
  result?: string;
  subtaskId?: string;
  output: string;
}

export interface OrchestrationJob {
  jobId: string;
  mode: OrchestrationMode;
  prompt: string;
  nodeIds: string[];
  status: 'running' | 'done' | 'error' | 'reducing';
  results: Record<string, string>;
  subtasks: SubtaskResult[];
  finalResult?: string;
  createdAt: number;
}

export type ServerTier = 'local' | 'cloud';
export type HealthStatus = 'unknown' | 'checking' | 'online' | 'offline' | 'auth_error';

export interface ServerProfile {
  id: string;
  name: string;
  tier: ServerTier;
  agentId: string;                      // 'claude' | 'gemini' | 'codex' | 'qwen' | 'free'
  url: string;                          // base URL, no trailing slash
  apiKey: string;
  isDefault: boolean;
  lastHealthStatus: HealthStatus;
  lastCheckedAt: number | null;
  createdAt: number;
  cloudProvisionStatus?: 'pending' | 'provisioned';
  pricingTier?: 'free' | 'pro';
}

export interface ServerStore {
  profiles: ServerProfile[];
  activeProfileId: string | null;
  connectionStatus: HealthStatus;

  activeProfile: () => ServerProfile | null;
  defaultProfile: () => ServerProfile | null;

  addProfile: (draft: Omit<ServerProfile, 'id' | 'createdAt' | 'lastHealthStatus' | 'lastCheckedAt'>) => string;
  updateProfile: (id: string, patch: Partial<ServerProfile>) => void;
  removeProfile: (id: string) => void;
  setDefault: (id: string) => void;
  setActiveProfile: (id: string | null) => void;
  connectProfile: (id: string) => Promise<HealthStatus>;
  isManageModalOpen: boolean;
  isManageOpen: boolean;
  manageModalView: 'list' | 'add';
  manageTab: 'list' | 'add';
  openManage: (view?: 'list' | 'add') => void;
  closeManage: () => void;
}
