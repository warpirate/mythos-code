#!/usr/bin/env bun
// Launcher for MYTHOS-CLI
// Forces proper TTY detection for interactive mode

// Set build-time env vars that the compiled binary normally --define's
// Without these, the API client sends malformed headers that can cause 500s
if (!process.env.USER_TYPE) {
  process.env.USER_TYPE = 'external';
}
if (!process.env.CLAUDE_CODE_ENTRYPOINT) {
  process.env.CLAUDE_CODE_ENTRYPOINT = 'cli';
}
// Disable attribution header — the fork can't produce the native attestation
// token (cch) that the compiled Bun binary generates via NATIVE_CLIENT_ATTESTATION.
// Sending a malformed/missing attestation can cause 500 Internal Server Errors.
if (!process.env.CLAUDE_CODE_ATTRIBUTION_HEADER) {
  process.env.CLAUDE_CODE_ATTRIBUTION_HEADER = '0';
}

// Force TTY so the REPL doesn't exit immediately
if (!process.stdout.isTTY) {
  Object.defineProperty(process.stdout, 'isTTY', { value: true });
}
if (!process.stdin.isTTY) {
  Object.defineProperty(process.stdin, 'isTTY', { value: true });
}
if (!process.stderr.isTTY) {
  Object.defineProperty(process.stderr, 'isTTY', { value: true });
}

// Enable raw mode support if missing
if (process.stdin.setRawMode === undefined) {
  (process.stdin as any).setRawMode = () => process.stdin;
}

process.on('uncaughtException', (e: any) => {
  console.error('MYTHOS-CLI Error:', e.message);
  console.error(e.stack);
});

process.on('unhandledRejection', (e: any) => {
  console.error('MYTHOS-CLI Unhandled:', e);
});

const { main } = await import('./src/main.tsx');
await main();
