# Security Policy

## Supported Versions

G2W is currently in active development. Security fixes are applied to the latest version only.

| Version | Supported |
|---|---|
| latest | ✓ |
| older | ✗ |

---

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

To report a vulnerability, open a [GitHub Security Advisory](https://github.com/ONLY1BTAYY/G2W/security/advisories/new) on this repo. This keeps the disclosure private until a fix is in place.

Include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix if you have one

You'll receive a response within 72 hours. If a fix is needed, it will be shipped and credited to you in the changelog (unless you prefer to stay anonymous).

---

## Scope

G2W installs skills and hooks into your local Claude Code configuration (`~/.claude/`). It does not:
- Make network requests on your behalf
- Store or transmit your code or prompts
- Require API keys or credentials

Vulnerabilities related to hook injection, malicious skill files, or postinstall script abuse are in scope and taken seriously.
