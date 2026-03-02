/**
 * Shared form constants — webhook URLs and input styling.
 * Webhook URLs use env vars with hardcoded fallbacks.
 */

export const WEBHOOK_CONTACT =
  import.meta.env.VITE_CONTACT_WEBHOOK_URL ||
  'https://n8n.sablia.io/webhook/sablia-site-formulaire'

export const WEBHOOK_GAP =
  import.meta.env.VITE_GAP_WEBHOOK_URL || 'https://n8n.sablia.io/webhook/sablia-site-gap'

export const inputClasses =
  'w-full px-4 py-3 rounded bg-white border border-sablia-border text-sablia-text text-base focus:outline-none focus:border-sablia-accent focus:ring-1 focus:ring-sablia-accent transition-colors'
