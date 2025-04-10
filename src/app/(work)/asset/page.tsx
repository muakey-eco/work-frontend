import { PageHeader } from '@/components'
import { getAssetsByPagnition } from '@/libs/asset'
import AssetClientWrapper from './components/AssetClientWrapper'

const AssetPage: React.FC<any> = async ({
  searchParams,
}: {
  searchParams: { page: string; status: string; search: string }
}) => {
  const params = await searchParams
  const page = params?.page || '1'
  const status = params?.status || 'all'

  const query = new URLSearchParams()
  query.set('page', page)
  if (status !== 'all') {
    query.set('status', status)
  }

  const assets = await getAssetsByPagnition(query.toString())
  return (
    <>
      <PageHeader title="Quản lý tài sản" />
      <AssetClientWrapper assets={assets} status={status} />
    </>
  )
}

export default AssetPage
