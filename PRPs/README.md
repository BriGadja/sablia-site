# PRPs (Product Requirements Prompts)

This folder contains Product Requirements Prompts - comprehensive implementation blueprints that enable AI coding assistants to build features successfully in one pass.

## What is a PRP?

A PRP is similar to a PRD (Product Requirements Document) but specifically crafted for AI coding assistants. It includes:

- **Complete Context**: All documentation, examples, and patterns needed
- **Implementation Blueprint**: Step-by-step pseudocode and instructions
- **Validation Gates**: Tests and checks that must pass
- **Gotchas & Pitfalls**: Common mistakes to avoid
- **Success Criteria**: Clear definition of "done"

## Structure

```
PRPs/
├── README.md (this file)
├── templates/
│   └── prp_base.md          # Base template for new PRPs
└── [generated-prps].md      # Generated PRPs from /generate-prp
```

## Creating a PRP

### Method 1: Use /generate-prp (Recommended)

1. Create your feature request in `INITIAL.md`
2. Run `/generate-prp INITIAL.md` in Claude Code
3. Review the generated PRP at `PRPs/{feature-name}.md`
4. If confidence score < 8, add more context and regenerate

### Method 2: Manual Creation

1. Copy `templates/prp_base.md` to `PRPs/{feature-name}.md`
2. Fill in all sections thoroughly
3. Include real code snippets from your codebase
4. Add documentation URLs with specific sections
5. Define clear validation commands

## PRP Quality Checklist

A high-quality PRP includes:

- [ ] **Clear Goal**: What and why we're building
- [ ] **Specific Requirements**: Detailed functional and non-functional requirements
- [ ] **Real Examples**: Code snippets from the actual codebase
- [ ] **Documentation Links**: URLs to official docs with specific sections referenced
- [ ] **Known Gotchas**: Library quirks and common pitfalls
- [ ] **Data Models**: Complete schema and type definitions
- [ ] **Ordered Tasks**: Step-by-step implementation instructions
- [ ] **Validation Commands**: Specific commands that must pass
- [ ] **Success Criteria**: Measurable outcomes defining completion
- [ ] **Anti-Patterns**: What NOT to do

## Using a PRP

Once you have a PRP, execute it with:

```bash
/execute-prp PRPs/{feature-name}.md
```

The AI will:
1. Load all context from the PRP
2. Create a comprehensive plan
3. Implement the feature step by step
4. Validate at each stage
5. Iterate until all validation passes

## PRP Validation Levels

Every PRP should include these validation gates:

### Level 1: Syntax & Style
```bash
npm run check    # TypeScript type checking
npm run lint     # Code linting (if configured)
```

### Level 2: Build
```bash
npm run build    # Production build must succeed
```

### Level 3: Tests (when applicable)
```bash
npm test         # All tests must pass
```

The AI will run these commands and fix any failures before marking the feature complete.

## Best Practices

### 1. Include Real Code Snippets
❌ Don't:
```markdown
Use React Hook Form for the form
```

✅ Do:
```markdown
Use React Hook Form following this pattern from `client/src/components/ui/ContactForm.tsx`:
```typescript
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { name: "", email: "" }
});
```
```

### 2. Reference Specific Documentation
❌ Don't:
```markdown
See React Hook Form docs
```

✅ Do:
```markdown
React Hook Form validation: https://react-hook-form.com/docs/useform#resolver
Specifically the Zod resolver section showing how to integrate Zod schemas
```

### 3. Be Specific About File Operations
❌ Don't:
```markdown
Add the API route
```

✅ Do:
```markdown
**Action**: INJECT
**Location**: `server/routes.ts` (after line 42, in the API routes section)
**Code**:
```typescript
app.post("/api/contact", async (req, res) => {
  // Implementation
});
```
```

### 4. Include Error Patterns
❌ Don't:
```markdown
Handle errors properly
```

✅ Do:
```markdown
**Common Error**: `TypeError: Cannot read property 'data' of undefined`
**Cause**: API response doesn't include expected data structure
**Fix**: Always check response structure before accessing nested properties
```typescript
if (response?.data?.success) {
  // Handle success
}
```
```

## Iterating on PRPs

If a PRP doesn't work well:

1. **Note the Issue**: What went wrong? What was missing?
2. **Update the Template**: Add to `templates/prp_base.md`
3. **Add to Examples**: Create example showing the pattern
4. **Update CLAUDE.md**: Add to project-specific patterns if needed

## Reusing PRPs

Well-crafted PRPs can be reused:

1. Copy an existing PRP for a similar feature
2. Modify the specifics (names, endpoints, fields, etc.)
3. Execute with `/execute-prp`

This is much faster than creating from scratch.

## Example PRP Names

Use descriptive, kebab-case names:

- `contact-form-calendly-integration.md`
- `user-authentication-system.md`
- `roi-calculator-component.md`
- `database-migration-users.md`
- `api-endpoint-newsletter-signup.md`

## Measuring Success

A successful PRP results in:

- ✅ Feature implemented on first execution
- ✅ All validation gates pass
- ✅ Code follows project patterns
- ✅ Tests written and passing
- ✅ No manual debugging required

If you need multiple attempts, the PRP needs more context.

## Resources

- Context Engineering Intro: https://github.com/coleam00/context-engineering-intro
- Claude Code Documentation: https://docs.anthropic.com/en/docs/claude-code
- See `examples/` folder for code patterns to reference in PRPs
