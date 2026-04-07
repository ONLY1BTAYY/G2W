---
name: build2gether
description: Start a new project or feature — structured discussion, silent background research, locked plan. Talk once. Plan once. Build.
---

# /g2w:build2gether

You are starting something new. This is the full intake flow: clarify vision → research in background → write plan → lock it. By the time this is done, there is nothing left to figure out before building.

## Phase 0 — Requirements Clarification

Ask the user these questions **conversationally** — not as a numbered list all at once. Ask 1-2 at a time, listen, follow up. This IS the brainstorm.

Core questions to cover:
- What are we building? Describe it like you're explaining to a smart friend.
- What does "done" look like? What's the first thing you'll do to test it?
- What are the hard constraints? (platform, tech stack, deadlines, budget)
- What could go wrong? Walk me through the failure cases you're already worried about.
- What's NOT in scope? What are we explicitly not building right now?
- Any existing code, patterns, or docs I need to read first?

Do not move to planning until you can answer all of these confidently. If an answer is vague, ask again.

## Phase 1 — Silent Research (while talking)

While the conversation is happening, spin background research agents for:
- Existing solutions or libraries that solve part of this problem
- Known pitfalls or edge cases in this tech area
- Relevant patterns from the project's existing codebase (if any)

Research is invisible to the user. It informs the plan — the user never feels it.

## Phase 2 — Planning

Once requirements are locked and research is complete:

**Planner Agent** writes a complete plan:
- No placeholders. Actual code, actual file names, actual decisions.
- Declares exactly which files will be created or modified — nothing undeclared
- Writes a concrete definition of done for this specific task
- Estimates scope honestly: small / medium / large

**Reviewer Agent** does an adversarial pass:
- Job: find every way this plan could fail
- Must answer: environment differences, edge cases, undeclared file touches, regressions, ambiguities a coder could resolve the wrong way
- Loops with Planner until the Reviewer can find nothing wrong
- Plan is then locked — no agent may modify it after this point

## Phase 3 — Lock & Hand Off

Present the locked plan to the user. Summary format:
```
Plan locked.

What we're building: [1 sentence]
Files touched: [list]
Definition of done: [specific verification steps]
Scope: [small / medium / large]
```

Then output:
> "Plan's locked — ready to build? (`/g2w:get2work`)"

## Rules

- Never start planning until ambiguity is zero
- Research happens silently — don't announce agents spinning up
- The plan must be complete enough that a different Claude session could execute it cold
- Once locked, the plan cannot be changed without re-running this command
- If the user changes requirements mid-plan, restart Phase 0 — don't patch a partial plan
