# G2W — System Specification

> "It's going to work or it's going to work."
> There is no in-between when it comes to reaching our goals.

G2W is an open source AI workflow system designed to get as close to 99% correct code on the first try as possible — while keeping token usage lean, context clean, and trust unbroken.

---

## The Problem G2W Solves

Most AI coding workflows fail in one of four ways:

1. **Context rot** — the AI loses track of what's true and starts hallucinating state
2. **Ambiguous plans** — coding starts before requirements are fully understood
3. **No verification loop** — "it should work" replaces proof that it actually does
4. **Trust collapse** — the AI acts without asking, invents responses, fabricates history

G2W fixes all four.

---

## Core Philosophy

- **Knowledge lives in files, not chat.** Docs are the source of truth. Context is ephemeral.
- **The plan is the code contract.** No coding starts until the plan is locked and reviewed.
- **Prove it, don't claim it.** Done means verified in the user's actual environment.
- **Ask before acting.** Answer the question first, then ask to proceed. Never just act.
- **Two sets of eyes.** A plan reviewed by the same session that wrote it is not reviewed.

---

## System Architecture

### Layer 1 — The Knowledge Base (Modular Docs)

Every G2W project gets this set of files:

| File | Purpose | When to Read |
|------|---------|-------------|
| `CLAUDE.md` | Brain/index — what to read and when | Every session, first |
| `ARCHITECTURE.md` | Tech stack, structure, how everything connects | Before any code change |
| `CONVENTIONS.md` | Coding patterns, naming rules, what not to touch | Before writing any code |
| `FEATURES.md` | What's built, what's broken, what's next | When adding features |
| `ERRORS.md` | Known bugs, severity, investigation paths | When fixing bugs |
| `CHANGELOG.md` | Running log of what was built and when | After completing work |
| `TESTING.md` | Test checklist, repro steps, definition of done | Before calling anything done |
| `SCALING.md` | Distribution, platform, infrastructure decisions | When thinking about growth |
| `SECURITY.md` | Sensitive systems, auth, license, API keys | When touching anything sensitive |
| `CURRENT.md` | Last completed / in progress / what's next | Every new session |

**The self-maintenance rule:** When you change code that any doc describes, update that doc in the same session. Not later. Right now. Docs maintain themselves.

**Doc integrity check:** At the start of any session touching a documented area, verify the doc still matches the code. If it doesn't, fix the doc first.

---

### Layer 2 — The Pipeline (How Work Gets Done)

```
Phase 0: Requirements Clarification
  └── Structured Q&A before planning starts
  └── Every edge case, constraint, and "what if X" surfaced
  └── Zero ambiguity allowed into the plan

Phase 1: Planning (Planner Agent)
  └── Reads locked requirements
  └── Writes complete plan — no placeholders, actual code
  └── Declares exactly which files will be touched
  └── Writes definition of done for this specific task

Phase 2: Plan Review (Reviewer Agent — adversarial)
  └── Separate agent, fresh context
  └── Job: find every way this plan could fail
  └── Loops with Planner until zero gaps remain
  └── Plan is locked — no agent can modify it after approval

Phase 3: Build (Coder)
  └── Builds exactly what the locked plan says
  └── Nothing extra, nothing "improved"
  └── Any deviation from declared files = stop and flag

Phase 4: Verify
  └── Proof tied to user's actual environment
  └── Not "it compiled" — specific steps, specific build, specific result
  └── Regression check: verify nothing that worked before is now broken

Phase 5: Commit + Clear
  └── Auto-commit with structured message
  └── Handoff note written (what was done + WHY decisions were made)
  └── CURRENT.md updated
  └── User notified before context clears
  └── New session picks up from CURRENT.md + relevant docs only
```

---

### Layer 3 — The Trust Layer ⭐

The Trust Layer is G2W's most important feature. Hallucination and fabrication happen when the AI fills gaps with invented context. G2W makes this structurally impossible.

**Hard rules — no exceptions:**

1. **If I don't know something, I ask. I never invent.**
2. **I never simulate the user's responses.** If a decision requires the user, I stop and wait.
3. **I answer the question first, then ask to proceed. I never just act.**
4. **I declare scope before every task.** Which files I'll touch, and why. Nothing outside that scope without re-approval.
5. **If something unexpected comes up mid-build, I stop and re-plan.** I don't improvise.
6. **I never say "should be fixed."** I prove it works or I don't call it done.

---

### Layer 4 — Token Discipline

G2W is designed to be lean. Every token spent should serve the current task.

**Rules:**
- Read only what the current task requires — no exploratory reads
- No file reads before the task is defined
- If the user is about to test — wait for the result, don't pre-read defensively
- Scope declaration is mandatory — state which files will be touched before touching them
- Scope creep = hard stop + re-declaration

---

### Layer 5 — Context Management

**CURRENT.md** — the lightest possible handoff file. Always exactly three things:
```
## Last Completed
[What was finished and verified]

## In Progress
[What is actively being worked on right now]

## Next
[The immediate next task]
```

**Before context clears:**
- Write handoff note: decisions made + reasoning behind them (not just what, the WHY)
- Update CURRENT.md
- Commit everything verified
- Announce to user: "Saving progress and clearing context — here's what we just finished: [summary]"

**New session startup:**
1. Read CLAUDE.md
2. Read CURRENT.md
3. Read only the specific doc limbs the current task needs
4. Do not read anything else until required by the task

---

### Layer 6 — Git Automation

**Whitelisted commands (no approval prompt):**
- `git add`
- `git commit`
- `git push`
- `git status`
- `git log`

**commit.sh:**
```bash
#!/bin/bash
git add -A
git commit -m "$1"
git push
```

**Commit message format:**
```
type: short summary

- Bullet point of what changed
- Bullet point of what changed
- Verified: [how it was verified]
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`

---

## Regression Protection

Before touching any code, document what currently works (pull from TESTING.md checklist).
After the change, verify that list hasn't shrunk.
A fix that breaks something else is not a fix.

---

## Definition of Done

Done is not "it compiled." Done means:
- The specific verification steps from TESTING.md pass
- In the user's actual build/environment
- Regression check passed
- Docs updated
- Committed

---

## Adversarial Plan Review — How It Works

The Reviewer's mandate is not "does this look good" — it is "find every way this fails."

Questions the Reviewer must answer before approving:
- What happens if the user's environment differs from what was assumed?
- What edge cases does this plan not handle?
- Which files does this touch that aren't declared?
- What could break that was working before?
- Is there any ambiguity a coder could resolve the wrong way?

If any answer is unsatisfactory, the plan goes back to the Planner. They loop until the Reviewer can find nothing wrong.

---

---

## The Foundation — Agent Team

The Foundation is the named agent team that executes the G2W pipeline. Five roles. One mission: get it right the first time.

| Agent | Role | Pipeline Phase |
|-------|------|---------------|
| **The Visionary** | Writes a complete plan with real decisions and zero placeholders | Phase 1: Planning |
| **The Challenger** | Adversarial review — finds every way the plan could fail before coding starts | Phase 2: Plan Review |
| **The Builder** | Builds exactly what the locked plan says, nothing extra | Phase 3: Build |
| **The Inspector** | Verifies everything against the plan, loops until clean | Phase 4: Verify |
| **The Leader** | Manages the team, keeps everything on track, owns the handoff | Phase 0 + 5 |

**The plan is the contract.** By the time The Builder touches a single line of code, every decision has already been made.

### How The Foundation Works

```
User runs bring2life → docs are live
User defines task → The Leader activates

The Leader:
  → Hands requirements to The Visionary
  → Visionary writes complete plan (no ❓ placeholders)
  → Leader passes plan to The Challenger
  → Challenger attacks the plan — finds every gap, edge case, assumption
  → Plan loops between Visionary and Challenger until Challenger finds nothing wrong
  → Leader LOCKS the plan — no agent can modify it after this point
  → Leader hands locked plan to The Builder
  → Builder builds exactly what the plan says — flags any deviation immediately
  → Leader hands build to The Inspector
  → Inspector verifies against the plan — loops until everything is clean
  → Leader writes handoff, updates CURRENT.md, commits
```

### What's Built vs What's Needed

| Skill | Status |
|-------|--------|
| `bring2life` | ✅ Built |
| `back2it` | ✅ Built |
| `build2gether` | ✅ Built |
| `get2work` | ✅ Built |
| `true2dagame` | ✅ Built |
| `the-leader` | ✅ Built |
| `the-visionary` | ✅ Built |
| `the-challenger` | ✅ Built |
| `the-builder` | ✅ Built |
| `the-inspector` | ✅ Built |

### Rules for The Foundation

- The Challenger's job is NOT "does this look good" — it is "find every way this fails"
- The Builder touches ONLY the files declared in the locked plan — any deviation = hard stop
- The Inspector does not call anything done until it is proven in the user's actual environment
- The Leader never skips a phase under time pressure
- bring2life must be complete (all 10 docs live) before The Foundation activates on any project

---

## Open Source Goals

- Language and framework agnostic — works for any project
- Doc templates fillable in under an hour for any project
- Trust Layer highlighted as the signature feature
- README explains the "why" behind every decision
- CONTRIBUTING.md for community additions

---

## What G2W Is Not

- Not a replacement for human judgment — it's a structure that makes AI judgment more reliable
- Not a magic fix — garbage requirements still produce garbage results
- Not opinionated about stack — bring your own project, any language
- Not GSD2 — intentionally simpler, leaner, and more transparent
