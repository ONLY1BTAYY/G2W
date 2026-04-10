---
name: true2dagame
description: Full G2W system health check — are docs in sync, is the plan locked, are there unresolved critical errors?
---

# /g2w:true2dagame

## Prerequisites

- `~/.g2w/projects/[active-project]/` exists (at least `/g2w:bring2life` has been run)

**Check this first. If the project docs don't exist, tell the user to run `/g2w:bring2life` first. Do not proceed.**

---

You are auditing the project's G2W health. No rubber-stamping. Find what's broken before it breaks you.

## Checks

Run each check and record ✅ PASS, ⚠️ WARNING, or ❌ FAIL.

---

### 1. Doc Sync Check

For each G2W doc that exists in `.g2w/`:
- Does `ARCHITECTURE.md` reflect the current tech stack and structure?
- Does `FEATURES.md` reflect what's actually built vs what's broken vs what's next?
- Does `ERRORS.md` list the current known bugs with accurate severity?
- Does `CONVENTIONS.md` match the patterns actually used in the code?
- Does `CURRENT.md` reflect the actual current state (not last week's)?

Flag any doc that looks stale or inconsistent with what you can observe.

---

### 2. Plan Status Check

- Does a locked plan exist for the current task?
- Is it locked (not a draft)?
- Does it have a clear definition of done?
- Are all declared files still accurate (none renamed, deleted, or added since locking)?

---

### 3. Error Status Check

- Read `.g2w/ERRORS.md`
- Flag any CRITICAL or HIGH severity errors that are unresolved
- Are any errors listed as "in progress" but stale (no recent activity)?

---

### 4. CURRENT.md Freshness

- Does `.g2w/CURRENT.md` reflect the last session accurately?
- Is "In Progress" still actually in progress, or was it finished and not updated?
- Is "Next" still the right next task?

---

### 5. Git Hygiene

- Are there uncommitted verified changes sitting in the working tree?
- Does the last commit message follow G2W format (type + summary + bullets + verified)?

---

## Scoring Rubric

After running each check, score it 1-5. Use the criteria below — no vibes, no rounding up.

### Docs (1-5)
- **5** — All docs match code, updated this session or last
- **4** — All docs match code, updated within last 3 sessions
- **3** — 1 doc stale or missing a section
- **2** — 2+ docs stale or contradicting the code
- **1** — Docs are fiction — major drift from reality

### Plan (1-5)
- **5** — Locked plan exists, all files accurate, clear definition of done
- **4** — Locked plan exists, minor file renames since lock
- **3** — Plan exists but is a draft (not locked)
- **2** — Plan exists but has TBD/TODO markers
- **1** — No plan, or plan references files/functions that don't exist

### Errors (1-5)
- **5** — No unresolved critical/high bugs, golden cases all passing
- **4** — Unresolved bugs exist but all are medium/low
- **3** — 1 high-severity bug unresolved
- **2** — 1 critical bug unresolved
- **1** — Multiple critical bugs unresolved or ERRORS.md doesn't exist

### Freshness (1-5)
- **5** — CURRENT.md updated this session, all sections accurate
- **4** — Updated last session, still accurate
- **3** — "In Progress" is stale but "Next" is correct
- **2** — Both "In Progress" and "Next" are wrong
- **1** — CURRENT.md is from a different phase of the project entirely

### Git (1-5)
- **5** — Clean tree, last commit follows G2W format
- **4** — Clean tree, last commit message is informal
- **3** — Uncommitted changes exist but they're small
- **2** — Large uncommitted changes or untracked files
- **1** — Uncommitted verified work sitting for 2+ sessions

---

## Action Map

| Score | Action |
|-------|--------|
| 1 in any dimension | **HARD STOP** — fix this before any other work |
| 2 in Docs | Run through each stale doc, update from code |
| 2 in Plan | Send plan back to Visionary for completion |
| 2 in Errors | Triage with user — which critical bugs to fix first |
| 2 in Freshness | Rewrite CURRENT.md from scratch based on actual state |
| 2 in Git | Commit or stash — decide now |
| 3 in any dimension | **WARNING** — surface to user, ask if they want to address now |
| 4-5 in all dimensions | "System is healthy. Ready to build." |

---

## Output Format

```
G2W Health Check — [date]

Docs:       ████████████████░░░░ 4/5
Plan:       ████████████████████ 5/5
Errors:     ████████████░░░░░░░░ 3/5
Freshness:  ████████████████████ 5/5
Git:        ████████████████░░░░ 4/5

Overall: 4.2/5
```

Then below the scores, show the detail for anything scoring 3 or below:

```
⚠️  Errors: 3/5 — ERR-01 marked HIGH, unresolved, no activity in 3 sessions
   → Action: Triage with user — fix or downgrade severity

⚠️  Docs: ... (if applicable)
```

If overall is 4.0+ with no dimension below 3: "System is healthy. Ready to build."

---

## After the Report

- If any dimension scores **1** → hard stop, fix before any other work
- If any dimension scores **2** → fix now, use the action map
- If any dimension scores **3** → surface to user, ask if they want to address now or later
- If all dimensions score **4-5** → "System is healthy. Ready to build."

## Rules

- Don't just check if files exist — read enough to assess if they're accurate
- A doc that exists but is 6 months stale is worse than no doc (false confidence)
- If you can't check something (no access, build required), say so — don't guess a 5
- Score honestly. A 4 that should be a 2 is worse than the bug it hides.
