declare namespace NodeJS {
  interface ProcessEnv {
    BRIDGEBOT_CLAUDE_URL?: string;
    BRIDGEBOT_CLAUDE_KEY?: string;
    BRIDGEBOT_GEMINI_URL?: string;
    BRIDGEBOT_GEMINI_KEY?: string;
    BRIDGEBOT_CODEX_URL?: string;
    BRIDGEBOT_CODEX_KEY?: string;
    BRIDGEBOT_QWEN_URL?: string;
    BRIDGEBOT_QWEN_KEY?: string;
    BRIDGEBOT_FREE_URL?: string;
    BRIDGEBOT_FREE_KEY?: string;
    // Client-side env vars (NEXT_PUBLIC_*) — available in browser bundles
    NEXT_PUBLIC_SERVER_PRECONFIGURED?: string;
    NEXT_PUBLIC_SERVER_URL?: string;
    NEXT_PUBLIC_SERVER_KEY?: string;
    NEXT_PUBLIC_SERVER_AGENT_ID?: string;
  }
}
