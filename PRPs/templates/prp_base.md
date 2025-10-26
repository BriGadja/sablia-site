# PRP Template v2: [Feature Name]

## Philosophy: Context is King

This PRP follows a validation-loop approach:
1. **Syntax & Style**: Linting and type-checking
2. **Unit Testing**: Happy path, error cases, edge conditions
3. **Integration Testing**: Live endpoint verification

---

## 1. Goal and Why

**What are we building?**
[Brief description of the feature]

**Why are we building it?**
[Business context, user need, or technical requirement]

---

## 2. What (Requirements)

### User-Visible Behavior
[Describe what the user sees/experiences]

### Functional Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

### Non-Functional Requirements
- [Performance requirements]
- [Security considerations]
- [Scalability needs]

---

## 3. Success Criteria

The implementation is complete when:
- [ ] [Specific measurable outcome 1]
- [ ] [Specific measurable outcome 2]
- [ ] [All validation gates pass]
- [ ] [Tests are written and passing]

---

## 4. Documentation & References

### Official Documentation
- [Library/API name]: [URL with specific section]
- [Tool/Framework name]: [URL with specific section]

### Relevant Code Examples
- `path/to/example1.ts` - [What pattern it demonstrates]
- `path/to/example2.ts` - [What pattern it demonstrates]

### External Resources
- [Best practices article]: [URL]
- [Tutorial]: [URL]

---

## 5. Codebase Context

### Current Structure
```
current/
├── relevant/
│   ├── files.ts
│   └── to/
│       └── understand.ts
```

### Desired Structure (After Implementation)
```
project/
├── new/
│   ├── files.ts
│   └── we/
│       └── will-create.ts
```

### Key Files to Modify
- `path/to/file1.ts` - [Why/what changes]
- `path/to/file2.ts` - [Why/what changes]

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks
- [Library name]: [Specific quirk or limitation]
- [Framework name]: [Common mistake to avoid]

### Common Mistakes
- ❌ [Anti-pattern to avoid]
- ✅ [Correct approach]

### Error Patterns
- Error: `[Common error message]`
  - Cause: [Why it happens]
  - Fix: [How to resolve]

---

## 7. Data Models & Schemas

### Database Schema (if applicable)
```typescript
// Drizzle schema
export const tableName = pgTable('table_name', {
  id: serial('id').primaryKey(),
  field: varchar('field', { length: 255 }).notNull(),
  // ... other fields
});
```

### API Request/Response Types
```typescript
// Request validation schema
const requestSchema = z.object({
  field: z.string(),
  // ... other fields
});

// Response type
type ResponseType = {
  success: boolean;
  data: SomeType;
};
```

---

## 8. Implementation Tasks

Execute these tasks in order:

### Task 1: [Task name]
**Action**: FIND/INJECT/MODIFY/CREATE
**Location**: `path/to/file.ts`
**Details**:
```typescript
// Pseudocode or specific code to add
```
**Why**: [Explanation]
**Gotchas**: [Specific things to watch out for]

### Task 2: [Task name]
**Action**: FIND/INJECT/MODIFY/CREATE
**Location**: `path/to/file.ts`
**Details**:
```typescript
// Pseudocode or specific code to add
```
**Why**: [Explanation]
**Gotchas**: [Specific things to watch out for]

[Continue for all tasks...]

---

## 9. Testing Strategy

### Unit Tests
Location: `path/to/test-file.test.ts`

Test cases to implement:
```typescript
describe('[Feature name]', () => {
  it('should handle happy path', async () => {
    // Test implementation
  });

  it('should handle error case 1', async () => {
    // Test implementation
  });

  it('should handle edge case', async () => {
    // Test implementation
  });
});
```

### Integration Tests (if applicable)
[Describe integration test approach]

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check
npm run lint
```

### Level 2: Unit Tests
```bash
npm test
```

### Level 3: Build
```bash
npm run build
```

### Level 4: Manual Testing (if needed)
1. [Step-by-step manual test]
2. [Expected outcome]

---

## 11. Integration Points

### Configuration Changes
- [ ] Add environment variables to `.env.example`
- [ ] Update configuration files

### Route Registration (if applicable)
```typescript
// Add to server/routes.ts
app.post('/api/endpoint', async (req, res) => {
  // Implementation
});
```

### Database Migrations (if applicable)
```bash
npm run db:push
```

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ Create new patterns when existing ones exist
- ❌ Skip validation steps
- ❌ Ignore test failures
- ❌ Mix async/await with .then()
- ❌ Hardcode configuration values
- ❌ Use overly broad exception handling

### DO:
- ✅ Follow existing patterns in the codebase
- ✅ Run validation after each major change
- ✅ Write tests alongside implementation
- ✅ Use consistent async patterns
- ✅ Use environment variables for config
- ✅ Handle specific error cases explicitly

---

## 13. Progressive Success

Start with the minimal viable implementation:
1. Basic functionality working
2. Validation passing
3. Basic tests passing

Then enhance:
4. Add error handling
5. Add edge case handling
6. Add comprehensive tests
7. Add documentation

---

## Final Validation Checklist

Before marking complete:
- [ ] All validation gates pass
- [ ] All success criteria met
- [ ] Code follows project patterns
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No TODO comments left in code
- [ ] Error handling implemented
- [ ] Configuration externalized
