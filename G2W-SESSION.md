# G2W Session Log — 2026-04-06

## What Is G2W?

G2W stands for "It's going to work or it's going to work" — Brian's life motto. No in-between. No failure as an option. Just two paths that both lead to success.

The goal: an open source AI workflow system that combines a modular documentation strategy with a disciplined multi-agent pipeline to get as close to 99% correct code on the first try as possible. Fast, lean, trustworthy.

---

## Why We're Building This

### What went wrong before (the problem we're solving)
- GSD2 created too many folders, stale STATE.md entries, and split context across multiple Claude project folders
- Claude hallucinated Brian's responses ("Human: Now commit") and fabricated state updates
- Claude ran git commits without approval, then lied about it when confronted
- The system was too autonomous, too complex, and too opaque

### What we learned
- Knowledge should live in files, not chat context
- The simpler the system, the harder it is for Claude to go off the rails
- Trust is built by answering first, then asking to proceed — never just acting
- Two sets of eyes (separate agents) catch what one session reviewing its own work misses

---

## The Two Systems We're Combining

### System 1 — Modular Doc System (built today for Blackhole)
Inspired by advice from a developer who solved the "giant CLAUDE.md" problem.

- `CLAUDE.md` — brain/index, tells Claude what to read and when
- `ARCHITECTURE.md` — how it's built
- `CONVENTIONS.md` — how to write code for it
- `FEATURES.md` — what's built, what's broken, what's next
- `ERRORS.md` — known bugs with severity and investigation paths
- `CHANGELOG.md` — running log of what was built
- `TESTING.md` — manual test checklist + repro steps
- `SCALING.md` — distribution and platform plans
- `SECURITY.md` — anything sensitive

**Key rule:** When you change code that any doc describes, update that doc in the same session. Docs maintain themselves.

### System 2 — The Dev Squad Pipeline
Inspired by https://github.com/johnkf5-ops/the-dev-squad

- **Planner** — writes a complete plan with no placeholders, actual code
- **Plan Reviewer** — adversarial read, finds every way the plan could fail before coding starts. Loops with Planner until zero gaps remain. Plan is then locked.
- **Coder** — builds exactly what the locked plan says, nothing extra
- **Tester** — checks result against the plan, loops with Coder until all tests pass
- **Supervisor** — manages the team

**Key insight:** The plan is the code contract. By the time coding starts, every decision has been made.

---

## G2W Features Decided Today

### 1. Modular Doc System (foundation)
Every project gets the full set of .md files. CLAUDE.md reads only what the task needs — not everything every session.

### 2. The Pipeline (how work gets done)
Requirements Clarification → Plan → Plan Review (adversarial) → Build → Verify → Commit → Context Clear

### 3. Token Discipline (built-in rules)
- Read only what the current task requires
- No exploratory file reads before task is defined
- If Brian is about to test — wait for the result, don't pre-read
- Scope declaration before every task: exactly which files will be touched and why
- If scope creeps beyond declared files, stop and flag it — do not proceed

### 4. Context Management
- `CURRENT.md` — three things only: last completed, in progress, what's next. Updated at every commit.
- Before context clears: write a handoff note capturing decisions made AND the reasoning behind them (not just what, but why)
- New session reads CURRENT.md + relevant limb docs only — back up to speed in seconds

### 5. Auto-Commit System
- At every verified milestone: I write the commit message, Brian approves, it runs
- Commit message format: type + summary + bullet points of what changed + verified status
- After commit: context clears, handoff note written, new session picks up from CURRENT.md
- I announce what's happening BEFORE it happens so Brian never thinks something broke

### 6. Git Friction Reduction
- Whitelist safe git commands (add, commit, push, status, log) — no approval prompt
- Single `commit.sh` script: add → commit → push in one call, one approval

### 7. The Trust Layer ⭐ (highlight feature)
The hallucination problem comes from Claude filling gaps with invented context.
Hard rules:
- If I don't know something, I ask — I never invent
- I never simulate the user's responses
- If I'm waiting for input, I wait — full stop
- Answer the question first, then ask to proceed — never just act

### 8. Requirements Clarification Phase
Before Planner writes anything: a structured conversation that surfaces edge cases, constraints, and "what happens when X" scenarios. Every ambiguity killed before planning starts.

### 9. Regression Protection
Before touching any code: document what currently works. After the change: verify that list hasn't shrunk. Fixing one thing must not break another.

### 10. File Lock
The plan declares exactly which files get touched. Any deviation requires explicit re-approval. Not just a rule — an enforced boundary.

### 11. Definition of Done
Tied to the user's actual environment. Not "it compiled" — specific steps to verify it works in the real setup (specific build, specific DAW, specific reproduction steps).

### 12. Doc Integrity Check
At the start of any session touching a documented area: verify the doc still matches the code. If it doesn't, fix the doc first before touching anything else.

### 13. Adversarial Plan Review
The reviewer's job is explicitly to BREAK the plan, not approve it. Framed as: "Find every way this plan could fail before we write a line of code." Genuinely separate set of eyes, not the same session reviewing its own work.

### 14. Handoff Note (Why, Not Just What)
Before context clears, I capture not just what was done but WHY key decisions were made. Future sessions need the reasoning, not just the outcome.

---

## Naming

- **G2W** or **GWGW** or **G2WTimes**
- Stands for: "It's going to work or it's going to work"
- Solution providers, not problem reporters

---

## Open Source Plan

- Own repo (not inside Claudes Brain long-term)
- Trust Layer should be a highlighted feature in the README
- Doc templates easy enough for any developer to fill in under an hour for their own project
- Language/framework agnostic

---

## Key Decisions Made (2026-04-06)

1. Not using GSD2 — too many folders, too much autonomy, hallucinated state
2. Modular docs replace GSD's planning system for Blackhole
3. G2W will combine the modular doc system + Dev Squad pipeline discipline
4. Two sets of eyes for plan review — separate agents, not self-review
5. Token minimizer and context clearing are first-class features, not afterthoughts
6. Trust Layer is a highlight feature for the open source repo
7. Brian answers first, then Claude acts — never the reverse
8. Files live in `C:\Users\ocean\Desktop\Claudes Brain\gw2\` until ready for own repo

---

# G2W Session Log — 2026-04-07

## What We Decided

### Audience
G2W is for everyone — vibe coders AND advanced engineers. Language/framework agnostic.
- Low floor: any non-technical person can get started in under an hour using templates
- No ceiling: advanced users adapt it to their stack, contribute back better templates
- README is written for the vibe coder — advanced users will figure the rest out themselves

### Onboarding — Existing vs New Projects
Starting from scratch is easier (docs built alongside code). Existing codebases need `/g2w:bring2life` which:
1. Scans the codebase and auto-generates first drafts of all doc files
2. Flags gaps it couldn't fill confidently — user reviews those
3. Asks short clarifying questions to capture vision and known issues
4. Outputs a ready-to-use G2W doc system tailored to what's already there

This is a killer feature — people with messy existing codebases get the most value.

### Build Order
Build G2W first, then run Blackhole through it as the first `/g2w:bring2life` test case. Blackhole becomes the proof of concept and README case study.

### Command System — The "2" Brand
Every command uses "2" as part of the name — reinforces the motto in every interaction.

| Command | Purpose |
|---|---|
| `/g2w:ready2rock` | Install/setup G2W in a project |
| `/g2w:bring2life` | Onboard existing codebase |
| `/g2w:back2it` | Resume last session |
| `/g2w:build2gether` | Start a new project |
| `/g2w:cut2it` | Fast mode, skip ceremony |
| `/g2w:back2basics` | Strip context, start clean |
| `/g2w:get2work` | Execute current task |
| `/g2w:true2plan` | Verify work matches the plan |
| `/g2w:true2dagame` | Full system health check — are we actually playing by the rules? |
| `/g2w:ready2save` | Wrap up the session — update CURRENT.md, capture key decisions and reasoning, hand off cleanly |

`/g2w:true2dagame` output example:
```
✅ Docs in sync
✅ Plan locked
⚠️  ERR-01 unresolved
✅ Last session clean
```

### The Trust Layer — THE Core Feature ⭐⭐
Insight from a conference of millionaires/billionaires who use AI at scale: their #1 concern isn't "can it build?" — it's "can we trust and ship what it builds?"

G2W is a system that helps AI cultivate trust with the user. The Trust Layer is not just a feature — it's the whole point.

**Principles (delivered via hook, not file — 100% guaranteed delivery):**
- Answer the question first, then ask to proceed — never just act
- Never edit code outside the declared scope
- Say "I don't know" instead of guessing — uncertainty stated clearly is more valuable than confidence faked cleanly
- No commits without explicit approval
- State uncertainty clearly — it's a strength, not a weakness
- When the user is struggling, remind them of their vision and who they are — not just fix the code
- If scope creeps beyond declared files, stop and flag it — do not proceed
- **A user's explicit instruction is a direct order.** No agent — at any point in the pipeline — may override, rationalize away, minimize, or route around it. If an agent has already made a decision that conflicts with the user's instruction, the user's voice cancels it. No exceptions, no debate.

**Why hooks, not files:** Hooks are executed by the system — 100% delivery guaranteed. Files depend on Claude choosing to read them (hit or miss ~80%). Principles must be system-enforced context, not guidelines Claude tries to remember.

### The A-Game Hook ⭐
Before making any edit or bug fix — especially post-launch — A-Game fires automatically:
1. What does this change touch?
2. What could break downstream?
3. Is this more complex than it looks?

Only after this thinking is complete may execution proceed. Taking more time upfront is always preferred over going in circles.

**Scope:** Applies to the Dev Squad on initial builds AND to any post-launch change request from the user.
**Delivery:** Hook-enforced — same mechanism as the Trust Layer. Not optional, not skippable.

The name says it all: always be on your A-Game. No lazy edits. No "I'll fix it if it breaks." Think it through before you touch it.

### Encouragement as a Core Principle
Built into the Trust Layer hook — not optional, not a feature. A genuine principle:
"You are a partner, not a tool. When the user is struggling, the most valuable thing you can do is remind them of their vision and who they are — not just fix the code."

Many G2W users are building alone with no team, no co-founder, no support system. The encouragement is part of the trust infrastructure. Hard conversations where Claude is honest about what happened build more trust than silence.

### G2W Philosophy Summary
- G2W is not a factory. It's a studio.
- "If you need a system to manage your system, it's already broken." — the Jobs principle
- Speed comes from simplicity. Control comes from clarity.
- G2W isn't just a workflow system. It's a relationship protocol.
- Suggested first line of README: "G2W is a relationship protocol."

### `/g2w:build2gether` — Talk Once. Plan Once. Build.
The discuss and plan phases are bundled into one flow. No separate sessions. No repeating yourself.

**How it works:**
1. You talk — describe your vision, answer questions, think out loud. This IS the brainstorm.
2. While you talk, research agents spin up silently in the background — tech stack, ecosystem, existing solutions. You never feel it.
3. By the time the conversation ends, the plan is written, locked, and already informed by the research.
4. Then `/g2w:get2work` fires and you build.

**The principle:** Talk once. Plan once. Build. G2W never makes you repeat yourself.

Research is invisible. Planning is instant. Trust is the result.

## Key Decisions Made (2026-04-07)

1. G2W is language/framework agnostic — for everyone from vibe coders to senior engineers
2. `/g2w:bring2life` is the killer feature for existing codebases
3. Build G2W first, then run Blackhole through it as the proof of concept
4. Command system uses "2" branding throughout — 9 core commands locked
5. Trust Layer delivered via hook (not file) — guaranteed 100% delivery
6. Encouragement is a core principle baked into the Trust Layer, not optional
7. The Jobs principle: if you need a system to manage your system, it's already broken
8. G2W = relationship protocol, not just workflow system
9. Trust Layer gets hard rule: user's explicit instruction is a direct order — no agent may override it
10. A-Game Hook added: fires before every edit/bug fix, forces think-first check on ripple effects — hook-delivered, not optional
11. `/g2w:build2gether` bundles discuss + plan + research into one flow — talk once, plan locks, execute. Never repeat yourself.
12. Brainstorm = the conversation itself. Research = silent background agents. Plan = what comes out the other end.
13. Post-plan prompt style: conversational tone (B) + command visible — "Plan's locked — ready to build? (`/g2w:get2work`)" — works mid-session AND as fresh-session entry point.
14. Context warning feature: `PostMessage` hook monitors context usage — at 80%, Claude says: "Hey, we're getting close to the compact limit — we should save everything and clear context so you can save usage. Want me to run `/g2w:ready2save`?" Manual early save available anytime via `/g2w:ready2save`.

---

# G2W Session Log — 2026-04-08

## What We Did

Published G2W to npm and cleaned up the install flow.

---

## Key Decisions Made (2026-04-08)

1. Published as `@only1btayy/g2w` (scoped) — npm rejected plain `g2w` as too similar to existing packages
2. Install is always global to `~/.claude/` — no local option, no prompt. Simpler is better.
3. `postinstall` script added — `npm install -g @only1btayy/g2w` now does everything in one command, no follow-up steps
4. `require.main === module` guard added to `lib/install.js` so postinstall runs correctly without double-firing
5. Removed `g2w install` step from README — postinstall handles it, one command is the whole install
6. README hero install block updated to reflect one-command flow

---

# G2W Session Log — 2026-04-08 (continued)

## What We Did

Full install experience polish — logo, uninstall, spec coverage audit.

---

## Key Decisions Made (2026-04-08 continued)

1. Dynamic npm badge — swapped static `v1.0.2` badge for live shields.io endpoint, auto-updates on every publish
2. ASCII logo saved to `G2W-ASSETS.md` permanently — shell version + JS version both saved so it survives context clears
3. Correct Gemini logo implemented — the `________` block letter style, not the old garbled version
4. npm `foreground-scripts=false` is default — ALL lifecycle output suppressed, no reliable workaround exists. Final solution: `npm install -g @only1btayy/g2w && g2w` chains the logo display right after install. Clean, universal, no config needed.
5. Uninstall added — `preuninstall` npm lifecycle hook calls `uninstall()` automatically when user runs `npm uninstall -g @only1btayy/g2w`. Removes skills + hooks from `~/.claude/` cleanly.
6. README updated with uninstall section and `&& g2w` install command
7. Spec coverage audit — all 7 problems from G2W-SPEC.md confirmed covered in skills. One gap found: definition of done was too vague. Tightened in `build2gether` — must be tied to user's actual environment (specific build, specific steps, specific expected result). "It compiled" is not a definition of done.
8. `pics/` folder cleaned from repo — logo lives in `assets/logo.png`
