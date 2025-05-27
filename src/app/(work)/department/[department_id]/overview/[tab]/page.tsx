import CompareData from '@/app/(work)/compare-data/page'
import ReportPage from '@/app/(work)/report/page'
import StatisticsPage from '@/app/(work)/statistics/page'

const OverviewPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ department_id: string; tab: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const { department_id, tab } = await params

  switch (tab) {
    case 'report':
      return department_id === '2' ? (
        <ReportPage searchParams={searchParams} />
      ) : (
        <StatisticsPage searchParams={searchParams} />
      )
    case 'statistics':
      return <StatisticsPage searchParams={searchParams} />
    case 'compare-data':
      return <CompareData searchParams={searchParams} />
    default:
      return department_id === '2' ? (
        <ReportPage searchParams={searchParams} />
      ) : (
        <StatisticsPage searchParams={searchParams} />
      )
  }
}

export default OverviewPage
