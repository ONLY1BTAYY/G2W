---
name: back2it
description: Resume the last G2W session — reads CURRENT.md and relevant docs, gets back up to speed in seconds
---

# /g2w:back2it

You are resuming a G2W session. Get back up to speed fast. No fluff.

## Steps

1. **Read the G2W runtime root file** — the path is `~/.g2w/CURRENT.md` (on Windows: `C:/Users/[username]/.g2w/CURRENT.md`). This is the ONLY place to look. Do NOT read any `.g2w/` folder inside the working directory or project folder — those are old and wrong.

2. **Check the Active Project:**
   - If an active project is set → read `~/.g2w/projects/[active-project]/CURRENT.md`
   - If no active project is set → list all folders in `~/.g2w/projects/`. If more than one, show them and ask which to resume. If only one, use it and set it as active. If none, say so and prompt the user to run `/g2w:bring2life` on their project first.

2b. **Query MemPalace (if installed):** Run `/3.0.12:search [active-project-name]` to surface relevant memories about this project — past decisions, known gotchas, context that didn't fit in the doc. Use what comes back to enrich the session summary. If MemPalace isn't installed, skip this step silently.

3. **Read one supporting doc** from `~/.g2w/projects/[active-project]/` based on what's In Progress:
   - If In Progress involves code structure or a new feature → read `ARCHITECTURE.md`
   - If In Progress involves a bug or error → read `ERRORS.md`
   - If In Progress involves writing or modifying code → read `CONVENTIONS.md`
   - If an active plan exists → read `PLAN.md`
   - If nothing is In Progress → no additional doc needed

4. **Doc integrity check:** Does the doc you read still match the current state? If something looks stale, flag it before touching anything else.

4b. **Health score check:** If the last session notes in CURRENT.md include a health score (e.g., "Health: 3.2/5") and it's below 3.5, suggest running `/g2w:true2dagame` before starting work.

5. **Output a 4-line summary** (no more):
   ```
   Project: [active-project]
   Last done: [what was completed]
   In progress: [what's active, or "nothing"]
   Next: [immediate next task]
   Blockers: [any known issues, or "none"]
   ```

6. **Streak check:** Read `~/.g2w/streak.json` (Windows: `C:/Users/[username]/.g2w/streak.json`). If it exists, check the `lastDate` and `count` fields:
   - If `lastDate` was yesterday, increment `count` by 1 and update `lastDate` to today. Write the file back.
   - If `lastDate` is today, don't change anything.
   - If `lastDate` is older than yesterday, reset `count` to 1 and set `lastDate` to today. Write the file back.
   - If the file doesn't exist, create it with `{ "lastDate": "[today]", "count": 1 }`.

   Display the streak only if count >= 2, using this tone (calm, professional, encouraging):
   - 2-3 days: "{count} days in a row, {first name}. Consistency compounds."
   - 4-7 days: "{count}-day streak. This is how things get built, {first name}."
   - 8-14 days: "{count} days straight. Most people quit by now. You didn't."
   - 15+ days: "{count}-day streak. At this point, it's not discipline — it's who you are."

7. Ask: "Ready to pick up where we left off?"

## Rules

- ALWAYS read `~/.g2w/CURRENT.md` first (Windows: `C:/Users/[username]/.g2w/CURRENT.md`) — never assume which project is active
- NEVER read `.g2w/CURRENT.md` from the working directory — that is the old system and must be ignored
- Do not read files beyond what's needed for the current task
- Do not start executing anything — this is orientation only
- If docs look out of sync with the code, fix the doc FIRST before touching anything else
