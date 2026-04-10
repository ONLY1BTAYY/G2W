const fs = require('fs');
const path = require('path');
const os = require('os');
const { LOGO } = require('./logo');
const { getGreeting } = require('./personality');

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
      matcher: 'Write|Edit|Bash',
      hooks: [
        {
          type: 'command',
          command: 'node "{{HOOKS_DIR}}/g2w-resource-limits.js"',
          timeout: 5
        }
      ]
    },
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
      matcher: 'Bash',
      hooks: [
        {
          type: 'command',
          command: 'node "{{HOOKS_DIR}}/g2w-commit-guard.js"',
          timeout: 5
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

const MCP_SERVERS = {
  context7: {
    command: 'npx',
    args: ['-y', '@upstash/context7-mcp@latest']
  },
  'shadcn-ui': {
    url: 'https://www.shadcn.io/api/mcp'
  },
  'tailwindcss': {
    command: 'npx',
    args: ['-y', 'tailwindcss-mcp-server']
  },
  'a11y': {
    command: 'npx',
    args: ['-y', 'a11y-mcp']
  }
};

function mergeMcpServers(targetBase) {
  const settingsPath = path.join(targetBase, '.claude', 'settings.json');
  let existing = {};
  if (fs.existsSync(settingsPath)) {
    try { existing = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch {}
  }

  if (!existing.mcpServers) existing.mcpServers = {};

  let added = 0;
  for (const [name, config] of Object.entries(MCP_SERVERS)) {
    if (!existing.mcpServers[name]) {
      existing.mcpServers[name] = config;
      added++;
    }
  }

  fs.writeFileSync(settingsPath, JSON.stringify(existing, null, 2));
  return added;
}

// Unique identifiers for each G2W hook — used for merge and removal
const HOOK_SIGNATURES = {
  resourceLimits: h => h.hooks?.some(hh => hh.command?.includes('g2w-resource-limits')),
  scopeGuard:     h => h.hooks?.some(hh => hh.command?.includes('g2w-scope-guard')),
  aGame:          h => h.hooks?.some(hh => hh.command?.includes('g2w-agame')),
  commitGuard:    h => h.hooks?.some(hh => hh.command?.includes('g2w-commit-guard')),
};

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

  // --- Migration: clean up old hook formats from previous G2W versions ---

  // Remove old PostMessage hooks (no longer used)
  if (existing.hooks.PostMessage) {
    existing.hooks.PostMessage = existing.hooks.PostMessage.filter(h =>
      !(h.hooks && h.hooks.some(hh => hh.prompt && hh.prompt.includes('ready2save')))
    );
    if (existing.hooks.PostMessage.length === 0) delete existing.hooks.PostMessage;
  }

  // Remove old UserPromptSubmit hooks (broke chat — Trust Layer + context warning)
  if (existing.hooks.UserPromptSubmit) {
    existing.hooks.UserPromptSubmit = existing.hooks.UserPromptSubmit.filter(h =>
      !(h.hooks && h.hooks.some(hh =>
        hh.prompt && (hh.prompt.includes('G2W Trust Layer') || hh.prompt.includes('Context check'))
      ))
    );
    if (existing.hooks.UserPromptSubmit.length === 0) delete existing.hooks.UserPromptSubmit;
  }

  // Remove old Trust Layer prompt from PreToolUse (was there in early versions)
  if (existing.hooks.PreToolUse) {
    existing.hooks.PreToolUse = existing.hooks.PreToolUse.filter(h =>
      !(h.hooks && h.hooks.some(hh => hh.prompt && hh.prompt.includes('Trust Layer')))
    );
  }

  // --- Merge current hooks: scope-guard, a-game, commit-guard on PreToolUse ---

  if (!existing.hooks.PreToolUse) existing.hooks.PreToolUse = [];
  for (const hook of resolvedHooks.PreToolUse) {
    const isResourceLimits = HOOK_SIGNATURES.resourceLimits(hook);
    const isScopeGuard = HOOK_SIGNATURES.scopeGuard(hook);
    const isAGame = HOOK_SIGNATURES.aGame(hook);
    const isCommitGuard = HOOK_SIGNATURES.commitGuard(hook);
    const alreadyExists = existing.hooks.PreToolUse.some(h =>
      (isResourceLimits && HOOK_SIGNATURES.resourceLimits(h)) ||
      (isScopeGuard && HOOK_SIGNATURES.scopeGuard(h)) ||
      (isAGame && HOOK_SIGNATURES.aGame(h)) ||
      (isCommitGuard && HOOK_SIGNATURES.commitGuard(h))
    );
    if (!alreadyExists) {
      existing.hooks.PreToolUse.push(hook);
    }
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

function removeMcpServers(targetBase) {
  const settingsPath = path.join(targetBase, '.claude', 'settings.json');
  if (!fs.existsSync(settingsPath)) return;
  let existing = {};
  try { existing = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch { return; }
  if (existing.mcpServers) {
    for (const name of Object.keys(MCP_SERVERS)) {
      delete existing.mcpServers[name];
    }
  }
  fs.writeFileSync(settingsPath, JSON.stringify(existing, null, 2));
}

function removeHooks(targetBase) {
  const settingsPath = path.join(targetBase, '.claude', 'settings.json');
  const hooksDir = path.join(targetBase, '.claude', 'hooks');

  // Remove hook scripts
  ['g2w-resource-limits.js', 'g2w-scope-guard.js', 'g2w-agame.js', 'g2w-commit-guard.js'].forEach(file => {
    const p = path.join(hooksDir, file);
    if (fs.existsSync(p)) fs.rmSync(p);
  });

  if (!fs.existsSync(settingsPath)) return;
  let existing = {};
  try { existing = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch { return; }

  if (existing.hooks) {
    // Remove all G2W PreToolUse hooks (scope-guard, a-game, commit-guard, old Trust Layer prompt)
    if (existing.hooks.PreToolUse) {
      existing.hooks.PreToolUse = existing.hooks.PreToolUse.filter(h =>
        !HOOK_SIGNATURES.resourceLimits(h) &&
        !HOOK_SIGNATURES.scopeGuard(h) &&
        !HOOK_SIGNATURES.aGame(h) &&
        !HOOK_SIGNATURES.commitGuard(h) &&
        !(h.hooks && h.hooks.some(hh => hh.prompt && hh.prompt.includes('Trust Layer')))
      );
      if (existing.hooks.PreToolUse.length === 0) delete existing.hooks.PreToolUse;
    }
    // Clean up old UserPromptSubmit hooks (broke chat — removed in v1.0.29+)
    if (existing.hooks.UserPromptSubmit) {
      existing.hooks.UserPromptSubmit = existing.hooks.UserPromptSubmit.filter(h =>
        !(h.hooks && h.hooks.some(hh =>
          hh.prompt && (hh.prompt.includes('G2W Trust Layer') || hh.prompt.includes('Context check'))
        ))
      );
      if (existing.hooks.UserPromptSubmit.length === 0) delete existing.hooks.UserPromptSubmit;
    }
    // Clean up old PostMessage hooks from early versions
    if (existing.hooks.PostMessage) {
      existing.hooks.PostMessage = existing.hooks.PostMessage.filter(h =>
        !(h.hooks && h.hooks.some(hh => hh.prompt && hh.prompt.includes('ready2save')))
      );
      if (existing.hooks.PostMessage.length === 0) delete existing.hooks.PostMessage;
    }
  }

  fs.writeFileSync(settingsPath, JSON.stringify(existing, null, 2));
}

function getTarget() {
  return { base: os.homedir(), label: '~/.claude/' };
}

function createDefaultResourceLimits() {
  const configPath = path.join(os.homedir(), '.g2w', 'resource-limits.json');
  if (fs.existsSync(configPath)) return; // don't overwrite user config
  const defaults = {
    enabled: true,
    maxToolCalls: 200,
    warnAtToolCallPercent: 80,
    maxPlanRevisions: 5,
    maxFileEdits: 8,
    maxUniqueFiles: 25,
    sessionTimeoutHours: 4
  };
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(defaults, null, 2));
}

async function run() {
  const { base, label } = getTarget();
  const { dest, count } = copySkills(base);
  copyHooks(base);
  const settingsPath = mergeHooks(base);
  const mcpAdded = mergeMcpServers(base);
  createDefaultResourceLimits();

  writeTTY(`${LOGO}
\x1b[32m✅ G2W installed at ${label}\x1b[0m

  ${count} skills → ${path.join(label, 'commands/g2w/')}
  Hooks    → ${path.join(label, 'hooks/')}
  Config   → ${path.join(label, 'settings.json')}

\x1b[36mIncluded tools:\x1b[0m
  ✅ Context7     — live library docs in every research phase
  ✅ Shadcn/UI    — real React component implementations
  ✅ Tailwind CSS — utility classes and CSS conversion
  ✅ A11y         — accessibility audits and WCAG checks

\x1b[33mPower-Ups (optional — run g2w power-ups to set up):\x1b[0m
  → 21st.dev     — AI component generation        https://21st.dev/magic/console
  → Motion       — production animations           https://plus.motion.dev/personal-token
  → Figma MCP    — design-to-code from Figma       https://figma.com
  → Marketing    — 40+ SEO, copy, growth skills    https://github.com/coreyhaines31/marketingskills
  → Exa          — semantic search (paid)           https://exa.ai
  → Firecrawl    — deep doc crawling (paid)         https://firecrawl.dev
  → Repomix      — pack codebases for AI            https://github.com/yamadashy/repomix
  → MemPalace    — persistent memory                https://github.com/milla-jovovich/mempalace
  → Superpowers  — enhanced planning + review       https://github.com/supermemoryai/superpowers-claude

Open any project with Claude Code and type:
  /g2w:bring2life    — onboard an existing codebase
  /g2w:back2it       — resume a session
  /g2w:build2gether  — start something new

${getGreeting()}
`);
}

async function update() {
  const { base, label } = getTarget();
  const { count } = copySkills(base);
  copyHooks(base);
  mergeHooks(base);
  const mcpAdded = mergeMcpServers(base);

  writeTTY(`
\x1b[32m✅ G2W updated at ${label}\x1b[0m

  ${count} skills synced
  Hooks synced
  ${mcpAdded > 0 ? mcpAdded + ' new MCP servers added' : 'MCP servers up to date'}

`);
}

async function powerups() {
  writeTTY(`
\x1b[36mG2W Power-Ups\x1b[0m

\x1b[33mFree (just needs a key):\x1b[0m
  → 21st.dev     — AI component generation        https://21st.dev/magic/console
  → Motion       — production animations           https://plus.motion.dev/personal-token
  → Figma MCP    — design-to-code from Figma       https://figma.com
  → Marketing    — 40+ SEO, copy, growth skills    https://github.com/coreyhaines31/marketingskills

\x1b[33mResearch (paid):\x1b[0m
  → Exa          — semantic search                 https://exa.ai
  → Firecrawl    — deep doc crawling               https://firecrawl.dev

\x1b[33mWorkflow:\x1b[0m
  → Repomix      — pack codebases for AI           https://github.com/yamadashy/repomix
  → MemPalace    — persistent memory               https://github.com/milla-jovovich/mempalace
  → Superpowers  — enhanced planning + review       https://github.com/supermemoryai/superpowers-claude

Visit the links above to get your keys, then configure them in ~/.claude/settings.json

`);
}

async function uninstall() {
  const { base, label } = getTarget();
  const removed = removeSkills(base);
  removeHooks(base);
  removeMcpServers(base);

  if (removed) {
    console.log(`\n✅ G2W removed from ${label}\n`);
  } else {
    console.log(`\nG2W was not found at ${label}\n`);
  }
}

module.exports = { run, update, uninstall, powerups };
