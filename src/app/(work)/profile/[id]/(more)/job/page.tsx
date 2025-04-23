import { getUserAccount } from '@/libs/data'
import React from 'react'
import JobInfomationCard from './components/job-infomation-card'
import JobProgressCard from './components/job-progress-card'
import JobSalaryCard from './components/job-salary-card'

const JobPage: React.FC<{ params: { id: string } }> = async ({ params }) => {
  const userAccount = await getUserAccount(Number(params.id))

  return (
    <div className="no-scroll h-[calc(100vh-87px)] !space-y-[16px] overflow-y-auto">
      <JobInfomationCard title="Thông tin công việc" data={userAccount} />

      <JobSalaryCard title="Thành phần lương" data={userAccount} />

      <JobProgressCard
        title="Lịch sử phát triển sự nghiệp"
        data={userAccount}
      />
    </div>
  )
}

export default JobPage
