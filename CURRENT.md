## Last Completed
G2W v1.0.12 published — install flow fully working with green ASCII logo (2026-04-08)

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

## Lessons Learned
- **NEVER assume and jump ahead before hearing from the user.** When Brian says "you never did this before" or similar, STOP and wait for his answer. Do not launch agents or read files speculatively.
- G2W exists specifically to prevent Claude from going rogue. Honor the protocol: wait for user interaction before acting.
