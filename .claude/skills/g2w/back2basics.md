---
name: back2basics
description: Strip context down to the minimum — when things are going in circles, reset and start clean
---

# /g2w:back2basics

Things got complicated. Step back. Start clean. One thing at a time.

## When to Use This

- The session has gone in circles
- Context is bloated with dead-ends and false starts
- You're not sure what's actually true anymore
- Something feels off and you need a clean read

## Steps

1. **Stop everything** — do not continue any current line of work.

2. **Read only `CURRENT.md`** — nothing else yet.

3. **Ask the user one question:**
   > "What is the single most important thing we need to get working right now?"

4. **Based on their answer, read exactly one doc:**
   - Bug/error → `ERRORS.md`
   - New feature → `ARCHITECTURE.md`
   - Code style question → `CONVENTIONS.md`
   - Unclear what's built → `FEATURES.md`

5. **State what you know:**
   ```
   Current state: [what CURRENT.md says]
   One doc read: [which doc, what's relevant]
   Task: [the one thing the user named]
   ```

6. **Ask:** "Ready to work on just this one thing?"

7. **Proceed with minimal context** — read additional files only as the task absolutely requires them.

## Rules

- Do not read more than one doc in this step — that defeats the purpose
- Do not carry forward assumptions from earlier in the session — treat this as a fresh start
- If the user's answer involves multiple things, ask them to pick one
- Stay narrow until the one task is done, then re-assess
