async function simulateConnectProfile(id) {
  // Simulate network latency (e.g., 200ms)
  return new Promise(resolve => setTimeout(() => resolve(`Connected ${id}`), 200));
}

async function runBenchmark() {
  const profiles = Array.from({ length: 5 }, (_, i) => ({ id: i.toString() }));

  console.log('--- Baseline: Sequential (for...await) ---');
  const startSequential = performance.now();
  for (const p of profiles) {
    await simulateConnectProfile(p.id);
  }
  const endSequential = performance.now();
  console.log(`Time taken: ${(endSequential - startSequential).toFixed(2)} ms\n`);

  console.log('--- Optimized: Parallel (Promise.all) ---');
  const startParallel = performance.now();
  await Promise.all(profiles.map(p => simulateConnectProfile(p.id)));
  const endParallel = performance.now();
  console.log(`Time taken: ${(endParallel - startParallel).toFixed(2)} ms\n`);
}

runBenchmark();
