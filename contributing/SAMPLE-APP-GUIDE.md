# Sample App Documentation Guide

This guide explains how to document new sample apps in this repository using our standardized template.

## Philosophy

Sample app READMEs should be:
- **Concise**: Get developers running the app quickly
- **Practical**: Focus on what's needed, not comprehensive tutorials
- **Scannable**: Use headers, lists, and tables for easy navigation
- **Beginner-friendly**: Assume minimal prior knowledge

## Two-Tier Documentation System

For complex apps (especially those with Web3/Solana integration), we use a two-tier approach:

### Tier 1: README.md (Quick Reference)
- **Purpose:** Get developers running in 5 minutes
- **Length:** ~150-250 lines
- **Content:** Installation, configuration, key concepts (high-level), common issues
- **Audience:** Developers who want to quickly test the app

### Tier 2: TECHNICAL-GUIDE.md (Deep Dive)
- **Purpose:** Understand implementation details and "why" behind decisions
- **Length:** Unlimited (can be 800+ lines for complex integrations)
- **Content:** Detailed explanations, code walkthroughs, architecture decisions
- **Audience:** Developers learning the technology or customizing the app

**When to use both?**
- Web3/Solana integration apps
- Apps with complex state management
- Apps demonstrating advanced patterns
- Any app where implementation details are educational

**When is README.md enough?**
- Simple UI demos
- Basic CRUD apps
- Straightforward examples

## Using the Template

1. Copy [README-TEMPLATE.md](./README-TEMPLATE.md) to your app's root directory
2. Rename it to `README.md`
3. Fill in each section following the guidelines below
4. **For complex apps:** Create `TECHNICAL-GUIDE.md` with detailed explanations

---

## Section Guidelines

### Header

- **App Name**: Clear, descriptive name
- **One-liner**: Single sentence describing the app's purpose
- **Tech Stack**: List major technologies (keep it short)

### Features

- Bullet list of 3-5 key features
- Keep each point to one line
- Focus on user-facing functionality

### Quick Start

- **Installation**: Copy-paste commands that work
- **Running**: Most common commands only
- Use code blocks for all commands
- Include environment setup if needed

### Project Structure

- Show only the most important directories
- Add brief comments explaining each
- Use tree format for visual clarity
- Omit standard files (package.json, tsconfig.json, etc.)

### Configuration

- Use tables for environment variables
- Only document what users must change
- Provide working examples
- Link to external docs for complex setups

### Key Concepts (formerly "Key Implementation Details")

- 2-4 subsections max
- Explain "why" not just "what"
- Link to actual code files
- Keep explanations to 2-3 sentences
- **For detailed explanations, use TECHNICAL-GUIDE.md**

### Common Issues

- Only include issues users actually encounter
- Provide actionable solutions
- Link to GitHub issues if applicable

### Tech Decisions

- Explain non-obvious choices
- Help developers understand tradeoffs
- Optional section - only if needed

---

## What to Avoid

### ❌ Don't Include

- Comprehensive API documentation (link to it instead)
- Step-by-step tutorials (focus on setup)
- Excessive code examples (link to files)
- "Why we chose React Native" explanations
- Personal opinions without technical rationale

### ❌ Don't Over-Explain in README.md

**Bad (in README.md):**
```
React Native doesn't have `crypto.getRandomValues()` by default, which Solana Web3.js requires.
This is because React Native runs in a JavaScript environment that differs from web browsers...
[5 more paragraphs explaining crypto APIs]
```

**Good (in README.md):**
```
React Native requires a crypto polyfill for Solana Web3.js:

1. Install: `npm install react-native-get-random-values`
2. Import first in `app/_layout.tsx`: `import 'react-native-get-random-values'`

Why? Solana Web3.js uses crypto.getRandomValues() for transaction IDs.

See [TECHNICAL-GUIDE.md](TECHNICAL-GUIDE.md) for detailed explanation.
```

**Perfect (in TECHNICAL-GUIDE.md):**
```
[Full 5 paragraph explanation with code examples, edge cases, and architecture decisions]
```

---

## Content Organization Tips

### Use Progressive Disclosure

Order content by importance:
1. What the app does
2. How to run it
3. How it works
4. Troubleshooting

### Use Visual Hierarchy

```markdown
# Main Topic (H1 - sparingly)
## Major Section (H2 - main organization)
### Subsection (H3 - details)

**Bold** for emphasis
`code` for technical terms
```

### Link, Don't Duplicate

Instead of copying documentation:
- Link to official docs
- Reference specific files in your codebase
- Point to external tutorials

### Keep It Updated

- Update README when making significant changes
- Remove outdated troubleshooting tips
- Verify commands still work

---

## Examples

### Good Feature Description

```markdown
## Features

- Connect Solana wallet via Mobile Wallet Adapter
- Send SOL payments with USD conversion
- View transaction history with Solscan integration
- Manage friend groups and split expenses
```

### Good Configuration Section

```markdown
### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API endpoint | `http://10.0.2.2:3000/api` |
| `EXPO_PUBLIC_SOLANA_CLUSTER` | Solana network | `devnet` |

For production, update to:
```bash
EXPO_PUBLIC_SOLANA_CLUSTER=mainnet-beta
```

### Good Implementation Detail

```markdown
### Transaction Signing

SOL payments use the `signAndSendTransactions` API with automatic token refresh.

**Why?** Avoids re-prompting users for every transaction while maintaining security.

**Files:** [solana/transaction.ts](solana/transaction.ts)
```

---

## Review Checklist

### For README.md:
- [ ] Can someone clone and run the app in under 5 minutes?
- [ ] Are all commands copy-paste ready?
- [ ] Is the README under 300 lines?
- [ ] Are there clear headings for scanning?
- [ ] Do code examples link to actual files?
- [ ] Is technical jargon briefly explained with link to TECHNICAL-GUIDE?
- [ ] Are screenshots/demos included?
- [ ] Does it explain "why" for non-obvious choices (1-2 sentences)?

### For TECHNICAL-GUIDE.md (if created):
- [ ] Does it link back to README.md at the top?
- [ ] Are all "why" questions answered in depth?
- [ ] Are code examples annotated with explanations?
- [ ] Are edge cases and gotchas documented?
- [ ] Does it follow a logical flow from setup to advanced topics?

---

## Template Sections Reference

### README.md (Required)
- App name and description
- Quick Start
- Configuration
- Key Concepts (high-level)
- Common Issues

### README.md (Optional)
- Screenshots
- Project Structure (recommended)
- Documentation section (link to TECHNICAL-GUIDE)
- Resources

### TECHNICAL-GUIDE.md (When Needed)
- Table of Contents
- Detailed setup explanations
- Implementation deep dives
- Architecture decisions
- Code walkthroughs
- Best practices
- Advanced topics

---

## Getting Help

- Check existing sample READMEs for inspiration
- Ask maintainers for feedback
- Open an issue if template needs improvement
