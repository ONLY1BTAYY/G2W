#!/usr/bin/env node
// G2W Tests — proves hooks and skills actually do what we claim
// Run: node test/hooks-and-skills.test.js

const fs = require('fs');
const path = require('path');
const os = require('os');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg);
}

// ─── Load files ───
const skillsDir = path.join(__dirname, '..', 'skills');
const readySave = fs.readFileSync(path.join(skillsDir, 'ready2save.md'), 'utf8');
const back2it = fs.readFileSync(path.join(skillsDir, 'back2it.md'), 'utf8');
const installSrc = fs.readFileSync(path.join(__dirname, '..', 'lib', 'install.js'), 'utf8');

// ─── Test: ready2save never asks "which project" ───
console.log('\n📋 ready2save skill:');

test('Step 2 reads ~/.g2w/CURRENT.md instead of asking', () => {
  assert(readySave.includes('~/.g2w/CURRENT.md'), 'Should reference ~/.g2w/CURRENT.md');
  assert(readySave.includes('Do NOT ask'), 'Should have "Do NOT ask" instruction');
  assert(!readySave.includes('"Which project are we saving?"'), 'Should NOT contain the old question prompt');
});

test('Step 2 only asks if no active project is set', () => {
  assert(readySave.includes('ONLY scenario where you ask'), 'Should clarify asking is last resort only');
});

test('No question marks before the commit step (Step 5)', () => {
  const beforeCommit = readySave.split('**Commit**')[0];
  const askPatterns = [
    /ask:\s*>/i,
    /(?<!NOT )ask the user which/i,
    /(?<!NOT )ask the user what/i,
    /which project.*\?/i,
  ];
  for (const pattern of askPatterns) {
    assert(!pattern.test(beforeCommit), `Found user question pattern before commit step: ${pattern}`);
  }
});

test('Step 5 chains git commands with &&', () => {
  assert(readySave.includes('git add [files] && git commit'), 'Should show && chaining in example');
  assert(readySave.includes('Never split git add and git commit'), 'Should explicitly forbid splitting');
});

test('Step 6 closing quotes exist', () => {
  assert(readySave.includes('Announce with personality'), 'Should have quote step');
  assert(readySave.includes('Ocean Veau'), 'Should contain Ocean Veau quotes');
  assert(readySave.includes('Saved. Context is clean.'), 'Should have closing format');
});

test('Extracts decisions from conversation, never asks user to recall', () => {
  assert(readySave.includes('Do NOT ask the user what was done'), 'Step 1 should forbid asking');
  assert(readySave.includes('Never ask them to recall'), 'Should say never ask them to recall');
});

// ─── Test: install.js hook architecture ───
console.log('\n🔧 install.js hook architecture:');

test('No UserPromptSubmit hooks defined in G2W_HOOKS', () => {
  const hooksBlock = installSrc.split('const G2W_HOOKS')[1].split('function copySkills')[0];
  assert(!hooksBlock.includes('UserPromptSubmit'), 'G2W_HOOKS should NOT have UserPromptSubmit');
});

test('No PostMessage hooks defined in G2W_HOOKS', () => {
  const hooksBlock = installSrc.split('const G2W_HOOKS')[1].split('function copySkills')[0];
  assert(!hooksBlock.includes('PostMessage'), 'G2W_HOOKS should not have PostMessage');
});

test('No prompt-type hooks in G2W_HOOKS', () => {
  const hooksBlock = installSrc.split('const G2W_HOOKS')[1].split('function copySkills')[0];
  assert(!hooksBlock.includes("type: 'prompt'"), 'G2W_HOOKS should have no prompt hooks');
});

test('PreToolUse has resource-limits, scope-guard, a-game, and commit-guard', () => {
  const hooksBlock = installSrc.split('const G2W_HOOKS')[1].split('function copySkills')[0];
  assert(hooksBlock.includes('g2w-resource-limits'), 'Should have resource limits');
  assert(hooksBlock.includes('g2w-scope-guard'), 'Should have scope guard');
  assert(hooksBlock.includes('g2w-agame'), 'Should have a-game');
  assert(hooksBlock.includes('g2w-commit-guard'), 'Should have commit guard');
});

test('Commit guard matches on Bash, not Write|Edit', () => {
  const hooksBlock = installSrc.split('const G2W_HOOKS')[1].split('function copySkills')[0];
  // Find the commit-guard entry and check its matcher
  const commitGuardSection = hooksBlock.split('g2w-commit-guard')[0].split('{').pop();
  assert(hooksBlock.includes("matcher: 'Bash'"), 'Commit guard should match on Bash');
});

test('Merge logic checks each hook individually by signature', () => {
  assert(installSrc.includes('HOOK_SIGNATURES'), 'Should use HOOK_SIGNATURES for dedup');
  assert(installSrc.includes('resourceLimits'), 'Should check resource-limits individually');
  assert(installSrc.includes('scopeGuard'), 'Should check scope-guard individually');
  assert(installSrc.includes('aGame'), 'Should check a-game individually');
  assert(installSrc.includes('commitGuard'), 'Should check commit-guard individually');
});

test('Merge cleans up old UserPromptSubmit hooks', () => {
  const mergeSection = installSrc.split('function mergeHooks')[1];
  assert(mergeSection.includes('UserPromptSubmit'), 'Should clean old UserPromptSubmit hooks');
  assert(mergeSection.includes('broke chat'), 'Should document why they were removed');
});

test('Merge cleans up old PostMessage hooks', () => {
  const mergeSection = installSrc.split('function mergeHooks')[1];
  assert(mergeSection.includes('PostMessage'), 'Should clean old PostMessage hooks');
});

test('Merge cleans up old Trust Layer prompt from PreToolUse', () => {
  const mergeSection = installSrc.split('function mergeHooks')[1];
  assert(mergeSection.includes("Trust Layer"), 'Should remove old Trust Layer prompt from PreToolUse');
});

test('Uninstall removes resource-limits hook file', () => {
  const removeSection = installSrc.split('function removeHooks')[1];
  assert(removeSection.includes('g2w-resource-limits.js'), 'Should clean up resource-limits file');
});

test('Uninstall removes commit-guard hook file', () => {
  const removeSection = installSrc.split('function removeHooks')[1];
  assert(removeSection.includes('g2w-commit-guard.js'), 'Should clean up commit-guard file');
});

test('Uninstall cleans up old UserPromptSubmit hooks', () => {
  const removeSection = installSrc.split('function removeHooks')[1];
  assert(removeSection.includes('UserPromptSubmit'), 'removeHooks should clean UserPromptSubmit');
});

// ─── Test: hook source files exist ───
console.log('\n📂 Hook source files:');

test('g2w-scope-guard.js exists in hooks/', () => {
  const p = path.join(__dirname, '..', 'hooks', 'g2w-scope-guard.js');
  assert(fs.existsSync(p), 'hooks/g2w-scope-guard.js should exist');
});

test('g2w-agame.js exists in hooks/', () => {
  const p = path.join(__dirname, '..', 'hooks', 'g2w-agame.js');
  assert(fs.existsSync(p), 'hooks/g2w-agame.js should exist');
});

test('g2w-commit-guard.js exists in hooks/', () => {
  const p = path.join(__dirname, '..', 'hooks', 'g2w-commit-guard.js');
  assert(fs.existsSync(p), 'hooks/g2w-commit-guard.js should exist');
});

test('g2w-resource-limits.js exists in hooks/', () => {
  const p = path.join(__dirname, '..', 'hooks', 'g2w-resource-limits.js');
  assert(fs.existsSync(p), 'hooks/g2w-resource-limits.js should exist');
});

test('resource-limits tracks Write, Edit, and Bash', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'hooks', 'g2w-resource-limits.js'), 'utf8');
  assert(src.includes("toolName !== 'Write'"), 'Should check for Write');
  assert(src.includes("toolName !== 'Edit'"), 'Should check for Edit');
  assert(src.includes("toolName !== 'Bash'"), 'Should check for Bash');
});

test('resource-limits has hard blocks and warnings', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'hooks', 'g2w-resource-limits.js'), 'utf8');
  assert(src.includes('exit(1)'), 'Should hard block with exit code 1');
  assert(src.includes('RESOURCE LIMIT'), 'Should have resource limit message');
  assert(src.includes('LOOP DETECTED'), 'Should have loop detection message');
  assert(src.includes('SCOPE CREEP'), 'Should have scope creep message');
  assert(src.includes('RESOURCE WARNING'), 'Should have warning message');
});

test('resource-limits has configurable defaults', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'hooks', 'g2w-resource-limits.js'), 'utf8');
  assert(src.includes('resource-limits.json'), 'Should read config from resource-limits.json');
  assert(src.includes('DEFAULTS'), 'Should have hardcoded defaults');
  assert(src.includes('maxToolCalls'), 'Should have maxToolCalls config');
  assert(src.includes('maxPlanRevisions'), 'Should have maxPlanRevisions config');
});

test('resource-limits logs sessions to session-log.jsonl', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'hooks', 'g2w-resource-limits.js'), 'utf8');
  assert(src.includes('session-log.jsonl'), 'Should log to session-log.jsonl');
  assert(src.includes('appendLog'), 'Should have append log function');
});

test('resource-limits never blocks on error', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'hooks', 'g2w-resource-limits.js'), 'utf8');
  assert(src.includes('catch {'), 'Should catch errors');
  // The final catch block should exit 0
  const lastCatch = src.lastIndexOf('catch {');
  const afterLastCatch = src.substring(lastCatch);
  assert(afterLastCatch.includes('exit(0)'), 'Final catch should exit 0 (never block on error)');
});

test('resource-limits runs first (before scope-guard) in G2W_HOOKS', () => {
  const hooksBlock = installSrc.split('const G2W_HOOKS')[1].split('function copySkills')[0];
  const limitsPos = hooksBlock.indexOf('g2w-resource-limits');
  const scopePos = hooksBlock.indexOf('g2w-scope-guard');
  assert(limitsPos < scopePos, 'Resource limits should come before scope guard in hook order');
});

test('resource-limits matches on Write|Edit|Bash', () => {
  const hooksBlock = installSrc.split('const G2W_HOOKS')[1].split('function copySkills')[0];
  assert(hooksBlock.includes("matcher: 'Write|Edit|Bash'"), 'Resource limits should match Write|Edit|Bash');
});

test('install creates default resource-limits.json', () => {
  assert(installSrc.includes('createDefaultResourceLimits'), 'Should call createDefaultResourceLimits on install');
  assert(installSrc.includes('resource-limits.json'), 'Should reference resource-limits.json config');
});

test('commit-guard detects git commit', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'hooks', 'g2w-commit-guard.js'), 'utf8');
  assert(src.includes('git\\s+commit'), 'Should detect git commit');
  assert(src.includes('git\\s+push'), 'Should detect git push');
  assert(src.includes('exit(1)'), 'Should hard block with exit code 1');
});

// ─── Test: installed skill copy matches source ───
console.log('\n🔄 Skill sync:');

test('Installed ready2save matches source', () => {
  const installedPath = path.join(os.homedir(), '.claude', 'commands', 'g2w', 'ready2save.md');
  if (!fs.existsSync(installedPath)) {
    throw new Error('Installed ready2save not found — run npm install first');
  }
  const installed = fs.readFileSync(installedPath, 'utf8');
  const source = readySave;
  assert(installed === source, 'Installed copy should be identical to source');
});

// ─── Results ───
console.log(`\n${'─'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('\n⚠️  FIXES NEEDED — do not ship until all tests pass');
  process.exit(1);
} else {
  console.log('\n✅ All tests pass — fixes verified');
  process.exit(0);
}
