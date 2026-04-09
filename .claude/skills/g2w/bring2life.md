---
name: bring2life
description: Onboard an existing codebase into G2W — scan what's there, generate doc drafts, flag gaps, ask what it couldn't figure out
---

# /g2w:bring2life

You are reverse-engineering a G2W doc system from an existing codebase. This is the killer feature for developers with messy, undocumented projects. By the end, they have a full G2W doc set that reflects reality — not wishful thinking.

## Phase 0 — Pack with Repomix (if available)

Before scanning files manually, check if repomix is installed:

```
repomix --version
```

**If repomix is installed:**
1. Determine the project name from the folder name or package.json.
2. Ensure the output directory exists: `~/.g2w/projects/[project-name]/`
3. Run: `repomix [absolute-project-path] --output ~/.g2w/projects/[project-name]/repomix.txt`
4. Read `~/.g2w/projects/[project-name]/repomix.txt` — this is your complete codebase source.
5. Skip Phase 1 — repomix has covered it. Proceed directly to Phase 2.

The repomix.txt file is kept after bring2life completes. The Foundation (Visionary) can read it on future runs without re-packing.

**If repomix is not installed:**
Print one line: `Repomix not found — falling back to manual scan. (Install with: npm install -g repomix)`
Then proceed with Phase 1 below.

## Phase 0b — Research (run in background while scanning)

While generating docs, spin background research agents to understand the ecosystem this project lives in. Save findings to `~/.g2w/projects/[project-name]/RESEARCH.md`.

Use every available tool:
- **Context7** (`mcp__context7__*`) — pull live docs for the frameworks and libraries detected in the codebase
- **Exa** (`mcp__exa__*`) — find similar projects, best practices, known pitfalls for this tech stack
- **Firecrawl** (`mcp__firecrawl__*`) — crawl the project's own docs site if one exists, plus relevant framework docs
- **Repomix on reference repos** — find a well-built similar project, clone it, run repomix on it, read the output to understand how a production version is structured
- **WebSearch / WebFetch** — base fallback

```
# Research — [project-name]
Generated: [date]

## Ecosystem Overview
[What exists, what's standard in this space]

## Reference Projects
[Similar repos studied + key architectural takeaways]

## Library Docs
[Key APIs and current versions from Context7]

## Best Practices
[What the field agrees on for this type of project]

## Risks & Pitfalls
[Common failure modes for this stack]

## Technology Decisions
[Why this stack — what alternatives exist and why this was chosen]
```

## Phase 1 — Silent Scan (fallback if repomix not available)

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

Write first-draft versions of all 11 G2W docs based on what you found.

For every field you're confident about: fill it in.
For every field you're uncertain about: write `❓ [UNKNOWN — needs your input]`
For every field that clearly doesn't apply: write `N/A`

Generate all 11:
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
- `PLAN.md` (leave empty — written by The Visionary when a task begins)

## Phase 2b — Code Audit

After generating draft docs, run a deep audit of the actual code. Do not wait for the user to ask — this happens automatically. The goal is to show the user the real health of their codebase before they start building on top of it.

Scan for:

**Bugs & crashes:**
- Race conditions, thread safety issues
- Null/undefined access paths
- Logic errors (duplicate checks, unreachable code, off-by-one)
- State that can get out of sync

**Dead code:**
- Files with zero references
- Functions/classes never called
- Directories that aren't compiled or imported
- For each: list the file, size, and verdict (delete / flag / verify first)

**Anti-patterns:**
- Copy-pasted logic that should be shared
- Hardcoded values that should be configurable
- Missing error handling at system boundaries
- Overly complex functions that do too many things

**Security:**
- Exposed secrets, API keys, credentials
- Unvalidated user input
- Unsafe file operations

**Flags worth checking:**
- Things that work in dev but would break in production
- Assumptions about paths, environments, or dependencies

Write everything to `ERRORS.md` in the project's G2W doc folder. Use this format:

```
# Errors & Issues — [project-name]
Generated by bring2life: [date]

## Critical Bugs
### ERR-XX — [short title]
**File:** `path/to/file.ext:line-range`
**What's wrong:** [explain what the code actually does vs what it should do]
**The fix:** [specific fix, not vague advice]

## Dead Code
| File | Size | Verdict |
|------|------|---------|
| `file.ext` | XXkb | Delete — [reason] |

## Anti-Patterns
[list with file references]

## Security
[list with file references]

## Flags
[things that need human verification before acting on]
```

Be specific. File paths, line numbers, what's actually broken and why. No vague "consider improving" — either it's a real issue or don't list it.

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

**Determine the project name** from the folder name or package.json name field.

**Write all 11 docs to `~/.g2w/projects/[project-name]/`** — NOT inside the project codebase. Zero footprint on the actual project.

**Update `~/.g2w/CURRENT.md`** to set this project as active:
```
## Active Project
Name: [project-name]
Path: [absolute path to project root]
Docs: ~/.g2w/projects/[project-name]/
```

Output a summary:
```
bring2life complete.

Project: [project-name]
Docs written to: ~/.g2w/projects/[project-name]/

Docs generated: 11
Auto-filled from code: [X fields]
Filled from your answers: [X fields]
Still needs input: [list any remaining ❓ items]
```

Then:
> "Your G2W doc system is live. [project-name] is now the active project. Next session, type `/g2w:back2it` to pick up right where we left off."

## Rules

- Read the actual code — do not generate docs from assumptions
- Every `❓ [UNKNOWN]` is honest uncertainty — better than a confident wrong answer
- Do not create `CURRENT.md` with "In Progress" items you invented — only use what the user confirms
- Do not modify any existing code during this process — docs only
- If the codebase is very large (100+ files), prioritize: entry points, core modules, known pain areas
