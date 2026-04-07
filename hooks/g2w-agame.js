#!/usr/bin/env node
// G2W A-Game — PreToolUse hook
// Fires before every Write/Edit and injects the 4 A-Game questions as visible context.
// Does NOT block with exit code — forces out-loud reasoning, which IS the audit trail.
// Scope guard runs first (hard stops). A-Game runs second (forces reasoning).

const path = require('path');

let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => (input += chunk));
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name;
    if (toolName !== 'Write' && toolName !== 'Edit') {
      process.exit(0);
    }

    const filePath = data.tool_input?.file_path || '';
    const fileName = filePath ? path.basename(filePath) : 'this file';

    const output = {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext:
          `🎯 A-Game check before editing ${fileName} — answer these out loud before writing:\n` +
          '1. What does this change touch? (exact lines/functions affected)\n' +
          '2. What could break downstream? (callers, dependents, side effects)\n' +
          '3. Is this more complex than it looks? (flag it if yes)\n' +
          '4. Does every function, method, or import being referenced actually exist in the codebase right now?\n' +
          'Answer all four, then proceed.',
      },
    };

    process.stdout.write(JSON.stringify(output));
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
