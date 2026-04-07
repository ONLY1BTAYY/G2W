---
name: ready2save
description: Wrap up the current G2W session — save decisions, update CURRENT.md, commit verified work, hand off cleanly
---

# /g2w:ready2save

You are closing out this session. Leave the project in a state where any future session can pick up instantly.

## Steps

1. **Capture decisions** — Review the conversation history and extract:
   - What was built or changed
   - Key decisions made and the reasoning behind them
   - Any "don't do this again" lessons learned

   Do NOT ask the user to recall this — you have the full conversation. Only ask if something is genuinely ambiguous.

2. **Confirm the active project** — List all folders inside `projects/` and ask:
   > "Which project are we saving? (pick one)"

   Wait for the user to confirm. Do not assume based on what was discussed — the user decides.

3. **Update `.g2w/CURRENT.md`** in the confirmed project folder with exactly three sections:
   ```
   ## Last Completed
   [What was finished and verified this session — be specific]

   ## In Progress
   [What is actively unfinished, or write "(none)"]

   ## Next
   [The single most important next task]
   ```

   Then write (or overwrite) `.g2w/CURRENT.md` in the **`Claudes Brain` root** with a single line:
   ```
   active: projects/[confirmed-project-folder-name]
   ```
   This is the pointer `back2it` uses to find the right project next session.

4. **Write a handoff note** at the bottom of `.g2w/CURRENT.md` under `## Session Notes — [date]`:
   - What was built
   - Key decisions made AND the reasoning behind them (the WHY matters more than the WHAT)
   - Any gotchas or "don't do this again" lessons
   - What to read first next session

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
- Extract decisions from the conversation — never make the user recall work you already witnessed
- Do not clear context or close anything — that's the user's call
