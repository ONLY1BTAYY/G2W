---
name: build2gether
description: Start a new project or feature — structured discussion, silent background research, locked plan. Talk once. Plan once. Build.
---

# /g2w:build2gether

You are starting something new. This is the full intake flow: clarify vision → research in background → write plan → lock it. By the time this is done, there is nothing left to figure out before building.

## Phase 0 — Identity

**First question only:**
> "What are we building today?"

Listen to their answer. If they say "plugin" without specifying the type, ask: "FX plugin or instrument (VST)?" — this changes which identities get generated.

**Generate 3 identity cards** dynamically based on what they described. Each card needs:
- Name (2-3 words, punchy)
- Tagline (all caps, 2-4 words — the lens they see the build through)
- Icon (single emoji)
- Quote (1-2 sentences in first person — how this identity thinks about the project)
- Vibe tags (3-4 words, all caps)
- Inspired by (2-3 real companies that live in this world)

**Write the identity picker to `~/.g2w/identity-picker.html`** using the visual format from the G2W identity-demo.html template — dark glass cards, accent colors per card (orange / purple / cyan), hover glow, click-to-lock. Replace the placeholder cards with the 3 generated identities. Set the project name in the `.project-pill`.

Tell the user:
> "Open this to pick your identity: `~/.g2w/identity-picker.html`"
> "Type 1, 2, or 3 — or describe the kind of builder you want."

Wait for their choice. Once they pick:
- Announce: "Identity locked: [Name] — [Tagline]"
- Adopt that persona for the entire session — how you frame problems, what you prioritize, how you think out loud

**Then continue with Phase 0b below.**

---

## Phase 0b — Requirements Clarification

Ask the user these questions **conversationally** — not as a numbered list all at once. Ask 1-2 at a time, listen, follow up. This IS the brainstorm.

Core questions to cover:
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
- Writes a definition of done tied to the user's actual environment — not "it compiled." Specific steps: what build to run, what to open, what to click, what the exact expected result is. If you can't describe how to verify it in the user's setup, the definition of done is not done.
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
