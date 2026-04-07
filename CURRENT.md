## Last Completed
G2W npm install mechanism built (2026-04-07) — CLI + install/update/uninstall logic complete.

**What was done:**
- All 9 skill files written to `skills/` (source of truth for npm package)
- `package.json` created — name `g2w`, bin `./bin/g2w.js`, files: bin/ lib/ skills/
- `bin/g2w.js` — CLI entrypoint: install / update / uninstall / help
- `lib/install.js` — copy skills, merge hooks, prompt for global vs local
- README How 2 Install section updated to reflect `g2w install` flow
- `.claude/settings.json` created with Trust Layer + A-Game + context warning hooks

**Key decisions:**
- No postinstall — user runs `g2w install` explicitly after `npm install -g g2w`
- Why: postinstall can't safely resolve local project path during global npm install
- Global = `~/.claude/`, Local = `process.cwd()/.claude/`
- Hooks merge safely — won't duplicate if already present
- `ready2rock` removed — npm replaces it as the install mechanism

## In Progress
(none)

## Next
- [ ] Publish to npm (`npm publish`)
- [ ] Run `/g2w:bring2life` on Blackhole VST as first real test case (proof of concept)
- [ ] Clean up `pics/` folder from repo
- [ ] Swap static badges for dynamic npm badges after publish
- [ ] Add G2W-SESSION.md entry for today's decisions
