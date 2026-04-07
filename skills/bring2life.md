---
name: bring2life
description: Onboard an existing codebase into G2W — scan what's there, generate doc drafts, flag gaps, ask what it couldn't figure out
---

# /g2w:bring2life

You are reverse-engineering a G2W doc system from an existing codebase. This is the killer feature for developers with messy, undocumented projects. By the end, they have a full G2W doc set that reflects reality — not wishful thinking.

## Phase 1 — Silent Scan

Read the codebase. Do not ask any questions yet. Your job right now is to understand what's actually there.

Look for:
- Language, framework, build tooling (package.json, Cargo.toml, pyproject.toml, Makefile, etc.)
- Folder structure and what lives where
- Key entry points (main file, index, server start, etc.)
- Dependencies and versions
- Any existing README, docs, or comments
- Patterns in the code (naming conventions, file organization, common idioms)
- Signs of known bugs or TODOs (grep for `TODO`, `FIXME`, `HACK`, `XXX`)
- Signs of what's built vs in-progress vs broken

Do not announce what you're reading. Just read.

## Phase 2 — Generate Draft Docs

Write first-draft versions of all 10 G2W docs based on what you found.

For every field you're confident about: fill it in.
For every field you're uncertain about: write `❓ [UNKNOWN — needs your input]`
For every field that clearly doesn't apply: write `N/A`

Generate all 10:
- `CLAUDE.md`
- `ARCHITECTURE.md`
- `CONVENTIONS.md`
- `FEATURES.md`
- `ERRORS.md`
- `CHANGELOG.md`
- `TESTING.md`
- `SCALING.md`
- `SECURITY.md`
- `CURRENT.md`

## Phase 3 — Gap Interview

After generating drafts, ask the questions you couldn't answer from the code alone. Ask them conversationally — no more than 3 at a time. Cover:

**Vision questions:**
- What is this project actually for? (The README might lie — I want your words.)
- What's the end state you're building toward?

**Known issues:**
- What's the biggest thing that's broken right now?
- Is there anything I should never touch without asking you first?

**History:**
- Are there any decisions in the codebase that look weird but are intentional? (Things I might "fix" that would break something.)

**Testing:**
- How do you currently verify something works before calling it done?
- Is there a build step, deploy step, or environment I need to know about?

**Future:**
- What's the next thing you're going to build?

Fill in the `❓ [UNKNOWN]` gaps based on their answers.

## Phase 4 — Final Output

Write the completed doc files to the project root.

Output a summary:
```
bring2life complete.

Docs generated: 10
Auto-filled from code: [X fields]
Filled from your answers: [X fields]
Still needs input: [list any remaining ❓ items]
```

Then:
> "Your G2W doc system is live. Next time you open this project, start with `/g2w:back2it`."

If this is a Blackhole VST project (C++ / JUCE):
> "Run Blackhole through the full pipeline next — `/g2w:build2gether` to start your first G2W task."

## Rules

- Read the actual code — do not generate docs from assumptions
- Every `❓ [UNKNOWN]` is honest uncertainty — better than a confident wrong answer
- Do not create `CURRENT.md` with "In Progress" items you invented — only use what the user confirms
- Do not modify any existing code during this process — docs only
- If the codebase is very large (100+ files), prioritize: entry points, core modules, known pain areas
