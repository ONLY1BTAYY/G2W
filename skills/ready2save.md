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

   Do NOT ask the user what was done, what to save, or what decisions were made. You witnessed the entire session — extract it yourself and present it. The user confirms or corrects your summary. Never ask them to recall.

1b. **Harvest traps** — If any "don't do this again" lessons were learned this session, write them as new TRAP entries in `~/.g2w/projects/[active-project]/TRAPS.md`. Use the next available TRAP number. These are patterns that looked right but broke things — they survive context clears so the same mistake never happens twice.

1c. **Update golden cases** — If any golden cases in `TESTING.md` were verified this session (by Inspector or true2plan), update their "Last Verified" column with today's date.

1d. **Record health score** — If `/g2w:true2dagame` was run this session, include the overall score (e.g., "Health: 4.2/5") in the session notes so `back2it` can reference it next session.

2. **Identify the active project** — Read `~/.g2w/CURRENT.md` (Windows: `C:/Users/[username]/.g2w/CURRENT.md`). If it has an `active:` line, that's the project. Use it. Do NOT ask.
   - Only if the file doesn't exist or has no `active:` line: list folders in `~/.g2w/projects/` and ask which one. This is the ONLY scenario where you ask.

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

4b. **Mine into MemPalace (if installed):** Run `/mempalace:mine` on the project's `.g2w/CURRENT.md` to index this session's decisions into MemPalace. This makes them searchable across future sessions even after context clears. If MemPalace isn't installed, skip this step silently.

5. **Commit** everything that was verified this session:
   ```
   type: short summary

   - What changed
   - What changed
   - Verified: [how it was verified]
   ```

   Keep it lean: do NOT run git status, git diff, or git log — you already know what changed. Present the commit message to the user. Wait for approval. Then run it as **one single Bash call**:
   ```
   git add [files] && git commit -m "type: summary

   - What changed
   - Verified: [how]"
   ```
   Never split git add and git commit into separate Bash calls.

6. **Announce with personality:**
   End the session with a closing quote. Pick ONE at random from this list:

   **Prefixed quotes** — format as: "Remember, {user's first name}... {quote}"
   - "If you don't decide who you are, someone else will do it for you." — Ocean Veau
   - "Life is not only about ourselves, it's about the impact we have on others."
   - "As a man thinketh in his heart, so is he. So whatever you believe you are — you're right."
   - "Great things are done by a series of small things brought together. One brick at a time my friend. You got this."
   - "What other people think of you is none of your business. Besides, it's not like they got anything better to talk about. :)"
   - "Next time you look up into the stars, remember that you're looking at a mirror." — Ocean Veau
   - "Money only has purpose & meaning when a human touches it so... who really has the power?"
   - "It's going to work or it's going to work. Ain't no other options my friend."

   **Standalone quotes** — format as: "{quote}" — {author}
   - "A man grows by the greatness of his task."
   - "If you do what's easy, your life will be hard. But if you do what's hard, your life will be easy."
   - "Sometimes good things fall apart so better things can fall together."
   - "Ego says: 'Once everything falls into place, I'll feel peace.' Spirit says: 'Find peace and everything will fall into place.'"
   - "Be kind, not nice. Nice is a mask that even your worst enemy can wear." — Ocean Veau
   - "Rules were made to be broken, but principle will get you where you need to go." — Ocean Veau
   - "The best time to plant a tree was 20 years ago. The second best time is right now." — Chinese Proverb
   - "Don't be afraid to give up the good to go for the great." — John D. Rockefeller
   - "The man who moves a mountain begins by carrying away small stones." — Confucius
   - "He who has a why to live can bear almost any how." — Nietzsche
   - "You don't rise to the level of your goals. You fall to the level of your systems." — James Clear
   - "The cave you fear to enter holds the treasure you seek." — Joseph Campbell
   - "You can't build a reputation on what you're going to do." — Henry Ford
   - "Everybody wants to be a beast until it's time to do what beasts do."
   - "A society grows great when old men plant trees in whose shade they shall never sit." — Greek Proverb
   - "They tried to bury us. They didn't know we were seeds." — Mexican Proverb
   - "What you leave behind is not what is engraved in stone monuments, but what is woven into the lives of others." — Pericles

   Format the full closing as:
   > Saved. Context is clean. Next session, type `/g2w:back2it` to pick up right where we left off.
   >
   > {closing quote}

## Rules

- Never commit unverified work — if something wasn't tested, say so and don't include it
- The handoff note must capture WHY decisions were made, not just what was done
- Extract decisions from the conversation — never make the user recall work you already witnessed
- Do not clear context or close anything — that's the user's call
