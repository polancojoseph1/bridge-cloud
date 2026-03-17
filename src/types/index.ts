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
  setActiveConversation: (id: string) => void;
  setActiveAgent: (agentId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  clearAll: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
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
}
