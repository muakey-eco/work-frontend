import { getWorkflowById } from '@/libs/data'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'

type JobOverViewProps = {
  task?: any
  members?: any[]
  currentStage?: string
}

const JobOverView: React.FC<JobOverViewProps> = async ({
  task,
  members,
  currentStage
}) => {
  const workflow = await getWorkflowById(task?.workflow_id)

  return (
    <div className="space-y-[6px] rounded-[6px] bg-[#fff] px-[20px] py-[16px] text-[13px]">
      <div className="mb-[12px] font-[600] text-[#888]">THÔNG TIN NHIỆM VỤ</div>
      <div>
        Mã nhiệm vụ: <span className="font-[700]">{task?.code}</span>
      </div>
      <div>
        Cập nhật gần nhất lúc {dayjs(task?.updated_at).format('DD/MM/YYYY')}
      </div>
      <div className="flex items-center gap-[4px]">
        <p>Quy trình:</p>{' '}
        <Link
          href={`/workflows/${workflow?.id}`}
          className="text-[12px] leading-normal font-bold text-[#0958D9]"
        >
          {workflow?.name}
        </Link>
      </div>
      <div>
        Người tạo nhiệm vụ:{' '}
        <span className="font-[700]">
          {task?.creator_by?.full_name || 'Không có người tạo'}
        </span>
      </div>
      <div>
        Giai đoạn hiện tại: <span className="font-[700]">{currentStage}</span>
      </div>
      <div>
        Người thực thi giai đoạn:{' '}
        <span className="font-[700]">
          {task?.account?.full_name || 'Không có người thực thi'}
        </span>
      </div>
    </div>
  )
}

export default JobOverView
