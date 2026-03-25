const { performance } = require('perf_hooks');

const agents = Array.from({ length: 100 }, (_, i) => ({
  id: `agent-${i}`,
  isOnline: i % 2 === 0
}));

const activeAgentId = 'agent-50';

function runUnmemoized(iterations) {
  let activeAgent, onlineAgents, offlineAgents;
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    activeAgent = agents.find(a => a.id === activeAgentId) ?? agents[0];
    onlineAgents = agents.filter(a => a.isOnline);
    offlineAgents = agents.filter(a => !a.isOnline);
  }
  const end = performance.now();
  return end - start;
}

function runMemoized(iterations) {
  // Simulating useMemo where deps don't change
  let activeAgent, onlineAgents, offlineAgents;

  // First render computes it
  activeAgent = agents.find(a => a.id === activeAgentId) ?? agents[0];
  onlineAgents = agents.filter(a => a.isOnline);
  offlineAgents = agents.filter(a => !a.isOnline);

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    // In subsequent renders with same deps, useMemo just returns the cached value
    const cachedActiveAgent = activeAgent;
    const cachedOnlineAgents = onlineAgents;
    const cachedOfflineAgents = offlineAgents;
  }
  const end = performance.now();
  return end - start;
}

const iterations = 100000;
console.log(`Running benchmark with ${iterations} renders...`);

const unmemoizedTime = runUnmemoized(iterations);
console.log(`Unmemoized: ${unmemoizedTime.toFixed(2)} ms`);

const memoizedTime = runMemoized(iterations);
console.log(`Memoized: ${memoizedTime.toFixed(2)} ms`);
