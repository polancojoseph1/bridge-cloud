
## 2024-11-20 - Cache stateless TextEncoder at module level
**Learning:** Instantiating `new TextEncoder()` inside request handlers causes redundant object creation and garbage collection overhead, as TextEncoder is stateless.
**Action:** Always instantiate stateless objects like TextEncoder once at the module scope.
