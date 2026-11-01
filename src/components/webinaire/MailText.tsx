import { CONTACT_EMAIL } from '@/content/webinaire'

/** A copy line whose contact address becomes a mailto link; the text itself is unchanged. */
export function MailText({ text }: { text: string }) {
  const parts = text.split(CONTACT_EMAIL)
  return (
    <>
      {parts.map((part, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the parts of one fixed string never reorder
        <span key={index}>
          {part}
          {index < parts.length - 1 && <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>}
        </span>
      ))}
    </>
  )
}
