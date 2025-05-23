import ReportPage from '@/app/(work)/report/page'
import StatisticsPage from '@/app/(work)/statistics/page'

const page = async ({
  params,
}: {
  params: Promise<{ department_id: string }>
}) => {
  const { department_id } = await params
  return (
    <div>{department_id === '2' ? <ReportPage /> : <StatisticsPage />}</div>
  )
}

export default page
