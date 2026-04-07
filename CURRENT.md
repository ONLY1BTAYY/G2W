## Last Completed
Skills updated — runtime/source separation fully wired (2026-04-07)

**What was done:**
- `~/.g2w/` runtime created with `projects/` subfolder and active project tracking
- `bring2life` — writes to `~/.g2w/projects/[name]/`, sets active project, adds PLAN.md as 11th doc
- `back2it` — reads `~/.g2w/CURRENT.md` first, project picker if no active project
- `ready2save` — reads/writes to `~/.g2w/` runtime root
- `get2work` — full existing codebase Foundation flow built in
- All 4 skills synced to `projects/g2w/skills/` (npm source) and pushed

## In Progress
(none)

## Next
- [ ] Build The Foundation skills using `superpowers:writing-skills` — baseline test BEFORE writing each skill
- [ ] Run Blackhole VST through `bring2life` → `get2work` as first real test
- [ ] Trust Layer hook fix: add verify rule to existing PreToolUse hook in settings.json (edit existing hook, don't create new one)

## The Foundation — What It Is
Five agents. One mission: get it right the first time.

| Agent | Role |
|-------|------|
| The Leader | Manages the team, keeps everything on track |
| The Visionary | Writes complete plan — real decisions, no placeholders |
| The Challenger | Adversarial review — finds every way the plan could fail |
| The Builder | Builds exactly what the locked plan says, nothing extra |
| The Inspector | Verifies everything against the plan, loops until clean |

The plan is the contract. Builder never touches code until Challenger approves.
Full spec in `G2W-SPEC.md` under "The Foundation — Agent Team".

## Session Notes — 2026-04-07

**What was built:**
- Ran `bring2life` on Blackhole VST v1.2 as first real-world G2W POC
  - Blackhole C++ VST already had most docs — created missing `CURRENT.md`
  - Generated all 10 G2W docs fresh for `blackhole-ui-v2/` (React UI repo had nothing)
- Moved all generated docs into `.g2w/` subfolders inside each project
- Updated 6 skills (`bring2life`, `back2it`, `ready2save`, `get2work`, `true2plan`, `true2dagame`) to read/write from `.g2w/` instead of project root
- Synced skill changes to `projects/g2w/skills/` (npm source)
- Brian also refined `back2it` to use a root-level `.g2w/CURRENT.md` pointer system (active project tracking)
- Brian refined `ready2save` to extract decisions from conversation history automatically

**Key decisions & WHY:**
- `.g2w/` subfolder (not project root) — keeps G2W docs isolated from GSD's `.planning/` mess and source files. Follows `.git/`, `.eslintrc` pattern. Clean, invisible unless you look.
- Central pointer (`Claudes Brain root .g2w/CURRENT.md` with `active: projects/[x]`) — so `back2it` always knows which project to resume without asking.

**What to read first next session:**
- This file + `skills/back2it.md` and `skills/ready2save.md` (Brian updated them this session)

## Session Notes — 2026-04-07/08

**What actually happened (the full story):**

Brian came in to resume G2W work. The active project in root `.g2w/CURRENT.md` pointed to `projects/g2w` but Claude didn't read G2W's CURRENT.md first. Instead Claude went straight to Blackhole when Brian mentioned it.

Brian asked about a "code audit" that was in a previous plan. Claude couldn't find it anywhere — it was never saved. This is a direct failure of the G2W trust layer: if it's not in the files, it's lost.

Claude then re-ran `bring2life` on both Blackhole projects even though bring2life had already been successfully run last session and the docs were already in `.g2w/` subfolders. This was wasted work.

Brian got frustrated and said to wipe the Blackhole .g2w docs. Claude wiped them. Now the working docs from last session are gone.

Brian then explained The Foundation — the 5-agent team (Visionary, Challenger, Builder, Inspector, Leader) that is supposed to be the core of G2W's execution pipeline. This was never built as skills. Claude implied G2W was ready when it wasn't. That's the core failure of this session.

Brian wanted this all saved to CURRENT.md. Claude saved a bullet list instead of the full story. Brian had to explicitly call this out.

**The Foundation — what it is and why it matters:**
- This is the most important missing piece in G2W right now
- Without it, bring2life generates docs but there's no trusted execution pipeline
- Running Blackhole through G2W is pointless until The Foundation exists
- The skills need to be built using `superpowers:writing-skills` — baseline test BEFORE writing each skill
- Full spec is in `G2W-SPEC.md` under "The Foundation — Agent Team"

**What NOT to do next session:**
- Do NOT run bring2life on Blackhole again
- Do NOT restore the Blackhole .g2w docs
- Do NOT publish npm until The Foundation is built
- Do NOT ask Brian the 3 questions about The Foundation again — he's already answered them in G2W-SPEC.md, read it first

**What to do next session:**
1. Read this file
2. Read G2W-SPEC.md section "The Foundation — Agent Team"
3. Read `superpowers:writing-skills` skill
4. Ask Brian the minimum questions needed that aren't answered in the spec
5. Build The Foundation skills

## Lessons Learned
- **NEVER assume and jump ahead before hearing from the user.** When Brian says "you never did this before" or similar, STOP and wait for his answer. Do not launch agents or read files speculatively.
- G2W exists specifically to prevent Claude from going rogue. Honor the protocol: wait for user interaction before acting.
- **Read CURRENT.md for the active project FIRST before doing anything.** The root `.g2w/CURRENT.md` points to the active project. Read that project's CURRENT.md immediately.
- **Saving means the full story, not a bullet list.** If something important happened in a session, write it as a narrative with enough context that the next Claude instance understands what went wrong and why.
- **Don't call something saved until it actually captures what matters.**
- **Always verify after saving — read the file back, confirm it's there. Never say "done" without proof.**
- **Never say "I'll do that from now on" without immediately writing it down somewhere it will survive the session.**
- **TODO (do this FIRST next session): Add verify rule to the existing Trust Layer PreToolUse prompt hook in settings.json — add "After every Write/Edit, read the file back and confirm what was saved before calling it done." Do NOT create a new hook. Edit the existing Trust Layer prompt hook. Use update-config skill. Test it fires.**
