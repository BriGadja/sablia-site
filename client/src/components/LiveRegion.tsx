/**
 * LiveRegion Component
 *
 * Provides accessible announcements for screen readers using ARIA live regions.
 * Used for dynamic content updates that should be announced to assistive technologies.
 *
 * Usage:
 * ```typescript
 * const [statusMessage, setStatusMessage] = useState('');
 *
 * <LiveRegion message={statusMessage} />
 *
 * // On form submit success:
 * setStatusMessage('Formulaire envoyé avec succès');
 *
 * // On form submit error:
 * setStatusMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
 * ```
 *
 * ARIA Attributes:
 * - role="status" | "alert": Defines the type of live region
 * - aria-live="polite": Content announced when user is idle (default for "status")
 * - aria-live="assertive": Content announced immediately (used for "alert")
 * - aria-atomic="true": Entire region read on change, not just changed parts
 *
 * Standards Compliance:
 * - WCAG 2.1 SC 4.1.3 (Level AA): Status Messages
 * - ARIA 1.1: Live Regions
 */

interface LiveRegionProps {
  /**
   * Message to announce to screen readers
   * When this changes, screen readers will announce the new message
   */
  message: string

  /**
   * Role type determines announcement behavior:
   * - "status": Polite announcement when user is idle (default)
   * - "alert": Assertive announcement, interrupts current reading
   *
   * Use "status" for: Form submission confirmations, loading states, progress updates
   * Use "alert": Validation errors, critical warnings, time-sensitive info
   */
  role?: 'status' | 'alert'
}

export function LiveRegion({ message, role = 'status' }: LiveRegionProps) {
  // aria-live is set implicitly by role="status" (polite) or role="alert" (assertive)
  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}
