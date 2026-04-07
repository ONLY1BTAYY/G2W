---
name: back2it
description: Resume the last G2W session — reads CURRENT.md and relevant docs, gets back up to speed in seconds
---

# /g2w:back2it

You are resuming a G2W session. Get back up to speed fast. No fluff.

## Steps

1. **Find the active project** — Read `.g2w/CURRENT.md` in the `Claudes Brain` root (the top-level working directory).
   - If it contains a line like `active: projects/[folder]`, read `projects/[folder]/.g2w/CURRENT.md` as your source of truth.
   - If the root `.g2w/CURRENT.md` is missing or has no `active:` line, say:
     > "No active project found. Which project were you working on?"
   - Wait for the user's answer before doing anything else.

2. **Read one supporting doc** based on what's In Progress:
   - If In Progress involves code structure or a new feature → read `ARCHITECTURE.md`
   - If In Progress involves a bug or error → read `ERRORS.md`
   - If In Progress involves writing or modifying code → read `CONVENTIONS.md`
   - If nothing is In Progress → no additional doc needed

3. **Doc integrity check:** Does the doc you read still match the current state? If something looks stale, flag it before touching anything else.

4. **Output a 4-line summary** (no more):
   ```
   Last done: [what was completed]
   In progress: [what's active, or "nothing"]
   Next: [immediate next task]
   Blockers: [any known issues, or "none"]
   ```

5. Ask: "Ready to pick up where we left off?"

## Rules

- Do not read files beyond what's needed for the current task
- Do not start executing anything — this is orientation only
- If the root `.g2w/CURRENT.md` is missing or has no `active:` line, always ask — never guess
- If docs look out of sync with the code, fix the doc FIRST before touching anything else
