# INITIAL_EXAMPLE.md

This is a concrete example of how to write an effective INITIAL.md file. Use this as inspiration when creating your own feature requests.

## FEATURE:

Build a multi-step lead generation form with ROI calculator integration. The form should:

1. **Step 1 - Business Information**:
   - Company name (required)
   - Industry selector (dropdown with predefined options)
   - Company size (small/medium/large radio buttons)
   - Current monthly revenue (number input with currency formatting)

2. **Step 2 - Process Metrics**:
   - Number of manual processes (number input)
   - Average time per process (number input in hours)
   - Employees involved (number input)
   - Current error rate (percentage input)

3. **Step 3 - ROI Calculation**:
   - Auto-calculate potential savings based on inputs
   - Display results in a card with charts (bar chart for time savings, pie chart for cost breakdown)
   - Show ROI percentage and payback period
   - Include confidence score (high/medium/low based on inputs)

4. **Step 4 - Contact Information & Scheduling**:
   - Full name (required)
   - Business email (required, validated - no personal emails)
   - Phone number (optional, formatted)
   - Preferred contact method (email/phone radio buttons)
   - Inline Calendly widget for scheduling consultation
   - Consent checkbox for marketing communications (GDPR compliant)

**Technical Requirements**:
- Form state persists across steps (stored in session storage)
- User can navigate back/forward through steps
- Each step validates before proceeding
- Progress indicator shows current step
- Submit sends data to `/api/leads` endpoint and database
- Success page with thank you message and next steps
- Mobile responsive with touch-friendly interactions

## EXAMPLES:

### Form Patterns
- `client/src/components/ui/ContactForm.tsx` - Follow this pattern for:
  - React Hook Form setup with Zod validation
  - Error message display
  - Loading states during submission
  - Success/error toast notifications
  - Mobile-responsive layout

- `client/src/components/ui/NewsletterForm.tsx` - Reference for:
  - Email validation pattern (rejecting personal email domains)
  - GDPR consent checkbox implementation
  - Form submission to API endpoint
  - Error handling

### UI Components
- `client/src/components/ui/Card.tsx` - Use this for ROI results display
- `client/src/components/ui/Button.tsx` - Use for navigation between steps
- `client/src/components/ui/Progress.tsx` - Use for step progress indicator
- `client/src/components/ui/Select.tsx` - Use for industry dropdown

### Data Visualization
- Look at how we use Recharts in other components for consistent chart styling
- Follow color scheme from Tailwind config

### API Integration
- `client/src/hooks/useLead.ts` (if exists) - Pattern for React Query mutation
- See how other forms submit to API endpoints
- Error handling pattern with try/catch and user feedback

## DOCUMENTATION:

### Core Libraries
- **React Hook Form**: https://react-hook-form.com/docs/useform
  - Specifically the multi-step form pattern: https://react-hook-form.com/advanced-usage#WizardFormFunnel
  - Form validation: https://react-hook-form.com/docs/useform#resolver

- **Zod Validation**: https://zod.dev
  - Schema composition for multi-step forms
  - Email validation: https://zod.dev/?id=strings
  - Number transformations: https://zod.dev/?id=coercion-for-primitives

- **React Query**: https://tanstack.com/query/latest/docs/framework/react/overview
  - Mutations: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
  - Error handling: https://tanstack.com/query/latest/docs/framework/react/guides/mutations#mutation-side-effects

### Data Visualization
- **Recharts**: https://recharts.org/en-US/
  - Bar Chart: https://recharts.org/en-US/api/BarChart
  - Pie Chart: https://recharts.org/en-US/api/PieChart
  - Responsive Container: https://recharts.org/en-US/api/ResponsiveContainer

### Integrations
- **Calendly**: https://help.calendly.com/hc/en-us/articles/223147027-Embed-options-overview
  - Inline widget implementation
  - Prefilling user information

### Database
- **Drizzle ORM**: https://orm.drizzle.team/docs/overview
  - Schema definition for leads table
  - Inserting records: https://orm.drizzle.team/docs/insert

## OTHER CONSIDERATIONS:

### Validation & Edge Cases
- **Business Email Validation**: Reject @gmail.com, @yahoo.com, @hotmail.com, @outlook.com
  - Show helpful error: "Please use your business email address"
- **Phone Number Formatting**: Use international format, optional field
- **Revenue Input**: Must be positive number, formatted with commas for thousands
- **Percentage Input**: Must be between 0-100

### User Experience
- **Session Storage**: Persist form data so users don't lose progress on refresh
  - Key: `lead-form-data-{timestamp}`
  - Clear on successful submission
- **Back Button**: Allow navigation to previous steps without validation
- **Progress Indicator**: Visual feedback showing Step X of 4
- **Mobile Touch**: Ensure all interactive elements are at least 44px touch targets

### Performance
- **Lazy Load Calendly**: Only load Calendly widget on Step 4 to improve initial load time
- **Debounce Calculations**: When user types in Step 2, debounce ROI calculation (300ms)
- **Optimize Charts**: Use Recharts' `isAnimationActive={false}` on mobile for better performance

### Common Gotchas (AI Assistants Often Miss These!)
1. **Calendly Script Loading**: Must load after DOM is ready
   ```typescript
   useEffect(() => {
     if (step === 4) {
       // Load Calendly script
     }
   }, [step]);
   ```

2. **Form Reset After Submission**: Clear session storage and reset form state
   - Don't forget to reset the step counter to 1

3. **Accessibility**:
   - Form must be keyboard navigable
   - Error messages must have proper ARIA labels
   - Required fields must be marked with aria-required

4. **GDPR Compliance**:
   - Consent checkbox must be opt-in (not pre-checked)
   - Must link to privacy policy
   - Store consent timestamp in database

5. **API Error Handling**:
   - Network errors: "Unable to submit. Please check your connection."
   - Validation errors: Show field-specific errors
   - Server errors: "Something went wrong. Please try again."
   - All errors should show as toast notifications AND in-form messages

### Database Schema Additions Needed
- Add `leads` table with fields:
  - All form inputs
  - Calculated ROI data
  - Consent timestamp
  - Created timestamp
  - Lead source (always "roi_calculator_form")
  - Lead status (default "new")

### Testing Checklist
- [ ] Form validates each step before proceeding
- [ ] Session storage persists data across refreshes
- [ ] Back button navigates without validation errors
- [ ] ROI calculation is accurate
- [ ] Charts render correctly with real data
- [ ] Calendly widget loads and prefills user info
- [ ] Form submits successfully to API
- [ ] Database record created with all data
- [ ] Success page displays after submission
- [ ] Form resets completely after submission
- [ ] Works on mobile (test on actual device)
- [ ] Keyboard navigation works
- [ ] Screen reader announces errors properly

### Design Requirements
- Follow Sablia brand colors from Tailwind config
- Use consistent spacing (Tailwind spacing scale)
- Card shadows should match other components
- Buttons should use primary variant for "Next" and "Submit"
- Secondary variant for "Back"
- Charts should use brand color palette

### Integration Points
- **API Endpoint**: POST `/api/leads` (create if doesn't exist)
- **Database**: Add migration for `leads` table
- **Email**: (Optional future enhancement) Send confirmation email
- **CRM**: (Optional future enhancement) Sync to CRM system

This comprehensive initial document should give the AI everything it needs to build this feature correctly on the first try!
