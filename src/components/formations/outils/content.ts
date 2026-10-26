export const EYEBROW = 'Les outils'
export const TITLE = 'Ceux que je pratique chaque jour.'
export const LEAD = "Je choisis l'outil après avoir vu vos cas, jamais avant."

export interface Tool {
  name: string
  /** Shown beside the name, e.g. « sur demande » for what I do not practise every day. */
  note?: string
}

export interface ToolGroup {
  title: string
  items: readonly Tool[]
}

const t = (name: string, note?: string): Tool => ({ name, note })

export const GROUPS: readonly ToolGroup[] = [
  { title: 'Assistants', items: [t('Claude'), t('ChatGPT'), t('Claude Design')] },
  { title: 'Développement', items: [t('Claude Code'), t('MCP'), t('Skills et hooks')] },
  { title: 'Automatisation', items: [t('n8n'), t('Telegram'), t('Google Workspace')] },
  { title: 'CRM et données', items: [t('HubSpot'), t('Pipedrive'), t('Airtable'), t('Supabase')] },
  {
    title: 'Voix et réunions',
    items: [t('Agents vocaux', 'sur demande'), t('Plaud'), t('Fireflies')],
  },
  { title: 'Bureautique', items: [t('Excel'), t('Google Sheets'), t('Word')] },
]
