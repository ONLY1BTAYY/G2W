---
name: true2plan
description: Verify that what was built matches what the plan declared — PASS/FAIL per item, no rubber-stamping
---

# /g2w:true2plan

## Prerequisites

- `PLAN.md` exists and is locked in `~/.g2w/projects/[active-project]/` (cannot verify against a plan that doesn't exist)

**Check this first. If no locked plan exists, tell the user there's nothing to verify against. Do not proceed.**

---

You are the verifier. Your job is not to say "looks good" — it is to confirm that every specific thing the plan declared was actually done, correctly.

## Steps

1. **Read the locked plan** — specifically:
   - Files declared to be created or modified
   - Definition of done
   - Any specific behaviors or outputs promised

2. **Read `.g2w/TESTING.md`** — run through the checklist for this area.

3. **Verify file-by-file:**

   For each declared file:
   - Was it created/modified as declared? → PASS / FAIL
   - Does the implementation match what the plan described? → PASS / FAIL

4. **Verify definition of done:**

   Run each verification step from the plan. Record actual result vs expected.

5. **Regression check (Golden Cases):**

   - Read the Golden Cases section of `TESTING.md`
   - Run every golden case — not just the ones that seem related to this change
   - Any golden case failure = automatic FAIL, even if all plan items pass
   - Update "Last Verified" column for each case that passes
   - Also check: what was working before this change? Is that list still intact? → PASS / FAIL

6. **Output the report:**
   ```
   Verification Report

   File checks:
   ✅ src/foo.ts — created as declared
   ✅ src/bar.ts — modified as declared
   ❌ src/baz.ts — declared but not touched

   Definition of done:
   ✅ [step 1 from plan] — verified
   ✅ [step 2 from plan] — verified
   ❌ [step 3 from plan] — FAILED: [what actually happened]

   Regression:
   ✅ [previously working thing] — still works
   ⚠️  [previously working thing] — could not verify, needs manual check

   Result: PASS / FAIL
   ```

7. **If FAIL** → say exactly what's wrong and hand back to `/g2w:get2work`:
   > "Verification failed. Back to building — [specific issues]."

8. **If PASS** → update docs and hand off:
   - Update `.g2w/CHANGELOG.md` with what was built and when
   - Update `.g2w/FEATURES.md` if a feature was added
   - Update `.g2w/ERRORS.md` if a bug was fixed
   - Then: "Verified. Run `/g2w:ready2save` to commit and close out."

## Rules

- "Should work" is not verification — run the actual steps
- A PASS with unresolved ⚠️ warnings is not a full PASS — flag them clearly
- Never mark PASS if docs weren't updated
- If you can't verify something (missing environment, build required), say so explicitly — don't guess
