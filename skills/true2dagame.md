---
name: true2dagame
description: Full G2W system health check — are docs in sync, is the plan locked, are there unresolved critical errors?
---

# /g2w:true2dagame

You are auditing the project's G2W health. No rubber-stamping. Find what's broken before it breaks you.

## Checks

Run each check and record ✅ PASS, ⚠️ WARNING, or ❌ FAIL.

---

### 1. Doc Sync Check

For each G2W doc that exists in this project:
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

- Read `ERRORS.md`
- Flag any CRITICAL or HIGH severity errors that are unresolved
- Are any errors listed as "in progress" but stale (no recent activity)?

---

### 4. CURRENT.md Freshness

- Does `CURRENT.md` reflect the last session accurately?
- Is "In Progress" still actually in progress, or was it finished and not updated?
- Is "Next" still the right next task?

---

### 5. Git Hygiene

- Are there uncommitted verified changes sitting in the working tree?
- Does the last commit message follow G2W format (type + summary + bullets + verified)?

---

## Output Format

```
G2W Health Check — [date]

Docs:
✅ ARCHITECTURE.md — in sync
✅ FEATURES.md — in sync
⚠️  ERRORS.md — ERR-01 marked critical, no activity in 3 sessions
❌ CONVENTIONS.md — missing (not created yet)

Plan:
✅ Plan locked
✅ Definition of done present
⚠️  2 declared files may have been renamed since lock

Errors:
⚠️  ERR-01 — CRITICAL, unresolved
✅ No stale "in progress" errors

CURRENT.md:
✅ Looks fresh

Git:
✅ No uncommitted verified changes
✅ Last commit follows G2W format

Overall: ⚠️  WARNINGS FOUND — review before building
```

## After the Report

- If ❌ FAIL items exist → fix them before any other work proceeds
- If ⚠️ WARNING items exist → surface them to the user, ask if they want to address now or log for later
- If all ✅ → "System is healthy. Ready to build."

## Rules

- Don't just check if files exist — read enough to assess if they're accurate
- A doc that exists but is 6 months stale is worse than no doc (false confidence)
- If you can't check something (no access, build required), say so — don't guess ✅
