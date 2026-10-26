import type { Metadata } from 'next'
import { NotFoundView } from '@/components/legal/NotFoundView'

// Next injects `noindex` into not-found responses itself.
export const metadata: Metadata = { title: 'Page introuvable' }

export default function NotFound() {
  return <NotFoundView />
}
