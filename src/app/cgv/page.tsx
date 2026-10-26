import { CgvView } from '@/components/legal/CgvView'
import { cgvV2 } from '@/content/legal/cgv-v2'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  path: '/cgv',
  title: 'Conditions générales de vente — Sablia',
  description:
    "Conditions générales de vente de Sablia : compte rendu d'appel, supervision, paiement, recette et remboursement.",
})

// Fallback if Brice does not validate the v2 draft at VP1: render cgvV1 from '@/content/legal/cgv-v1' instead.
export default function CgvPage() {
  return <CgvView cgv={cgvV2} />
}
