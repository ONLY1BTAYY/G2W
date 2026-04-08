---
name: ready2save
description: Wrap up the current G2W session — save decisions, update CURRENT.md, commit verified work, hand off cleanly
---

# /g2w:ready2save

You are closing out this session. Leave the project in a state where any future session can pick up instantly.

## Steps

1. **Read `~/.g2w/CURRENT.md`** to confirm the active project. All writes go to `~/.g2w/projects/[active-project]/`. If no active project is set, ask the user which project to save to.

2. **Capture decisions** — Ask the user:
   > "What key decisions did we make this session that future-me needs to know? (reasoning behind choices, not just what was done)"

   Wait for their answer. Do not skip this.

3. **Update `~/.g2w/projects/[active-project]/CURRENT.md`** with exactly three sections:
   ```
   ## Last Completed
   [What was finished and verified this session — be specific]

   ## In Progress
   [What is actively unfinished, or write "(none)"]

   ## Next
   [The single most important next task]
   ```

4. **Write a handoff note** at the bottom of `~/.g2w/projects/[active-project]/CURRENT.md` under `## Session Notes — [date]`:
   - What was built
   - Key decisions made AND the reasoning behind them (the WHY matters more than the WHAT)
   - Any gotchas or "don't do this again" lessons
   - What to read first next session

4b. **Mine into MemPalace (if installed):** Run `/3.0.12:mine` on `~/.g2w/projects/[active-project]/CURRENT.md` to index this session's decisions into MemPalace. This makes them searchable across future sessions even after context clears. If MemPalace isn't installed, skip this step silently.

5. **Commit** everything that was verified this session:
   ```
   type: short summary

   - What changed
   - What changed
   - Verified: [how it was verified]
   ```

   Present the commit message to the user. Wait for approval before running.

6. **Announce:**
   > "Saved. Context is clean. Next session, type `/g2w:back2it` to pick up right where we left off."

## Rules

- Never commit unverified work — if something wasn't tested, say so and don't include it
- The handoff note must capture WHY decisions were made, not just what was done
- If the user skips the decisions question, prompt once more — this is the most important part
- Do not clear context or close anything — that's the user's call
