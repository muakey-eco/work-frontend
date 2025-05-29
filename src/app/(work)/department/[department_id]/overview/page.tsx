import ReportPage from '@/app/(work)/report/page'
import StatisticsPage from '@/app/(work)/statistics/page'

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ department_id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { department_id } = await params
  const resolvedSearchParams = await searchParams
  return (
    <div>
      {department_id === '2' ? (
        <ReportPage />
      ) : (
        <StatisticsPage searchParams={resolvedSearchParams} />
      )}
    </div>
  )
}

export default page
