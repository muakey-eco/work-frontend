import { PageHeader } from '@/components'
import { getAssetsByPagnition } from '@/libs/asset'
import PageContent from './components/PageContent'
import AssetFilter from './components/asset-search'
import AssetTable from './components/asset-table'

const AssetPage: React.FC<any> = async ({
  searchParams,
}: {
  searchParams: { page: string; status: string; search: string }
}) => {
  const params = await searchParams
  const page = params?.page || '1'
  const status = params?.status || 'all'
  const search = params?.search || ''

  const query = new URLSearchParams()
  query.set('page', page)
  if (status !== 'all') {
    query.set('status', status)
  }
  if (search) {
    query.set('search', search)
  }

  const assets = await getAssetsByPagnition(query.toString())
  return (
    <>
      <PageHeader title="Quản lý tài sản" />
      <PageContent className="flex flex-col gap-[16px]">
        <AssetFilter />
        <AssetTable
          dataSource={assets.data}
          total={assets.total}
          per_page={assets.per_page}
          defaultActiveKey={status}
        />
      </PageContent>
    </>
  )
}

export default AssetPage
