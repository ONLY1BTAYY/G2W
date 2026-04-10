## Last Completed
G2W Hook Architecture Fix — v1.0.30 (2026-04-10)

**What was done this session (1.0.28 → 1.0.30):**
- Removed UserPromptSubmit prompt hooks from install.js — they intercepted Brian's messages and broke chat entirely
- Removed all prompt-type hooks from G2W_HOOKS. Only command hooks now (JS scripts that return pass/fail)
- Added commit-guard hook (PreToolUse on Bash) — hard blocks git commit/push without user approval
- install.js mergeHooks now cleans up old UserPromptSubmit/PostMessage hooks on update (migration path)
- Synced .claude/skills/g2w/ready2save.md copy to match source (was stale — step 2 reads CURRENT.md, step 5 chains with &&)
- Updated tests to match new architecture — 22/22 passing
- Restored Brian's global ~/.claude/settings.json — permissions + plugins only, no hooks
- G2W project .claude/settings.json — 3 command hooks on PreToolUse only (scope-guard, a-game, commit-guard)

**Key decisions:**
- Trust Layer behavioral rules belong in CLAUDE.md, NOT in hooks. Hooks can't enforce behavioral rules — if Claude ignores CLAUDE.md it'll ignore a hook prompt too.
- Only use hooks for things that can be mechanically enforced: scope guard (blocks out-of-scope edits), A-Game (forces reasoning), commit guard (blocks unauthorized commits).
- UserPromptSubmit with type:prompt should NEVER be used — it intercepts the user's messages before they reach Claude.
- Global settings should have no hooks — hooks belong in project-scoped settings.

## In Progress
(none)

## Next
Brian tests hooks in a live G2W session — verify scope guard, A-Game, and commit guard fire correctly without breaking chat.

## Session Notes — 2026-04-10

**What broke:** UserPromptSubmit prompt hooks intercepted Brian's chat messages. His messages went into the settings pipeline instead of reaching Claude. Had to rename settings.json to .bak and start fresh with {}.

**Root cause:** Moving Trust Layer from PreToolUse to UserPromptSubmit seemed like a fix (fire per-message not per-tool-call) but UserPromptSubmit with type:prompt sits between the user and Claude. It's the wrong hook point for behavioral rules.

**Architecture now:**
- CLAUDE.md = behavioral rules (Trust Layer)
- PreToolUse command hooks = mechanical enforcement (scope guard, A-Game, commit guard)
- UserPromptSubmit = don't touch it
- Global settings = permissions + plugins only, no hooks

**Lesson:** Prompt hooks should only be used on PreToolUse where they add context before a specific tool fires. Never on UserPromptSubmit where they intercept the user's actual messages.
