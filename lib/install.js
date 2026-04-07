const fs = require('fs');
const path = require('path');
const os = require('os');
const { LOGO } = require('./logo');

function writeTTY(text) {
  // Plain stderr first — npm shows this reliably
  const plain = text.replace(/\x1b\[[0-9;]*m/g, '');
  process.stderr.write(plain);
  // Then try CONOUT$ for the colored version
  try {
    const devName = process.platform === 'win32' ? 'CONOUT$' : '/dev/tty';
    const fd = fs.openSync(devName, 'w');
    fs.writeSync(fd, text);
    fs.closeSync(fd);
  } catch {}
}
const SKILLS_SRC = path.join(__dirname, '../skills');
const HOOKS_SRC = path.join(__dirname, '../hooks');

const G2W_HOOKS = {
  PreToolUse: [
    {
      matcher: 'Write|Edit',
      hooks: [
        {
          type: 'command',
          command: 'node "{{HOOKS_DIR}}/g2w-scope-guard.js"',
          timeout: 5
        }
      ]
    },
    {
      matcher: 'Write|Edit',
      hooks: [
        {
          type: 'command',
          command: 'node "{{HOOKS_DIR}}/g2w-agame.js"',
          timeout: 5
        }
      ]
    },
    {
      matcher: 'Edit|Write|Bash',
      hooks: [
        {
          type: 'prompt',
          prompt: 'Trust Layer: answer the user\'s question first before acting. Declare scope (exact files you will touch). Stop if scope creeps beyond what was declared. Say "I don\'t know" instead of guessing. No commits without explicit user approval. If the user seems stuck or frustrated — remind them of their vision, not just fix the code.'
        }
      ]
    }
  ],
  PostMessage: [
    {
      matcher: '.*',
      hooks: [
        {
          type: 'prompt',
          prompt: 'If the context window is at or above 80%, tell the user: "Hey — we\'re getting close to the context limit. Want me to run /g2w:ready2save to save progress and clear context?" If below 80%, do nothing.'
        }
      ]
    }
  ]
};

function copySkills(targetBase) {
  const dest = path.join(targetBase, '.claude', 'commands', 'g2w');
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(SKILLS_SRC).filter(f => f.endsWith('.md'));
  files.forEach(file => {
    fs.copyFileSync(path.join(SKILLS_SRC, file), path.join(dest, file));
  });
  return { dest, count: files.length };
}

function copyHooks(targetBase) {
  const dest = path.join(targetBase, '.claude', 'hooks');
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(HOOKS_SRC).filter(f => f.endsWith('.js'));
  files.forEach(file => {
    fs.copyFileSync(path.join(HOOKS_SRC, file), path.join(dest, file));
  });
  return dest;
}

function mergeHooks(targetBase) {
  const settingsPath = path.join(targetBase, '.claude', 'settings.json');
  const hooksDir = path.join(targetBase, '.claude', 'hooks');
  fs.mkdirSync(path.join(targetBase, '.claude'), { recursive: true });

  let existing = {};
  if (fs.existsSync(settingsPath)) {
    try { existing = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch {}
  }

  if (!existing.hooks) existing.hooks = {};

  // Resolve {{HOOKS_DIR}} placeholder to the actual installed path
  const resolvedHooks = JSON.parse(
    JSON.stringify(G2W_HOOKS).replace(/\{\{HOOKS_DIR\}\}/g, hooksDir.replace(/\\/g, '/'))
  );

  // Merge PreToolUse — append if not already present (check by scope-guard command)
  if (!existing.hooks.PreToolUse) existing.hooks.PreToolUse = [];
  const alreadyHasPreHook = existing.hooks.PreToolUse.some(h =>
    h.hooks && h.hooks.some(hh => hh.command && hh.command.includes('g2w-scope-guard'))
  );
  if (!alreadyHasPreHook) {
    existing.hooks.PreToolUse.push(...resolvedHooks.PreToolUse);
  }

  // Merge PostMessage — append if not already present
  if (!existing.hooks.PostMessage) existing.hooks.PostMessage = [];
  const alreadyHasPostHook = existing.hooks.PostMessage.some(h =>
    h.hooks && h.hooks.some(hh => hh.prompt && hh.prompt.includes('ready2save'))
  );
  if (!alreadyHasPostHook) {
    existing.hooks.PostMessage.push(...resolvedHooks.PostMessage);
  }

  fs.writeFileSync(settingsPath, JSON.stringify(existing, null, 2));
  return settingsPath;
}

function removeSkills(targetBase) {
  const dest = path.join(targetBase, '.claude', 'commands', 'g2w');
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
    return true;
  }
  return false;
}

function removeHooks(targetBase) {
  const settingsPath = path.join(targetBase, '.claude', 'settings.json');
  const hooksDir = path.join(targetBase, '.claude', 'hooks');

  // Remove hook scripts
  ['g2w-scope-guard.js', 'g2w-agame.js'].forEach(file => {
    const p = path.join(hooksDir, file);
    if (fs.existsSync(p)) fs.rmSync(p);
  });

  if (!fs.existsSync(settingsPath)) return;
  let existing = {};
  try { existing = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch { return; }

  if (existing.hooks) {
    if (existing.hooks.PreToolUse) {
      existing.hooks.PreToolUse = existing.hooks.PreToolUse.filter(h =>
        !(h.hooks && h.hooks.some(hh =>
          (hh.command && (hh.command.includes('g2w-scope-guard') || hh.command.includes('g2w-agame'))) ||
          (hh.prompt && hh.prompt.includes('Trust Layer'))
        ))
      );
    }
    if (existing.hooks.PostMessage) {
      existing.hooks.PostMessage = existing.hooks.PostMessage.filter(h =>
        !(h.hooks && h.hooks.some(hh => hh.prompt && hh.prompt.includes('ready2save')))
      );
    }
  }

  fs.writeFileSync(settingsPath, JSON.stringify(existing, null, 2));
}

function getTarget() {
  return { base: os.homedir(), label: '~/.claude/' };
}

async function run() {
  const { base, label } = getTarget();
  const { dest, count } = copySkills(base);
  copyHooks(base);
  const settingsPath = mergeHooks(base);

  writeTTY(`${LOGO}
\x1b[32m✅ G2W installed at ${label}\x1b[0m

  ${count} skills → ${path.join(label, 'commands/g2w/')}
  Hooks    → ${path.join(label, 'hooks/')}
  Config   → ${path.join(label, 'settings.json')}

Open any project with Claude Code and type:
  /g2w:bring2life    — onboard an existing codebase
  /g2w:back2it       — resume a session
  /g2w:build2gether  — start something new

`);
}

async function update() {
  const { base, label } = getTarget();
  copySkills(base);
  copyHooks(base);
  console.log(`\n✅ G2W skills and hooks updated at ${label}\n`);
}

async function uninstall() {
  const { base, label } = getTarget();
  const removed = removeSkills(base);
  removeHooks(base);

  if (removed) {
    console.log(`\n✅ G2W removed from ${label}\n`);
  } else {
    console.log(`\nG2W was not found at ${label}\n`);
  }
}

module.exports = { run, update, uninstall };
