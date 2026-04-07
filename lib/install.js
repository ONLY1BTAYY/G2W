const fs = require('fs');
const path = require('path');
const os = require('os');
const SKILLS_SRC = path.join(__dirname, '../skills');

const G2W_HOOKS = {
  PreToolUse: [
    {
      matcher: 'Edit|Write|Bash',
      hooks: [
        {
          type: 'prompt',
          prompt: 'Trust Layer + A-Game check: answer the user\'s question first before acting. Declare scope (exact files you will touch). Stop if scope creeps beyond what was declared. Say "I don\'t know" instead of guessing. No commits without explicit user approval. A-Game: what does this change touch? What could break downstream? Is it more complex than it looks? If the user seems stuck or frustrated — remind them of their vision, not just fix the code.'
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
  const dest = path.join(targetBase, '.claude', 'skills', 'g2w');
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(SKILLS_SRC).filter(f => f.endsWith('.md'));
  files.forEach(file => {
    fs.copyFileSync(path.join(SKILLS_SRC, file), path.join(dest, file));
  });
  return { dest, count: files.length };
}

function mergeHooks(targetBase) {
  const settingsPath = path.join(targetBase, '.claude', 'settings.json');
  fs.mkdirSync(path.join(targetBase, '.claude'), { recursive: true });

  let existing = {};
  if (fs.existsSync(settingsPath)) {
    try { existing = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch {}
  }

  if (!existing.hooks) existing.hooks = {};

  // Merge PreToolUse — append if not already present
  if (!existing.hooks.PreToolUse) existing.hooks.PreToolUse = [];
  const alreadyHasPreHook = existing.hooks.PreToolUse.some(h =>
    h.hooks && h.hooks.some(hh => hh.prompt && hh.prompt.includes('Trust Layer'))
  );
  if (!alreadyHasPreHook) {
    existing.hooks.PreToolUse.push(...G2W_HOOKS.PreToolUse);
  }

  // Merge PostMessage — append if not already present
  if (!existing.hooks.PostMessage) existing.hooks.PostMessage = [];
  const alreadyHasPostHook = existing.hooks.PostMessage.some(h =>
    h.hooks && h.hooks.some(hh => hh.prompt && hh.prompt.includes('ready2save'))
  );
  if (!alreadyHasPostHook) {
    existing.hooks.PostMessage.push(...G2W_HOOKS.PostMessage);
  }

  fs.writeFileSync(settingsPath, JSON.stringify(existing, null, 2));
  return settingsPath;
}

function removeSkills(targetBase) {
  const dest = path.join(targetBase, '.claude', 'skills', 'g2w');
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
    return true;
  }
  return false;
}

function removeHooks(targetBase) {
  const settingsPath = path.join(targetBase, '.claude', 'settings.json');
  if (!fs.existsSync(settingsPath)) return;

  let existing = {};
  try { existing = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch { return; }

  if (existing.hooks) {
    if (existing.hooks.PreToolUse) {
      existing.hooks.PreToolUse = existing.hooks.PreToolUse.filter(h =>
        !(h.hooks && h.hooks.some(hh => hh.prompt && hh.prompt.includes('Trust Layer')))
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
  const settingsPath = mergeHooks(base);

  console.log(`
✅ G2W installed at ${label}

  ${count} skills → ${path.join(label, 'skills/g2w/')}
  Hooks    → ${path.join(label, 'settings.json')}

Open any project with Claude Code and type:
  /g2w:bring2life    — onboard an existing codebase
  /g2w:back2it       — resume a session
  /g2w:build2gether  — start something new
`);
}

async function update() {
  const { base, label } = getTarget();
  copySkills(base);
  console.log(`\n✅ G2W skills updated at ${label}\n`);
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
