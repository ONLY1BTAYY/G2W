#!/usr/bin/env node
// G2W Commit Guard — PreToolUse hook
// Fires before Bash commands. Hard blocks git commit and git push
// unless the user has explicitly approved. Exit code 1 = blocked.

let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => (input += chunk));
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    if (data.tool_name !== 'Bash') {
      process.exit(0);
    }

    const cmd = data.tool_input?.command || '';

    // Detect git commit or git push (with optional flags/args)
    const isCommit = /\bgit\s+commit\b/.test(cmd);
    const isPush = /\bgit\s+push\b/.test(cmd);

    if (isCommit || isPush) {
      const action = isCommit ? 'commit' : 'push';
      const output = {
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          additionalContext:
            `🚫 G2W COMMIT GUARD: You are about to run git ${action}. ` +
            'This requires explicit user approval. ' +
            'Stop and ask the user before proceeding. Do not bypass this check.',
        },
      };
      process.stdout.write(JSON.stringify(output));
      process.exit(1);
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
