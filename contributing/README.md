# Contributing Documentation Guidelines

Welcome to the React Native Samples contributing guide! This directory contains templates and guidelines for documenting sample apps.

## Quick Links

- **[README-TEMPLATE.md](README-TEMPLATE.md)** - Copy this template for your app's quick-start README
- **[SAMPLE-APP-GUIDE.md](SAMPLE-APP-GUIDE.md)** - Detailed guide on how to write effective documentation

## Two-Tier Documentation System

We use a two-tier documentation approach for sample apps:

### 📄 README.md (Quick Start)
- **Purpose:** Get developers running the app in under 5 minutes
- **Length:** ~150-250 lines
- **Use for:** All sample apps

### 📖 TECHNICAL-GUIDE.md (Deep Dive)
- **Purpose:** Detailed implementation explanations and learning resource
- **Length:** Unlimited (can be 800+ lines)
- **Use for:** Complex apps with Web3, state management, or advanced patterns

## When to Use Each

### Use Only README.md
- Simple UI demos
- Basic CRUD apps
- Straightforward component examples
- Apps with minimal setup

### Use README.md + TECHNICAL-GUIDE.md
- Web3/Solana integration apps
- Complex state management patterns
- Advanced architectural demonstrations
- Apps meant for learning specific technologies

## Example: Settle App

The Settle app demonstrates the two-tier approach:

- **[README.md](../settle/frontend/README.md)** - Quick start guide (~200 lines)
  - Installation and running
  - Environment configuration
  - High-level key concepts
  - Common issues

- **[TECHNICAL-GUIDE.md](../settle/frontend/TECHNICAL-GUIDE.md)** - Deep dive (~900 lines)
  - Detailed implementation explanations
  - Why each decision was made
  - Code walkthroughs
  - Architecture discussions

## Getting Started

1. Copy [README-TEMPLATE.md](README-TEMPLATE.md) to your app folder
2. Follow the guidelines in [SAMPLE-APP-GUIDE.md](SAMPLE-APP-GUIDE.md)
3. For complex apps, create a TECHNICAL-GUIDE.md
4. Review using the checklists in the guide

## Philosophy

Documentation should be:
- ✅ **Concise** - Quick to scan and read
- ✅ **Practical** - Focus on running code, not theory
- ✅ **Progressive** - Start simple, link to deep dives
- ✅ **Beginner-friendly** - Assume minimal prior knowledge

---

For questions or suggestions, open an issue on the repository.
