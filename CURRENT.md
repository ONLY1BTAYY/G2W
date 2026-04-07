## Last Completed
`.g2w/` subfolder convention established + bring2life POC on Blackhole VST (2026-04-07)

**What was done:**
- Dynamic npm badge — auto-updates on every publish, no manual edits
- Removed `g2w install` step — postinstall handles everything automatically
- Fixed correct Gemini ASCII logo — saved permanently in `G2W-ASSETS.md` and `lib/logo.js`
- Added green ASCII logo to `g2w` CLI output and install confirmation
- Fought npm output suppression across 8 versions — final solution: `npm install -g @only1btayy/g2w && g2w`
- Added uninstall — `npm uninstall -g @only1btayy/g2w` cleans up `~/.claude/` automatically via `preuninstall` hook
- README updated — `&& g2w` install command, uninstall section, dynamic badge
- Tightened definition of done in `build2gether` skill — must be tied to user's actual environment
- Confirmed all 7 spec problems (from G2W-SPEC.md) are covered in skills
- `pics/` folder cleaned up from repo

**Key decisions:**
- npm `foreground-scripts=false` by default suppresses ALL lifecycle output — no way around it. Solution: chain `&& g2w` so the logo shows right after install in the same terminal session
- ASCII logo saved to `G2W-ASSETS.md` so it survives context clears — never lose it again
- Uninstall wired via `preuninstall` npm lifecycle hook — one command removes everything cleanly
- Definition of done must be environment-specific: "what build, what to open, what to click, what you'll see" — not "it compiled"

## In Progress
(none)

## Next
- [x] Run `/g2w:bring2life` on Blackhole VST as first real test case (proof of concept) ✅
- [ ] Publish new npm version — skills updated to write/read from `.g2w/` subfolder instead of project root
- [ ] All G2W docs now live in `.g2w/` inside each project — this is the new standard

## Session Notes — 2026-04-07

**What was built:**
- Ran `bring2life` on Blackhole VST v1.2 as first real-world G2W POC
  - Blackhole C++ VST already had most docs — created missing `CURRENT.md`
  - Generated all 10 G2W docs fresh for `blackhole-ui-v2/` (React UI repo had nothing)
- Moved all generated docs into `.g2w/` subfolders inside each project
- Updated 6 skills (`bring2life`, `back2it`, `ready2save`, `get2work`, `true2plan`, `true2dagame`) to read/write from `.g2w/` instead of project root
- Synced skill changes to `projects/g2w/skills/` (npm source)
- Brian also refined `back2it` to use a root-level `.g2w/CURRENT.md` pointer system (active project tracking)
- Brian refined `ready2save` to extract decisions from conversation history automatically

**Key decisions & WHY:**
- `.g2w/` subfolder (not project root) — keeps G2W docs isolated from GSD's `.planning/` mess and source files. Follows `.git/`, `.eslintrc` pattern. Clean, invisible unless you look.
- Central pointer (`Claudes Brain root .g2w/CURRENT.md` with `active: projects/[x]`) — so `back2it` always knows which project to resume without asking.

**What to read first next session:**
- This file + `skills/back2it.md` and `skills/ready2save.md` (Brian updated them this session)

## Lessons Learned
- **NEVER assume and jump ahead before hearing from the user.** When Brian says "you never did this before" or similar, STOP and wait for his answer. Do not launch agents or read files speculatively.
- G2W exists specifically to prevent Claude from going rogue. Honor the protocol: wait for user interaction before acting.
