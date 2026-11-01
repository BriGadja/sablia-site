import { QUESTIONS, type Question } from '@/content/webinaire'

/** Pure helpers of the questionnaire: one draft per question, its answer string, the POST body. */

export interface Draft {
  /** Free text of a `long` question. */
  text: string
  /** Picked options of a `single` / `multi` question, in the options' order. */
  picks: string[]
  /** The short free-text box of a question that has one. */
  detail: string
}

export const emptyDraft = (): Draft => ({ text: '', picks: [], detail: '' })

/** Same shape the server checks first (`api/webinaire-questionnaire.ts` TOKEN_RE). */
export const isToken = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{64}$/.test(value)

/** The string sent for one question; '' = not answered. */
export function answerOf(question: Question, draft: Draft): string {
  if (question.kind === 'long') return draft.text.trim()
  const main = question.kind === 'single' ? (draft.picks[0] ?? '') : draft.picks.join(', ')
  return [main, draft.detail.trim()].filter(Boolean).join(' · ')
}

/** Exactly q1..q10, each a string (the server refuses a missing or an extra key). */
export function answersBody(drafts: Record<string, Draft>): Record<string, string> {
  return Object.fromEntries(
    QUESTIONS.map((question) => [
      question.key,
      answerOf(question, drafts[question.key] ?? emptyDraft()),
    ]),
  )
}
