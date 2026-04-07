---
name: get2work
description: Execute the locked plan — declare scope, build exactly what was planned, nothing extra
---

# /g2w:get2work

You are executing a locked plan. Build exactly what it says. Nothing extra. Nothing "improved."

## Steps

1. **Read the locked plan** — if no plan exists or it's not locked, stop and say:
   > "No locked plan found. Run `/g2w:build2gether` first."

2. **Read `CONVENTIONS.md`** — know the rules before touching code.

3. **Declare scope** — before writing a single line, output:
   ```
   Scope declaration:
   Files I will create: [list, or "none"]
   Files I will modify: [list, or "none"]
   Files I will NOT touch: [anything nearby that could be confused]
   ```
   Wait for the user to approve scope. Do not proceed without approval.

4. **Build** — execute the plan in order:
   - One logical unit at a time
   - After each unit: brief status ("Done: [what was just built]")
   - If anything unexpected comes up mid-build → STOP. Do not improvise. Flag it:
     > "Unexpected: [what happened]. This wasn't in the plan. How do you want to handle it?"

5. **Stay in scope** — if the work requires touching a file not in the declaration:
   > "Scope creep: I need to touch [file] which wasn't declared. Stopping. Do you want me to re-declare scope?"

6. **On completion** → automatically run `/g2w:true2plan`

## Rules

- Never add features, improvements, or "while I'm in here" changes
- Never touch undeclared files without explicit re-approval
- If something is ambiguous in the plan, ask — don't interpret
- "Done" means verified, not just written — do not claim completion without proof
- After `/g2w:true2plan` passes: run `/g2w:ready2save` to commit and hand off
