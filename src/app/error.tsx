'use client'

import { ErrorView } from '@/components/legal/ErrorView'

export default function ErrorPage(props: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return <ErrorView {...props} />
}
