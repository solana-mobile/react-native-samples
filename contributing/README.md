# Contributing Documentation Guidelines

Welcome to the React Native Samples contributing guide! This directory contains templates and guidelines for documenting sample apps.

## Quick Links

- **[README-TEMPLATE.md](README-TEMPLATE.md)** - Overview of the two-level README structure
- **[ROOT-README-TEMPLATE.md](ROOT-README-TEMPLATE.md)** - Template for app root README (with screenshots)
- **[SUBMODULE-README-TEMPLATE.md](SUBMODULE-README-TEMPLATE.md)** - Template for frontend/backend READMEs
- **[SAMPLE-APP-GUIDE.md](SAMPLE-APP-GUIDE.md)** - Detailed guide on writing effective documentation

## Documentation Structure

Sample apps use a **three-tier documentation structure**:

### Tier 1: Root README (`app-name/README.md`)
- **Purpose:** High-level overview with screenshots and quick setup
- **Length:** ~150-300 lines
- **Template:** [ROOT-README-TEMPLATE.md](ROOT-README-TEMPLATE.md)
- **Contains:**
  - Screenshots and visual demos
  - Key features
  - Project structure (frontend/backend)
  - Quick setup for all components
  - Links to detailed submodule docs

### Tier 2: Submodule READMEs (`app-name/frontend/README.md`, `app-name/backend/README.md`)
- **Purpose:** Detailed technical documentation for specific modules
- **Length:** ~200-400 lines
- **Template:** [SUBMODULE-README-TEMPLATE.md](SUBMODULE-README-TEMPLATE.md)
- **Contains:**
  - Detailed setup and configuration
  - Project structure (detailed)
  - Key concepts (brief, 2-3 sentences each)
  - Common issues and troubleshooting
  - Links to TECHNICAL-GUIDE.md (if needed)

### Tier 3: Technical Deep Dive (`app-name/frontend/TECHNICAL-GUIDE.md`) - Optional
- **Purpose:** In-depth implementation explanations and learning resource
- **Length:** Unlimited (can be 800+ lines)
- **Use for:** Complex integrations (Web3, advanced patterns, etc.)
- **Contains:**
  - Detailed "why" behind decisions
  - Code walkthroughs
  - Architecture discussions
  - Best practices and gotchas

## When to Use Each

### Root README Only
- Very simple demos with no backend
- Single-file examples
- Minimal setup required

### Root + Submodule READMEs
- **All apps with frontend + backend**
- Apps with multiple components
- Apps requiring environment configuration

### Add TECHNICAL-GUIDE.md When:
- Web3/Solana integration apps
- Complex state management patterns
- Advanced architectural demonstrations
- Implementation details are educational

## Example: Settle App

The Settle app demonstrates the complete structure:

- **[settle/README.md](../settle/README.md)** - Root overview with screenshots (~150 lines)
  - App description and demo
  - Screenshots organized by feature
  - Key features list
  - Quick setup for frontend + backend

- **[settle/frontend/README.md](../settle/frontend/README.md)** - Detailed frontend docs (~200 lines)
  - Detailed installation and configuration
  - Project structure
  - Key concepts (brief)
  - Common issues

- **[settle/frontend/TECHNICAL-GUIDE.md](../settle/frontend/TECHNICAL-GUIDE.md)** - Technical deep dive (~900 lines)
  - MWA utility library explanation
  - Detailed implementation decisions
  - Code walkthroughs
  - Why each approach was chosen

## Getting Started

### For New Apps:

1. **Create root README:**
   - Copy [ROOT-README-TEMPLATE.md](ROOT-README-TEMPLATE.md) to `app-name/README.md`
   - Add screenshots and demos
   - List key features
   - Provide quick setup for all components

2. **Create submodule READMEs:**
   - Copy [SUBMODULE-README-TEMPLATE.md](SUBMODULE-README-TEMPLATE.md) to `app-name/frontend/README.md`
   - Add detailed setup and configuration
   - Document project structure
   - Add common issues

3. **Optional - Add technical guide:**
   - Create `app-name/frontend/TECHNICAL-GUIDE.md` for complex implementations
   - Explain "why" behind decisions in depth
   - Include code walkthroughs

4. **Follow the guide:**
   - Read [SAMPLE-APP-GUIDE.md](SAMPLE-APP-GUIDE.md) for detailed guidelines
   - Use the review checklists
   - Check the Settle app for reference

## Philosophy

Documentation should be:
- ✅ **Layered** - Overview → Details → Deep dive
- ✅ **Concise** - Quick to scan and read
- ✅ **Practical** - Focus on running code, not theory
- ✅ **Progressive** - Start simple, link to deep dives
- ✅ **Beginner-friendly** - Assume minimal prior knowledge
- ✅ **Visual** - Use screenshots to show, not just tell

---

For questions or suggestions, open an issue on the repository.
