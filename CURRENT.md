## Last Completed
Trust Layer upgraded to guardrail-tier + Foundation skills built + hooks ship on install (2026-04-07)

**What was done — Trust Layer / A-Game sprint:**
- `~/.claude/hooks/g2w-scope-guard.js` — new PreToolUse command hook. Reads `## Scope` block from `~/.g2w/CURRENT.md`, returns exit code 1 (hard stop) if file being edited is not in declared scope. Warns loudly (not silently passes) if CURRENT.md exists but has no Scope block.
- `~/.claude/hooks/g2w-agame.js` — new PreToolUse command hook. Fires before every Write/Edit, outputs all 4 A-Game questions as `additionalContext`. Visible audit trail, not a hard stop (by design — forcing out-loud reasoning IS the enforcement).
- `get2work.md` + `cut2it.md` — both updated with step 3b/2b: immediately after scope approval, write `## Scope` block to `~/.g2w/CURRENT.md`. This is what the hook reads. Synced to `.claude/skills/g2w/`.
- `settings.json` — scope guard wired as first PreToolUse command hook, A-Game second, then existing prompt-guard and Trust Layer behavioral prompt. Trust Layer prompt stripped of A-Game (now has its own hook). All README claims now technically backed.
- Design decision locked: CURRENT.md is task-level scope contract (not PLAN.md). Hooks always read from `~/.g2w/CURRENT.md`. Rewritten at start of every `get2work` or `cut2it` session.

**What was done — Foundation skills:**
- `the-visionary.md` — zero unresolved decisions, Builder must not need to ask a single question
- `the-challenger.md` — pure adversarial, no conditional passes, no "supportive-adversarial", rationalization table
- `the-builder.md` — locked to declared scope, hard stop on any deviation, names the "while I'm in here" rationalization explicitly
- `the-inspector.md` — proof-based verification only, loops until clean, user must confirm in actual environment
- `the-leader.md` — owns full pipeline, no phase skipping under any pressure, rationalization table, "should be fine" = hard stop
- All 5 synced to `projects/g2w/skills/` and `.claude/skills/g2w/`. G2W-SPEC.md status table updated to ✅.
- Baseline tests run on all 5 agents before writing — failures caught and addressed in each skill.

**Key decisions & WHY:**
- A-Game uses `additionalContext` not exit code 1 — forcing visible out-loud reasoning is stronger than a hard stop for judgment questions. Hard stops are for scope violations only.
- Scope guard warns loudly (not silently passes) when CURRENT.md exists but has no Scope block — prevents invisible failure mode where guard does nothing mid-session.
- Trust Layer behavioral claims (answer first, no commits without approval, I don't know instead of guessing) remain prompt-tier — no structural enforcement equivalent exists for behavioral rules. README is honest about the distinction.

## In Progress
(none)

## Session Notes — 2026-04-07 (hooks audit + README gap close)

**What was done:**

Three gaps closed in `~/.claude/settings.json` — all verified by reading the file back after each edit.

**1. Verify rule added to Trust Layer prompt hook (`Edit|Write|Bash` matcher)**
- Rule added: "After every Write or Edit, read the file back immediately and confirm the content is correct before declaring it done. Never say 'done' without proof."
- Why: Last session identified this as a missing enforcement — saves were being declared done without proof.

**2. Context warning hook fixed and threshold corrected**
- `PostMessage` is not a valid Claude Code hook event — was silently doing nothing every session since it was written.
- Replaced with `UserPromptSubmit` — fires on every message Brian sends, injects reminder into main model's context so Claude self-monitors.
- Threshold changed from "80% used" to "30% used (70% remaining)" — much earlier warning so there's time to save cleanly.
- Message: "Hey — we've hit 30% context used. Want me to run /g2w:ready2save to save progress and clear context?"

**3. [Inference] / [Unverified] labels added to Trust Layer prompt**
- README claimed these labels were enforced. They were not in the actual hook.
- Added: "Label uncertain claims — use [Inference] when reasoning from incomplete data and [Unverified] when stating something not yet confirmed."
- README claim is now backed by actual enforcement.

**4. build2gether skill verified**
- README claims "research silently in background" — confirmed Phase 1 of the skill does exactly this. No gap.

**Key decisions & WHY:**
- `UserPromptSubmit` over `Stop` for context warning — fires before Claude processes each turn so warning can influence the response.
- 30% used (not 30% remaining) — Brian's intent: early warning with plenty of context left to run ready2save cleanly.
- No new hooks created — all changes merged into existing hooks per standing rule.

## Next
- [ ] Run Blackhole VST through `bring2life` → `get2work` as first real test of The Foundation
- [ ] npm publish once Blackhole test passes (The Foundation is now complete)

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
