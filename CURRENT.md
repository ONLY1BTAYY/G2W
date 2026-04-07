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
- [ ] Run `/g2w:bring2life` on Blackhole VST as first real test case (proof of concept)
