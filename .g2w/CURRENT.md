## Last Completed
G2W v1.0.15 published — fixed back2it active project pointer + ready2save auto-extract decisions (2026-04-07)

**What was done:**
- `back2it` now reads root `.g2w/CURRENT.md` for `active: projects/[folder]` pointer before loading project docs
- `ready2save` now auto-extracts decisions from conversation — no longer asks user manually
- Both `skills/` and `.claude/skills/g2w/` copies synced
- Trust Layer hook updated: "NEVER assume and jump ahead before hearing from the user"
- Committed and published as v1.0.15

**Key decisions:**
- Root `.g2w/CURRENT.md` as pointer — simplest solution, tied to natural `ready2save` workflow, no scanning/guessing
- Auto-extract decisions — Claude witnessed the session, making the user recall it is redundant and breaks flow
- Trust Layer is the enforcement layer for "wait for user" — baked into hooks so it runs every session, not just when Claude remembers

## In Progress
(none)

## Next
- Update global install: `npm install -g @only1btayy/g2w` to get v1.0.15
- Test `back2it` in a fresh session — confirm it reads pointer and loads correct project CURRENT.md

## Session Notes — 2026-04-07
**What was built:** Active project pointer system + auto-decision extraction in ready2save

**Why:** `back2it` was failing silently because CWD is `Claudes Brain/` not a project folder. Root pointer solves this cleanly without scanning.

**Don't do this again:** Never launch agents or read files speculatively before the user answers. G2W exists to prevent this — honor the protocol.

**Read first next session:** `.g2w/CURRENT.md` (this file) then test with a fresh `/g2w:back2it`
