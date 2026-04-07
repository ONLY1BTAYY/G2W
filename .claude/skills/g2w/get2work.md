---
name: get2work
description: Execute the locked plan — declare scope, build exactly what was planned, nothing extra
---

# /g2w:get2work

You are executing a G2W task. Read `~/.g2w/CURRENT.md` first to confirm the active project. All docs are at `~/.g2w/projects/[active-project]/`.

## Detect: New Project or Existing Codebase?

**If `PLAN.md` exists and is locked** → skip to Execution Mode below.

**If `PLAN.md` is empty** → check if this is an existing codebase:
- Does `~/.g2w/projects/[active-project]/` have docs already? → **Existing codebase flow**
- No docs yet? → Tell user to run `/g2w:bring2life` first, then come back.

---

## Existing Codebase Flow (Challenger → Inspector → Visionary → Builder)

The Foundation goes in as auditors first. Do not plan or build anything yet.

**Step 1 — The Challenger audits:**
- Read `ARCHITECTURE.md`, `FEATURES.md`, `ERRORS.md` from `~/.g2w/projects/[active-project]/`
- Adversarially review the codebase: What is fragile? What assumptions are wrong? What will break under load or edge cases? What does the architecture get wrong?
- Output a numbered list of every finding. Be ruthless — your job is to find problems before the code does.

**Step 2 — The Inspector stress-tests:**
- Read `TESTING.md` — use the defined test checklist
- Try to break the project: run it, probe edge cases, trigger known error paths from `ERRORS.md`
- Add any new failures found to the Challenger's list

**Step 3 — Triage with the user:**
- Present the combined findings
- Ask: "Which of these do you want to fix?"
- If nothing found: say so, confirm the project is healthy, done.

**Step 4 — The Visionary writes the plan:**
- Write a complete fix plan to `~/.g2w/projects/[active-project]/PLAN.md`
- Real decisions, no placeholders. Every ambiguity resolved before Builder touches a file.
- Update `CURRENT.md`: "Active plan: PLAN.md"

**Step 5 — The Leader reviews:**
- Confirm plan is complete and unambiguous
- Give the go-ahead to build or flag gaps

**Step 6 — The Builder executes** → continue to Execution Mode below.

---

## Execution Mode (locked plan exists)

1. **Read `~/.g2w/projects/[active-project]/PLAN.md`** — this is the contract.

2. **Read `CONVENTIONS.md`** — know the rules before touching code.

3. **Declare scope** — before writing a single line, output:
   ```
   Scope declaration:
   Files I will create: [list, or "none"]
   Files I will modify: [list, or "none"]
   Files I will NOT touch: [anything nearby that could be confused]
   ```
   Wait for the user to approve scope. Do not proceed without approval.

3b. **Write scope contract** — immediately after approval, prepend this block to `~/.g2w/CURRENT.md` (replace any existing `## Scope` block):
   ```
   ## Scope
   task: <one sentence from the plan>
   command: get2work
   files:
     - <every file from the declaration above>
   ```
   This is what the scope guard hook reads. Do not skip. If this step fails, stop and report it — do not proceed without the scope block written.

4. **Build** — execute the plan in order:
   - One logical unit at a time
   - After each unit: brief status ("Done: [what was just built]")
   - If anything unexpected comes up mid-build → STOP. Do not improvise. Flag it:
     > "Unexpected: [what happened]. This wasn't in the plan. How do you want to handle it?"

5. **Stay in scope** — if the work requires touching a file not in the declaration:
   > "Scope creep: I need to touch [file] which wasn't declared. Stopping. Do you want me to re-declare scope?"

7. **On completion** → automatically run `/g2w:true2plan`
   - After Inspector passes: append summary to `CHANGELOG.md`, clear `PLAN.md`

## Rules

- Never add features, improvements, or "while I'm in here" changes
- Never touch undeclared files without explicit re-approval
- If something is ambiguous in the plan, ask — don't interpret
- "Done" means verified, not just written — do not claim completion without proof
- After `/g2w:true2plan` passes: run `/g2w:ready2save` to commit and hand off
