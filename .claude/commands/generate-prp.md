---
description: Generate a comprehensive Product Requirements Prompt (PRP) from an INITIAL.md file
---

# Generate PRP Command

You are tasked with creating a comprehensive Product Requirements Prompt (PRP) that will enable an AI agent to implement a feature successfully in one pass.

## Input
The file path specified in `$ARGUMENTS` (e.g., `INITIAL.md`)

## Your Process

### 1. RESEARCH PHASE
**Codebase Analysis:**
- Search for similar patterns and reference files
- Document conventions and approaches
- Review test approaches and patterns
- Identify integration points

**External Research:**
- Find online examples and best practices
- Gather library documentation with URLs
- Identify common pitfalls and gotchas

**User Clarification:**
- Ask about patterns to mirror
- Clarify integration requirements
- Confirm reference locations

### 2. CRITICAL CONTEXT REQUIREMENTS
Your PRP MUST include:
- Documentation URLs with specific sections referenced
- Real code snippets from the codebase
- Library-specific quirks and version considerations
- Existing patterns and approaches to follow
- Validation commands that must pass

### 3. IMPLEMENTATION BLUEPRINT
Create a detailed blueprint with:
- Pseudocode showing the overall approach
- References to real files demonstrating patterns
- Error handling strategy
- Ordered task list for completion
- Specific file operations (FIND/INJECT/MODIFY/CREATE)

### 4. VALIDATION GATES
Include executable commands for validation, such as:
```bash
# TypeScript/JavaScript
npm run check
npm run build
npm test

# Linting
npm run lint
```

## CRITICAL STEP BEFORE WRITING
**ULTRATHINK** about the approach and plan comprehensively. Consider:
- What context will the AI agent need?
- What are the common failure points?
- What examples best demonstrate the patterns?
- What documentation is most relevant?

## Output
Create a file at: `PRPs/{feature-name}.md`

Use the template from `PRPs/templates/prp_base.md` as your structure.

## Quality Score
Rate your confidence (1-10) that an AI agent can implement this feature successfully in one pass using your PRP.

If your score is below 8, identify what's missing and add that context before finalizing.
