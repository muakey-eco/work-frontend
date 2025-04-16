import { Button, Card, CardProps } from 'antd'
import React from 'react'
import WorkLeaveModalForm from './WorkLeaveModalForm'
import WorkPauseModalForm from './WorkPauseModalform'

export type WorkStatusCardProps = CardProps & {
  title?: string
  user?: any
}

const WorkStatusCard: React.FC<WorkStatusCardProps> = ({
  title,
  user,
  ...props
}) => {
  return (
    <Card
      classNames={{
        body: '!space-y-[16px]',
      }}
      {...props}
    >
      <div className="text-[20px] leading-[28px] font-[500]">{title}</div>

      <div className="flex items-center gap-[16px]">
        <WorkPauseModalForm user={user}>
          <Button block>Kích hoạt trạng thái tạm nghỉ</Button>
        </WorkPauseModalForm>
        <WorkLeaveModalForm user={user}>
          <Button danger block>
            Thôi việc nhân sự
          </Button>
        </WorkLeaveModalForm>
      </div>
    </Card>
  )
}

export default WorkStatusCard
