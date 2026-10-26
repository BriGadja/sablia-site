import { notFound } from 'next/navigation'
import CrmPageView from '@/components/offre/CrmPageView'
import { isCrmSlug, publishedCrmPages } from '@/content/crm'
import { crmView } from '@/content/crm/schema'
import { pageMetadata } from '@/lib/seo'

/** Only the published slugs exist; a draft or unknown slug is a real 404 (no static file). */
export const dynamicParams = false

export function generateStaticParams() {
  return publishedCrmPages().map((page) => ({ crm: page.slug }))
}

async function publishedPage(params: Promise<{ crm: string }>) {
  const { crm } = await params
  const page = publishedCrmPages().find((p) => isCrmSlug(crm) && p.slug === crm)
  if (!page) notFound()
  return page
}

export async function generateMetadata({ params }: { params: Promise<{ crm: string }> }) {
  const page = await publishedPage(params)
  return pageMetadata({ path: page.path, title: page.seo.title, description: page.seo.description })
}

export default async function CrmPage({ params }: { params: Promise<{ crm: string }> }) {
  const page = await publishedPage(params)
  return <CrmPageView view={crmView(page)} description={page.seo.description} />
}
