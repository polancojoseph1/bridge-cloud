## 2024-05-24 - Stateless TextEncoder Object Creation Overhead
**Learning:** TextEncoder is stateless, but instantiating it inside request handlers (like Next.js API POST routes) creates unnecessary object creation and garbage collection overhead on every request.
**Action:** Always instantiate stateless objects like TextEncoder once at the module scope.
