import CrmPageView from '@/components/offre/CrmPageView'
import { SPREADSHEET_PAGES } from '@/content/crm/spreadsheets'
import { pageMetadata } from '@/lib/seo'

const page = SPREADSHEET_PAGES['excel-365']

export const metadata = pageMetadata({
  path: page.path,
  title: page.seo.title,
  description: page.seo.description,
})

export default function ExcelPage() {
  return <CrmPageView view={page} description={page.seo.description} />
}
