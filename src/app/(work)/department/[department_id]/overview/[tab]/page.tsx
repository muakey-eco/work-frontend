import CompareData from '@/app/(work)/compare-data/page'
import ReportPage from '@/app/(work)/report/page'
import StatisticsPage from '@/app/(work)/statistics/page'

const OverviewPage = async ({
  params,
}: {
  params: Promise<{ department_id: string; tab: string }>
}) => {
  const { department_id, tab } = await params

  switch (tab) {
    case 'report':
      return department_id === '2' ? <ReportPage /> : <StatisticsPage />
    case 'statistics':
      return <StatisticsPage />
    case 'compare-data':
      return <CompareData />
    default:
      return department_id === '2' ? <ReportPage /> : <StatisticsPage />
  }
}

export default OverviewPage
