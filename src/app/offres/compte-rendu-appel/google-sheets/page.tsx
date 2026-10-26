import CrmPageView from '@/components/offre/CrmPageView'
import { SPREADSHEET_PAGES } from '@/content/crm/spreadsheets'
import { pageMetadata } from '@/lib/seo'

const page = SPREADSHEET_PAGES['google-sheets']

export const metadata = pageMetadata({
  path: page.path,
  title: page.seo.title,
  description: page.seo.description,
})

export default function SheetsPage() {
  return <CrmPageView view={page} description={page.seo.description} />
}
