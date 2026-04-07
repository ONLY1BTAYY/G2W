---
name: cut2it
description: Fast mode — for clearly scoped, low-risk changes. Skip planning ceremony, declare scope, build, verify.
---

# /g2w:cut2it

No ceremony. You know what you're doing, it's small, and it's low-risk. Get it done.

## When to Use This

Use `/g2w:cut2it` only when ALL of these are true:
- The change is clearly scoped (you could describe it in one sentence)
- It touches 1-3 files max
- It's low risk (not touching auth, payments, core logic, or anything that could cascade)
- No adversarial plan review is needed

If you're unsure about any of these → use `/g2w:build2gether` instead.

## Steps

1. **User describes the task** — one sentence. If it takes more than one sentence, it's not `/g2w:cut2it` territory.

2. **Declare scope** — immediately, before touching anything:
   ```
   Scope: [what you're changing and why]
   Files: [exact list]
   Not touching: [anything nearby that could be confused]
   ```
   Wait for approval.

2b. **Write scope contract** — immediately after approval, prepend this block to `~/.g2w/CURRENT.md` (replace any existing `## Scope` block):
   ```
   ## Scope
   task: <one sentence description>
   command: cut2it
   files:
     - <every file from the declaration above>
   ```
   This is what the scope guard hook reads. Do not skip. If this step fails, stop and report it — do not proceed without the scope block written.

3. **Build** — fast, focused, exactly what was described. Nothing extra.

4. **Verify** — show proof it works. Do not say "should work."

5. **Done** — that's it. No formal commit ceremony unless the user asks. No `/g2w:true2plan` required.

## Rules

- If anything unexpected comes up mid-build → stop and flag it. Don't improvise.
- If scope grows beyond what was declared → stop, re-declare, get re-approval
- No "while I'm in here" improvements
- If it turns out to be more complex than expected → say so and escalate to `/g2w:build2gether`
