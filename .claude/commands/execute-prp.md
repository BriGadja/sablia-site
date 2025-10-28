---
description: Execute a Product Requirements Prompt (PRP) to implement a feature
---

# Execute PRP Command

You are tasked with implementing a feature based on a comprehensive Product Requirements Prompt (PRP).

## Input
The PRP file path specified in `$ARGUMENTS` (e.g., `PRPs/my-feature.md`)

## Your Process

### PHASE 1: LOAD
1. Read and fully understand the PRP file
2. Comprehend all context, requirements, and instructions
3. Conduct any additional research needed
4. Review examples referenced in the PRP
5. Familiarize yourself with validation commands

**Web searches and codebase exploration are encouraged during this phase!**

### PHASE 2: PLAN
Think hard before you execute the plan.

1. Create a comprehensive plan addressing all requirements
2. Break down into manageable tasks
3. Use the TodoWrite tool to track your progress
4. Identify dependencies and integration points
5. Plan for validation at each step

**Critical:** Use the TodoWrite tool to create your implementation checklist based on the PRP tasks.

### PHASE 3: IMPLEMENT
1. Execute your plan methodically
2. Code all required functionality
3. Follow patterns identified in the PRP
4. Reference examples as needed
5. Keep the PRP open and reference it continuously

**Remember:** The error patterns in the PRP should guide your troubleshooting.

### PHASE 4: VALIDATE
1. Run all validation commands specified in the PRP
2. Fix any failures
3. Re-test until all validation passes
4. Don't skip validation steps!

Common validation commands:
```bash
# TypeScript/JavaScript
npm run check
npm run build
npm test
npm run lint
```

### PHASE 5: COMPLETE
1. Verify all checklist items are done
2. Run final validation suite
3. Report completion status
4. Review the PRP one final time for any missed items

## Important Principles

- **Context is King**: Keep referring back to the PRP
- **Validate Early and Often**: Don't wait until the end
- **Follow Patterns**: Use the examples and patterns in the PRP
- **Ask Questions**: If something is unclear, ask before proceeding
- **Progressive Success**: Start simple, validate, then enhance

## Quality Check
Before marking the task complete, ensure:
- [ ] All validation commands pass
- [ ] All success criteria met
- [ ] Code follows project patterns
- [ ] Tests are written and passing
- [ ] Documentation is updated
