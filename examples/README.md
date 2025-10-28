# Examples Folder

This folder contains code examples that demonstrate patterns and best practices for the Sablia project. These examples are **critical** for successful context engineering with AI coding assistants.

## Purpose

AI coding assistants perform significantly better when they can see concrete examples of:
- How you structure your code
- What patterns you prefer
- How you handle common scenarios
- Your testing approaches
- Your error handling strategies

## What to Include

### 1. Component Patterns
Example React components that demonstrate:
- Component structure and organization
- Props typing with TypeScript
- State management approaches
- Event handling patterns
- Styling with Tailwind CSS

### 2. API Integration Patterns
Examples showing:
- How to make API calls using React Query
- Error handling in API requests
- Request/response typing
- Loading and error states

### 3. Form Patterns
Examples demonstrating:
- React Hook Form with Zod validation
- Form component structure
- Custom form fields
- Form submission handling

### 4. Routing Patterns
Examples of:
- Wouter route definitions
- Page component structure
- Navigation patterns
- Protected routes (if applicable)

### 5. Testing Patterns (if applicable)
Examples showing:
- Unit test structure
- Component testing approaches
- API mocking strategies

## Example Structure

```
examples/
├── README.md (this file)
├── components/
│   ├── FormExample.tsx          # Complete form with validation
│   ├── CardExample.tsx          # UI component example
│   └── ModalExample.tsx         # Modal pattern
├── pages/
│   ├── PageExample.tsx          # Full page component
│   └── DashboardExample.tsx     # Complex page with data fetching
├── api/
│   ├── apiClient.ts             # API client pattern
│   └── useDataHook.ts           # Custom React Query hook
└── utils/
    ├── validation.ts            # Zod schema examples
    └── helpers.ts               # Utility function patterns
```

## How to Use

When creating a new feature:
1. Reference relevant examples in your `INITIAL.md` file
2. Specify which patterns should be followed
3. Explain what aspects of the example are most important

Example reference in `INITIAL.md`:
```markdown
## EXAMPLES:
- `examples/components/FormExample.tsx` - Follow this pattern for form structure,
  validation with Zod, and error handling. Pay special attention to how we use
  React Hook Form and display validation errors.
- `examples/api/useDataHook.ts` - Use this pattern for creating custom React Query
  hooks. Note how we handle loading states and error messages.
```

## Best Practices

1. **Keep examples focused**: Each example should demonstrate one main concept
2. **Add comments**: Explain why you do things a certain way
3. **Show both do's and don'ts**: If there's a common mistake, show the correct way
4. **Keep examples updated**: As patterns evolve, update the examples
5. **Real code, not pseudo-code**: Use actual working examples from your project

## Getting Started

Start by adding:
1. A complete form component (most common feature type)
2. A page component with data fetching
3. An API integration example

These three examples will cover 80% of common implementation needs.
