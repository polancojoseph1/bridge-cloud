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
  }
}
