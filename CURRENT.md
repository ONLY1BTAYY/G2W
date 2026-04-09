## Last Completed
Bug fixes, auto-install design tools, code audit pipeline, CLI commands (2026-04-08)

**What was done this session (1.0.24 → 1.0.27):**

**Bug fixes:**
- `ready2save` — no longer asks user what was done. Extracts everything from conversation history automatically.
- Trust Layer hook matcher — changed from `Edit|Write|Bash` to `Edit|Write`. Was blocking git commits even after user approved them. Fixed in both settings.json and install.js so new installs don't have this bug.
- Fixed broken MemPalace reference in ready2save (`/3.0.12:mine` → `/mempalace:mine`)
- Synced both copies of ready2save (skills/ and .claude/skills/g2w/)

**Automatic code audit pipeline:**
- `bring2life` Phase 2b — auto-audits codebase during onboarding, writes ERRORS.md with bugs, dead code, anti-patterns, security issues. File paths, line numbers, specific descriptions.
- `The Leader` Phase 1b — triggers code audit before Challenger reviews. Skips if ERRORS.md exists and is <7 days old.
- `The Challenger` — now reads ERRORS.md as context. Flags plans that ignore known issues.
- `The Inspector` — updates ERRORS.md after verification. Marks resolved issues, adds new findings.
- README Optional Methods updated to show Leader can trigger code audits.

**Auto-install design tools (4 free MCP servers):**
- Context7 — live library docs (research + planning)
- Shadcn/UI MCP — real React component implementations
- Tailwind CSS MCP — utility classes, CSS conversion
- A11y MCP — accessibility audits, WCAG compliance
- All auto-install during `g2w` setup. No API keys needed.

**Power-Ups system:**
- Install output now shows included tools + Power-Ups with signup links
- Added to Power-Ups: 21st.dev, Motion, Figma MCP, Marketing Skills, Exa, Firecrawl, Repomix, MemPalace, Superpowers
- `g2w power-ups` CLI command — shows all optional tools with links
- `g2w update` — now syncs skills, hooks, AND MCP servers
- Clean uninstall removes MCP servers along with hooks and skills
- README split into "What Ships With G2W" and "Power-Ups" sections

**Key decisions & WHY:**
- Auto-install only free, no-key tools — trust means not silently installing things that need API keys or cost money
- Code audit is automatic, never optional — users always want to know the health of their code, they just shouldn't have to ask
- Trust Layer removed from Bash matcher — the prompt was telling Claude "no commits without approval" even after approval was given. Root cause of the commit-blocking bug.
- Marketing Skills added as Power-Up not auto-install — not every project needs marketing, but it's there for product builders

## In Progress
(none)

## Next
- [ ] Build identity card system into `build2gether` skill (browser UI + skill update)
- [ ] Wire Superpowers into The Foundation for Claude users
- [ ] Wire MemPalace into `back2it` and `ready2save`
- [ ] Run Blackhole VST through `bring2life` → `get2work` as first real test of The Foundation
- [ ] Build `g2w power-ups` interactive setup (walk user through key entry for each tool)

## Session Notes — 2026-04-08 (bug fixes + design tools + code audit)

**What was built:** See "Last Completed" above — all shipped in versions 1.0.24 through 1.0.27.

**Key decisions & WHY:**
- Context7 auto-installs because it's the most-used tool (GSD and G2W both reach for it first) and it's completely free with no key.
- Shadcn/UI, Tailwind, A11y auto-install because most G2W users are building things with UIs — even VST builders need these.
- 21st.dev and Motion are Power-Ups because they need free API keys — user has to take an action.
- Code audit baked into The Leader's pipeline (not a separate command) so it happens automatically in the normal flow.
- `g2w update` now syncs everything (not just skills) because MCP servers and hooks can change between versions too.

**What to read first next session:**
- This file
- `lib/install.js` — the MCP server config and power-ups output
- `skills/bring2life.md` — Phase 2b code audit
- `skills/the-leader.md` — Phase 1b code audit trigger

---

## Previous Sessions

### Trust Layer / A-Game sprint (2026-04-07)

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
- [ ] Build identity card system into `build2gether` skill (browser UI + skill update)
- [ ] Wire Superpowers into The Foundation for Claude users
- [ ] Wire MemPalace into `back2it` and `ready2save`
- [ ] Run Blackhole VST through `bring2life` → `get2work` as first real test of The Foundation
- [x] npm published as `@only1btayy/g2w@1.0.18` ✅

## Session Notes — 2026-04-08 (build2gether identity system + MemPalace)

**What was designed (not yet built):**

### Identity Card System for `build2gether`
- When user runs `build2gether`, Claude asks "What are we building today?"
- Based on their answer, Claude generates 3 identity cards dynamically
- Each card has: name, tagline, icon, color, vibe tags, quote, "Inspired by" companies
- User picks one — that persona becomes how Claude shows up for the entire build session
- If user says "plugin" without specifying, Claude asks: FX plugin or instrument (VST)?
- Browser UI confirmed as the display format — full HTML card picker served locally
- Visual style LOCKED IN — dark glass cards, accent colors per card, hover glow, click-to-lock
- Demo file at `projects/g2w/assets/identity-demo.html`
- Terminal version also built at `projects/g2w/assets/terminal-demo.js` (ANSI colored boxes)

**Example identities for VST/plugin builds:**
- The Sound Scientist — DSP-first, math-driven. Inspired by: FabFilter, iZotope, Eventide
- The Feel Chaser — musicality over math, analog warmth. Inspired by: Moog, Arturia, UAD
- The Workflow Obsessive — UX-first, live-ready, minimal. Inspired by: Native Instruments, Ableton, Bitwig

**Key decisions & WHY:**
- Identity generated FROM what user wants to build — not a static list. Relevance is the whole point.
- "Inspired by" companies added to each card — gives credibility, tells user what world they're operating in
- FX vs VST clarifying question added to Phase 0 — changes which identities get generated
- Browser UI chosen over terminal for identity picker — can go fully visual, hover effects, click interaction
- Terminal version still built for environments without browser preview

### Stack Decisions
- **Superpowers** — wired into The Foundation for Claude users (Visionary → writing-plans, Challenger → requesting-code-review). Graceful fallback for non-Claude platforms.
- **MemPalace** — integrated as the memory layer now. `back2it` queries it, `ready2save` writes to it. Zero extra install for users — ships as part of G2W setup.
- **Native G2W Memory** — deferred to v2. Build our own lightweight SQLite-based memory layer, bundle it in the npm package. Bigger announcement, full ownership. "G2W ships with its own memory. You don't install anything. It just remembers."

### Acknowledgements (to add to README)
- [johnkf5-ops/the-dev-squad](https://github.com/johnkf5-ops/the-dev-squad) — inspired The Foundation's multi-agent pipeline
- John Knopf — modular doc system approach. His words: *"Take it, run with it, use it, modify it, make it better. That's the whole point."*
- Use "Acknowledgements" not "Contributors" — inspired by their ideas, not their code

### Repomix Integration
- Use Repomix inside `bring2life` as a step — packs entire codebase into one AI-optimized file
- The Visionary reads that file cold to generate all 10 G2W docs — faster than scanning files one by one
- Full `bring2life` flow with both tools: Repomix packs → Visionary writes docs → MemPalace mines → G2W live
- README to get a "Power-Ups" section listing MemPalace, Repomix, and Superpowers as optional installs that make G2W stronger
- G2W orchestrates both tools — user doesn't have to think about them

### MemPalace Setup (done this session)
- Installed: `claude plugin marketplace add milla-jovovich/mempalace` + `claude plugin install --scope user mempalace`
- Python package installed: `pip install mempalace`
- Palace initialized in Claudes Brain root with rooms: agents, docs, logs, projects, research, tasks, scripts, general
- Real projects added: Blackhole VST, Mission Control, OGX Store, G2W
- Mining started (`python -m mempalace mine .`) — 3720 files being indexed
- Trust Layer hook updated — added NOTE that explicit user instructions are already approved (fixes npm publish blocking issue)

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
