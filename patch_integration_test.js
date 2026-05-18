const fs = require('fs');
let code = fs.readFileSync('src/app/api/proxy/route.integration.test.ts', 'utf8');

code = code.replace(
  /function createRequest\(body: object\) \{\n  const headers = new Map<string, string>\(\);\n  return \{\n    json: async \(\) => body,\n    headers: \{\n      get: \(key: string\) => headers\.get\(key\)\n    \}\n  \} as unknown as NextRequest;\n\}/,
  "function createRequest(body: object) {\n  const headers = new Map<string, string>();\n  const jsonString = JSON.stringify(body);\n  headers.set('content-length', jsonString.length.toString());\n  return {\n    body: new ReadableStream({\n      start(controller) {\n        controller.enqueue(new TextEncoder().encode(jsonString));\n        controller.close();\n      }\n    }),\n    headers: {\n      get: (key: string) => headers.get(key)\n    }\n  } as unknown as NextRequest;\n}"
);

fs.writeFileSync('src/app/api/proxy/route.integration.test.ts', code);
