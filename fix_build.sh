sed -i '16,18c\      aria-label={isStreaming ? "Stop generating" : "Send message"}\n      title={isStreaming ? "Stop generating" : (title || "Send message")}' src/components/input/SendButton.tsx
