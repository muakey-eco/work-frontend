import CompareData from '@/app/(work)/compare-data/page'
import ReportPage from '@/app/(work)/report/page'
import StatisticsPage from '@/app/(work)/statistics/page'

const OverviewPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ department_id: string; tab: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { department_id, tab } = await params
  const resolvedSearchParams = await searchParams

  switch (tab) {
    case 'statistics':
      return <StatisticsPage searchParams={resolvedSearchParams} />
    case 'compare-data':
      return <CompareData />
    default:
      return department_id === '2' ? (
        <ReportPage />
      ) : (
        <StatisticsPage searchParams={resolvedSearchParams} />
      )
  }
}

export default OverviewPage
