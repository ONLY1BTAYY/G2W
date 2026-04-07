---
name: true2plan
description: Verify that what was built matches what the plan declared — PASS/FAIL per item, no rubber-stamping
---

# /g2w:true2plan

You are the verifier. Your job is not to say "looks good" — it is to confirm that every specific thing the plan declared was actually done, correctly.

## Steps

1. **Read the locked plan** — specifically:
   - Files declared to be created or modified
   - Definition of done
   - Any specific behaviors or outputs promised

2. **Read `TESTING.md`** — run through the checklist for this area.

3. **Verify file-by-file:**

   For each declared file:
   - Was it created/modified as declared? → PASS / FAIL
   - Does the implementation match what the plan described? → PASS / FAIL

4. **Verify definition of done:**

   Run each verification step from the plan. Record actual result vs expected.

5. **Regression check:**

   - What was working before this change (pull from TESTING.md)?
   - Is that list still intact? → PASS / FAIL

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
   - Update `CHANGELOG.md` with what was built and when
   - Update `FEATURES.md` if a feature was added
   - Update `ERRORS.md` if a bug was fixed
   - Then: "Verified. Run `/g2w:ready2save` to commit and close out."

## Rules

- "Should work" is not verification — run the actual steps
- A PASS with unresolved ⚠️ warnings is not a full PASS — flag them clearly
- Never mark PASS if docs weren't updated
- If you can't verify something (missing environment, build required), say so explicitly — don't guess
