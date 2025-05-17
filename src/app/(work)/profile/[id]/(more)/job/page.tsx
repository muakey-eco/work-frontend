import { getUserAccount } from '@/libs/data'
import JobInfomationCard from './components/job-infomation-card'
import JobProgressCard from './components/job-progress-card'
import JobSalaryCard from './components/job-salary-card'

type Props = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const JobPage = async ({ params }: Props) => {
  const resolvedParams = await params
  const userAccount = await getUserAccount(Number(resolvedParams.id))

  return (
    <div className="no-scroll h-[calc(100vh-87px)] !space-y-[16px] overflow-y-auto">
      <JobInfomationCard title="Thông tin công việc" data={userAccount} />

      <JobSalaryCard title="Thành phần lương" data={userAccount} />

      <JobProgressCard
        title="Lịch sử phát triển sự nghiệp"
        data={userAccount}
        id={resolvedParams.id}
      />
    </div>
  )
}

export default JobPage
