## 2024-05-31 - Module-level TextEncoder/TextDecoder Instantiation
**Learning:** TextEncoder and TextDecoder (when not used with `{ stream: true }`) are completely stateless. Instantiating them inside request handlers or loops causes unnecessary object creation and garbage collection overhead.
**Action:** Always instantiate stateless TextEncoder and TextDecoder instances once at the module scope.
