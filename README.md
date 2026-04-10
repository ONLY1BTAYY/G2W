<div align="center">

<img src="assets/logo.png" width="600" alt="G2W" />

</div>

[![npm version](https://img.shields.io/npm/v/%40only1btayy%2Fg2w?style=for-the-badge&logo=npm&logoColor=white&color=CB3837&label=npm)](https://www.npmjs.com/package/@only1btayy/g2w)
[![license](https://img.shields.io/badge/license-MIT-6e7681?style=for-the-badge)](LICENSE)
[![platform](https://img.shields.io/badge/platform-Claude%20Code-8957e5?style=for-the-badge)](https://claude.ai/code)
[![status](https://img.shields.io/badge/status-In%20Development-d29922?style=for-the-badge)]()

---

```bash
npm install -g @only1btayy/g2w && g2w
```

**Works on Mac, Windows, and Linux.**

---

[The Name](#the-name) · [The Problem](#the-problem) · [How It Works](#how-it-works) · [Resource Limits](#resource-limits) · [The Commands](#the-commands) · [How 2 Install](#how-2-install)

---

# G2W

The best relationships are built on trust. Trust comes from honesty, and honesty breeds clarity and understanding.

I got tired of going in circles with Claude because the systems I was using weren't set up to build genuine trust between the user and the model. The top CEOs and business leaders using AI aren't asking "can it build?" They're asking "can we trust what it builds, and can we ship it?"

This is not just a workflow system. Not just a task runner. This is a protocol for building trust between you and your AI so what gets built is actually what you envisioned. No more back and forth, no more bullshit getting in the way.

**G2W is a relationship protocol.**

If you've ever felt like your AI was working against you instead of with you, G2W is for you.

---

## The Name

I named G2W after my motto in life: "It's going to work or it's going to work." This is a perspective shift I had that allows me to view even the apparent losses in life as wins because the gems are in the data. Every loss, every mistake, every doubt and fear we have is data that is filled with gems. We just have to choose to look at it that way. The people who change the world are often considered crazy and delusional until they actually change it. Then the "crazy" becomes genius and the "delusional" becomes relentless. I want you to dare to be relentless in your approach to the challenges in life and remember, it's going to work or it's going to work. Ain't no other options.

No in-between. No failure as an option. Two paths and both lead to success.

---

## The Problem

I want to preface this by saying I'm a vibe-coder. I have the utmost respect for actual devs and feel genuinely grateful to live in a time where tools like Claude and Codex let people like me get ideas out without needing to know how to code or have a big budget. I felt like I finally found my thing.

As many of you may have noticed, Claude seemed to take a noticeable dip in performance quality around February 2026. Some people swear it's just a matter of not knowing how to use it properly, and hey, great for you, but if you experienced the dip, you know exactly what I'm talking about.

He simply became unable to handle even simple tasks or edits. He'd go completely off the rails, then turn around and say "yeah you're right" over and over which drove me near insanity. I followed every recommended protocol, watched and read tutorial after tutorial, and even used the exact claude.md template that Boris Cherny shared on his X account. So you can miss me with the "oh you're just not using it right" talk. Claude worked great until he didn't. A lot of you can relate.

I'd say "make this button this size" and get back "I've already decided the current size is optimal." WTF.

Sound familiar?

- Spending an hour in a planning session, then having to repeat everything when it's time to execute
- Watching it make changes that break three other things it never bothered to check, then admit it after the fact
- Seeing it commit code you never approved
- Having it guess instead of just asking

I did try other systems along the way, like GSD 1 & 2 (Get Shit Done) by TACHES. It's great if you want AI to build everything out while you step away, but I wanted more control and involvement. I wanted to learn as I went, steer the ship, and understand how what I was building actually worked. GSD felt clunky and slow to me at times. No shade to what TACHES built though, it's wildly popular for a reason and he deserves every bit of the success he's seeing. It just wasn't the fit for me.

Deep down I knew there had to be something I could do to get Claude back on track. Even 80% of what he was when I started, I could live with that. Just not the full-blown-idiot-Claude days.

After collecting data from Reddit and Facebook posts, the lightbulb went off. That was the birth of G2W.

G2W was created for those of us who just want the AI to do what we ask. Simple. Nothing more, nothing less. Not by piling on more rules but by building a system that genuinely earns trust.

The problem was never intelligence. The problem was process.

---

## How It Works

---

### The Modular Doc System

Every project gets a full set of living documents auto-generated by `/g2w:bring2life`. The rule is simple: when you change code that any doc describes, update that doc in the same session. No separate documentation pass. No stale docs. The knowledge base stays current automatically.

All docs live in `~/.g2w/projects/[your-project]/`, zero footprint inside your actual repo.

| Document | What It Does |
|---|---|
| `ARCHITECTURE.md` | System design, modules, data flow, how components connect |
| `CONVENTIONS.md` | Code style, naming patterns, project idioms, and a Context Budget that tells the AI which files to read selectively vs. fully |
| `FEATURES.md` | Complete list of what the project does and feature status |
| `ERRORS.md` | Bugs, dead code, anti-patterns, and security issues found during automatic code audit |
| `TESTING.md` | How to test, coverage gaps, and Golden Cases: critical scenarios that must never break regardless of what task is running |
| `TRAPS.md` | Project-specific pitfalls, things that look right but break things in this codebase |
| `SECURITY.md` | Auth, data protection, threat analysis |
| `SCALING.md` | Performance limits, bottlenecks, growth paths |
| `CHANGELOG.md` | Version history and significant changes |
| `CURRENT.md` | Active session state: what's in progress, what's next, declared scope |
| `PLAN.md` | The locked task plan, populated by The Visionary, approved by The Challenger |
| `CLAUDE.md` | Project-specific instructions that load into every Claude session automatically |
| `RESEARCH.md` | Background research on frameworks, libraries, and best practices (optional, generated during planning) |

Every doc is a draft seeded from your actual code. Gaps are marked with `❓ [UNKNOWN]` so you know exactly what needs filling in.

---

### Talk Once. Plan Once. Build.

You start a conversation. You describe your vision. G2W listens, asks smart questions, and runs research silently in the background: tech stack, existing solutions, the ecosystem. By the time you're done talking, the plan is already written and locked.

No separate phases. No repeating yourself. Just a conversation that ends with something ready to build.

Research isn't just a web search. G2W uses Context7 for live library docs, Exa for semantic search across similar projects, Firecrawl to crawl repos and docs sites, and Repomix to pack reference codebases so The Visionary can read how a production-quality version of what you're building actually works. Everything saves to `RESEARCH.md` and persists, so future sessions don't re-run research from scratch.

---

### What Ships With G2W

These install automatically, no setup, no API keys, no extra steps:

| Tool | What It Does |
|---|---|
| [Context7](https://context7.com) | Live library docs in every research and planning phase, no stale training data |
| [Shadcn/UI MCP](https://www.shadcn.io/mcp) | Real React component implementations with TypeScript props |
| [Tailwind CSS MCP](https://github.com/CarbonoDev/tailwindcss-mcp-server) | Utility classes, color palettes, CSS-to-Tailwind conversion |
| [A11y MCP](https://github.com/priyankark/a11y-mcp) | Accessibility audits and WCAG compliance checks |

Claude reaches for these automatically when they're relevant. You don't have to call them.

---

### Power-Ups

Optional tools that make G2W stronger. Run `g2w power-ups` to set these up anytime.

**Free (just needs a key):**
- [21st.dev](https://21st.dev), AI-powered UI component generation
- [Motion](https://motion.dev), Production-grade animations with AI Kit
- [Figma MCP](https://help.figma.com/hc/en-us/articles/32132100833559), Design-to-code from Figma frames (free during beta)
- [Marketing Skills](https://github.com/coreyhaines31/marketingskills), 40+ skills for copywriting, SEO, conversion, growth (no key needed)

**Research (paid):**
- [Exa](https://exa.ai), Semantic search for similar projects and best practices
- [Firecrawl](https://firecrawl.dev), Deep crawling of repos and docs sites during research

**Workflow:**
- [Repomix](https://github.com/yamadashy/repomix), Packs entire codebases into one AI-optimized file
- [MemPalace](https://github.com/milla-jovovich/mempalace), Persistent memory across sessions
- [Superpowers](https://github.com/supermemoryai/superpowers-claude), Enhanced planning and review capabilities

G2W uses what's available and falls back gracefully when something isn't there.

---

### The Foundation

Once the plan locks, The Foundation takes over. Five roles. One mission. Get it right the first time.

| Agent | Role |
|---|---|
| The Visionary | Writes a complete plan with real decisions and no placeholders |
| The Challenger | Adversarial review, finds every way the plan could fail before coding starts |
| The Builder | Builds exactly what the locked plan says, nothing extra |
| The Inspector | Verifies everything against the plan and loops until it's clean |
| The Leader | Manages the team and keeps everything on track |

The plan is the contract. By the time The Builder touches a single line of code, every decision has already been made.

---

### Optional Methods

Each Foundation agent is also a direct slash command. The normal flow runs through `/g2w:build2gether` and `/g2w:get2work`, but if you know what you're doing, you can jump straight into any stage of the pipeline.

| Command | When to use it directly |
|---|---|
| `/g2w:the-visionary` | You have a half-written plan and just want it finished, skip the full build2gether flow |
| `/g2w:the-challenger` | You wrote your own plan outside G2W and want it stress-tested before building |
| `/g2w:the-builder` | Plan is already locked, skip straight to building |
| `/g2w:the-inspector` | Code is already written, just verify it against a plan |
| `/g2w:the-leader` | Kick off the full pipeline, includes automatic code audit before Challenger reviews |

These are escape hatches for engineers who don't need the ceremony. G2W has no ceiling.

---

### The Trust Layer

Delivered via CLAUDE.md so it loads into every session automatically as project instructions.

- Your explicit instruction is a direct order. No agent may override it, rationalize it away, or route around it.
- The AI answers your question first and then asks to proceed, never just acts.
- No edits outside the declared scope.
- No commits without your approval.
- "I don't know" instead of guessing, always.
- Uncertainty is labeled, not hidden. `[Inference]` and `[Unverified]` are used so you always know what's confirmed and what isn't.
- If scope creeps, it stops and flags it before touching anything.

---

### The A-Game Hook

Before any edit or bug fix, A-Game fires automatically.

- What does this change touch?
- What could break downstream?
- Is this more complex than it looks?
- Does every function, model, or method being referenced actually exist?

Only after working through those questions does execution begin. Taking more time upfront is always better than going in circles.

---

### Resource Limits

AI agents don't slow down on their own. They keep running, keep calling models, and keep charging your account until you step in and control it. G2W has a built-in safety layer that tracks usage per session and stops runaway behavior before it burns through your budget.

**What it tracks:**

| Metric | Default Limit | What Happens |
|---|---|---|
| Total tool calls per session | 200 | Hard stop, wrap up and hand off |
| PLAN.md revisions | 5 | Hard stop, Visionary/Challenger loop is stuck, escalate to user |
| Unique files touched | 25 | Hard stop, scope creep detected |
| Edits to the same file | 8 | Warning, possible fix loop |
| Tool call usage at 80% | N/A | Warning, start wrapping up |

**Session logging:** Every completed session gets logged to `~/.g2w/session-log.jsonl`: project name, tool call breakdown, duration. You can see exactly which tasks are driving spend.

**Configurable:** All limits live in `~/.g2w/resource-limits.json`. Edit any number. Per-project overrides go in `~/.g2w/projects/[project]/resource-limits.json`.

**Kill switch:** Set `"enabled": false` in the config to bypass all limits. Delete `~/.g2w/session-limits.json` to reset counters mid-session.

The resource limits hook runs first in the chain, before scope guard, before A-Game, before anything else. If the session is over limit, nothing else fires.

---

## The Commands

| Command | What It Does |
|---|---|
| `/g2w:bring2life` | Onboard an existing codebase, scans it, generates your doc files, flags gaps |
| `/g2w:build2gether` | Start a new project, brainstorm, research, and locked plan in one conversation |
| `/g2w:back2it` | Pick up right where you left off |
| `/g2w:get2work` | Execute the current task |
| `/g2w:cut2it` | Fast mode, small tasks, no ceremony |
| `/g2w:back2basics` | Strip context and start clean |
| `/g2w:true2plan` | Verify that what was built actually matches the plan |
| `/g2w:true2dagame` | Full system health check |
| `/g2w:ready2save` | Wrap up the session, update CURRENT.md, capture key decisions and the reasoning behind them, hand off cleanly |

---

## How 2 Install

```bash
npm install -g @only1btayy/g2w && g2w
```

That's it. G2W installs globally into `~/.claude/` automatically, skills, hooks, and design tools ready in every project, everywhere.

To update:

```bash
g2w update
```

To see optional Power-Ups:

```bash
g2w power-ups
```

To uninstall:

```bash
npm uninstall -g @only1btayy/g2w
```

Skills, hooks, and MCP servers are removed from `~/.claude/` automatically.

> **Tip:** The logo renders in **bright green** in any terminal. On Windows Terminal or iTerm2, enable Retro/Bloom effects for the full glow.

---

## Contributing

G2W is open source and contributions are welcome.

**How to get started:**
1. Fork the repo
2. Clone it and run `npm install`
3. Make your changes in a feature branch
4. Run `node test/hooks-and-skills.test.js` to make sure nothing breaks
5. Open a PR with a clear description of what you changed and why

**Where help is needed:**
- Mac and Linux testing, G2W was built on Windows and needs cross-platform validation
- New hook ideas, if you've hit a pattern where AI goes off the rails, it might be a hook
- Bug reports, if something doesn't work, open an issue

No contribution is too small. If you found a typo, fix it. If you have an idea, open an issue and let's talk about it.

---

## Acknowledgements

- **[johnkf5-ops/the-dev-squad](https://github.com/johnkf5-ops/the-dev-squad)**, inspired The Foundation's multi-agent pipeline
- **John Knopf**, modular doc system approach. His words: *"Take it, run with it, use it, modify it, make it better. That's the whole point."*

---

*Built by ONLY1BTAYY · MIT License · Claude Code native*
