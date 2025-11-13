# Sample App Documentation Guide

This guide explains how to document new sample apps in this repository using our standardized templates.

## Philosophy

Sample app documentation should be:
- **Layered**: Overview → Detailed → Deep dive
- **Concise**: Get developers running quickly
- **Practical**: Focus on what's needed
- **Scannable**: Use headers, lists, and tables for easy navigation
- **Visual**: Use screenshots to show, not just tell
- **Beginner-friendly**: Assume minimal prior knowledge

## Three-Tier Documentation System

We use a three-tier documentation approach:

### Tier 1: Root README (`app-name/README.md`)
- **Purpose:** High-level overview with screenshots and basic setup
- **Length:** ~150-300 lines
- **Template:** [ROOT-README-TEMPLATE.md](ROOT-README-TEMPLATE.md)
- **Content:**
  - App description and what it demonstrates
  - Screenshots organized by feature
  - Key features list
  - Project structure (frontend/backend)
  - Quick setup for all components
  - Links to detailed submodule docs
- **Audience:** Anyone browsing the repo, evaluating the app

### Tier 2: Submodule READMEs (`app-name/frontend/README.md`, `app-name/backend/README.md`)
- **Purpose:** Detailed setup and technical documentation
- **Length:** ~200-400 lines
- **Template:** [SUBMODULE-README-TEMPLATE.md](SUBMODULE-README-TEMPLATE.md)
- **Content:**
  - Detailed installation and dependencies
  - Environment configuration
  - Detailed project structure
  - Key concepts (brief, 2-3 sentences)
  - Common issues and troubleshooting
  - Links to TECHNICAL-GUIDE.md (if exists)
- **Audience:** Developers setting up and running the specific module

### Tier 3: Technical Deep Dive (`app-name/frontend/TECHNICAL-GUIDE.md`) - Optional
- **Purpose:** In-depth implementation explanations
- **Length:** Unlimited (can be 800+ lines)
- **Content:**
  - Detailed "why" behind decisions
  - Code walkthroughs
  - Architecture discussions
  - Best practices and gotchas
- **Audience:** Developers learning the technology or customizing deeply

## When to Use Each

### Root README Only
- Very simple single-file demos
- Minimal setup required
- **Rare - most apps should have submodule READMEs**

### Root + Submodule READMEs (Most Common)
- **All apps with frontend + backend**
- Apps with multiple components
- Apps requiring environment configuration
- Standard for this repository

### Add TECHNICAL-GUIDE.md When
- Web3/Solana integration apps
- Complex state management patterns
- Advanced architectural demonstrations
- Implementation details are educational
- "Why" explanations would clutter the README

## Using the Templates

### Step 1: Root README

1. Copy [ROOT-README-TEMPLATE.md](ROOT-README-TEMPLATE.md) to `app-name/README.md`
2. Fill in the template:
   - App name and description
   - Add screenshots (organize by feature/flow)
   - List 3-6 key features
   - Show project structure
   - Add quick setup for frontend/backend
3. Keep it visual and high-level

### Step 2: Submodule READMEs

1. Copy [SUBMODULE-README-TEMPLATE.md](SUBMODULE-README-TEMPLATE.md) to `app-name/frontend/README.md` (and `backend/README.md` if applicable)
2. Fill in the template:
   - Detailed installation and dependencies
   - Environment configuration with tables
   - Detailed project structure
   - Key concepts (2-3 sentences each)
   - Common issues and troubleshooting
   - Link to TECHNICAL-GUIDE.md if it exists
3. Keep technical details concise - deep dives go in TECHNICAL-GUIDE.md

### Step 3: Technical Deep Dive (Optional)

1. Create `app-name/frontend/TECHNICAL-GUIDE.md` only if needed
2. Include:
   - Detailed "why" behind decisions
   - Code walkthroughs with examples
   - Architecture discussions
   - Best practices and gotchas
3. Link back to README.md at the top

---

## Section Guidelines

### For Root README (app-name/README.md)

**Header:**
- App name and one-sentence description
- "What is this?" section explaining the demo's purpose
- List major technologies (keep brief)

**Screenshots & Demo:**
- Organize by feature or user flow
- Use tables for side-by-side comparison
- Height: 360px for mobile screenshots
- Label each section clearly

**Features:**
- Bullet list of 3-6 key features
- Keep each point to one line
- Focus on user-facing functionality

**Project Structure:**
- Show only top-level directories (frontend/, backend/)
- Brief description of each component
- Keep it simple - detailed structure goes in submodule READMEs

**Quick Start:**
- Installation commands for all components
- Basic configuration steps
- Running commands for frontend and backend
- Link to detailed docs in submodule READMEs

### For Submodule READMEs (app-name/frontend/README.md, app-name/backend/README.md)

**Tech Stack:**
- List specific versions and dependencies
- More detailed than root README

**Quick Start:**
- Detailed installation steps
- All prerequisite requirements
- Running commands with explanations

**Configuration:**
- Use tables for environment variables
- Only document what users must change
- Provide working examples
- Link to external docs for complex setups

**Project Structure:**
- Detailed directory tree
- Explain purpose of each important directory
- Omit standard files (package.json, tsconfig.json, etc.)
- Highlight key integration directories with ⭐

**Key Concepts:**
- 2-4 subsections max
- Explain "why" not just "what"
- Link to actual code files
- Keep explanations to 2-3 sentences
- **For detailed explanations, use TECHNICAL-GUIDE.md**

**Common Issues:**
- Only include issues users actually encounter
- Provide actionable solutions
- Link to GitHub issues if applicable

**Resources:**
- Official documentation links
- Developer tools
- Sample apps and references

---

## What to Avoid

### Don't Include

- Comprehensive API documentation (link to it instead)
- Step-by-step tutorials (focus on setup)
- Excessive code examples (link to files)
- "Why we chose React Native" explanations
- Personal opinions without technical rationale

### Don't Over-Explain in README.md

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

### Good Key Concept (for Submodule README)

```markdown
### Transaction Signing

SOL payments use the `signAndSendTransactions` API with automatic token refresh. This avoids re-prompting users for every transaction while maintaining security.

**Files:** [solana/transaction.ts](solana/transaction.ts)

For detailed implementation, see [TECHNICAL-GUIDE.md](TECHNICAL-GUIDE.md#transaction-signing).
```

### Good Root README Quick Start

```markdown
## Quick Start (All-in-One)

**1. Clone and Install:**
```bash
cd frontend && npm install && cd ../backend && npm install
```

**2. Run:**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npx expo run:android
```

See [frontend/README.md](frontend/README.md) for detailed setup.
```

---

## Review Checklist

### For Root README (app-name/README.md):
- [ ] Is there a clear app description and "What is this?" section?
- [ ] Are screenshots included and organized by feature?
- [ ] Is the project structure shown (frontend/backend)?
- [ ] Are there quick setup instructions for all components?
- [ ] Does it link to detailed submodule READMEs?
- [ ] Is it under 200 lines and visual?
- [ ] Can someone understand what the app does in under 2 minutes?

### For Submodule READMEs (app-name/frontend/README.md, etc.):
- [ ] Can someone clone and run this module in under 5 minutes?
- [ ] Are all commands copy-paste ready?
- [ ] Is the README under 400 lines?
- [ ] Are environment variables documented in tables?
- [ ] Is the detailed project structure shown?
- [ ] Are Key Concepts kept to 2-3 sentences each?
- [ ] Are there clear headings for scanning?
- [ ] Does it link to TECHNICAL-GUIDE.md for deep dives (if applicable)?
- [ ] Are common issues with solutions included?

### For TECHNICAL-GUIDE.md (if created):
- [ ] Does it link back to README.md at the top?
- [ ] Are all "why" questions answered in depth?
- [ ] Are code examples annotated with explanations?
- [ ] Are edge cases and gotchas documented?
- [ ] Does it follow a logical flow from setup to advanced topics?
- [ ] Are implementation decisions explained?
- [ ] Does it serve as a learning resource, not just reference?

---

## Template Sections Reference

### Root README (app-name/README.md) - Required
**Template:** [ROOT-README-TEMPLATE.md](ROOT-README-TEMPLATE.md)

**Required Sections:**
- App name and description
- Screenshots & Demo
- Key Features list
- Project Structure (frontend/backend)
- Quick Start for all components

**Optional Sections:**
- Tech stack details
- API endpoints overview
- Links to submodule READMEs

### Submodule READMEs (app-name/frontend/README.md, etc.) - Required
**Template:** [SUBMODULE-README-TEMPLATE.md](SUBMODULE-README-TEMPLATE.md)

**Required Sections:**
- Module description
- Features
- Quick Start
- Configuration (env variables)
- Project Structure (detailed)
- Key Concepts (brief)

**Optional Sections:**
- Screenshots (if not in root)
- Common Issues
- Resources
- Documentation links (to TECHNICAL-GUIDE)

### TECHNICAL-GUIDE.md (Optional, When Needed)
**Use for:** Complex implementations, Web3 integrations, advanced patterns

**Sections:**
- Table of Contents
- Detailed setup explanations
- Implementation deep dives
- Architecture decisions
- Code walkthroughs
- Best practices and gotchas
- Advanced topics
- Why specific approaches were chosen

---

## Getting Help

- Check existing sample READMEs for inspiration
- Ask maintainers for feedback
- Open an issue if template needs improvement
