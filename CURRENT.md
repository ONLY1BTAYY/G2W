## Last Completed
G2W design session (2026-04-07) — Command system finalized, install strategy locked, naming fixed.

**Key decisions this session:**
- `/g2w:ready2rock` removed — plugin install handles setup, `build2gether` covers new projects, `bring2life` covers existing. No overlap needed.
- Post-plan prompt locked: "Plan's locked — ready to build? (`/g2w:get2work`)" — conversational tone + command always visible.
- Context warning feature locked: `PostMessage` hook monitors usage, fires at 80% — "Hey, we're getting close to the compact limit — we should save everything and clear context so you can save usage. Want me to run `/g2w:ready2save`?"
- Install strategy: npm package (`npm install -g g2w`) — postinstall script copies skills + hooks to `~/.claude/`. Claude-first, expand to Codex/Gemini in v2.
- Option B (cross-platform day one) rejected — hooks don't exist on other platforms, Trust Layer can't be guaranteed, triple maintenance burden.
- Files and folder renamed: `gw2/` → `g2w/`, `GW2-SESSION.md` → `G2W-SESSION.md`, `GW2-SPEC.md` → `G2W-SPEC.md`.

## In Progress
Nothing — session wrapped clean.

## Next
- Build skill files: `build2gether`, `bring2life`, `get2work` first
- Expand Trust Layer hook with full Reality Filter rules
- Add sharper Challenger questions to Foundation pipeline docs
- Run Blackhole through `/g2w:bring2life` as first real test case
- Type `G2W` at the start of a new conversation to resume
