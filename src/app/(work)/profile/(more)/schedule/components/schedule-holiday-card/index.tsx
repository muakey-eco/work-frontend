import { EditOutlined } from '@ant-design/icons'
import { Button, Card, CardProps } from 'antd'
import React from 'react'
import ScheduleHolidayModalForm from './ScheduleHolidayModalForm'

export type ScheduleHolidayCardProps = CardProps & {
  title: React.ReactNode
  extra?: React.ReactNode
  options?: any
}

const ScheduleHolidayCard: React.FC<ScheduleHolidayCardProps> = ({
  title,
  extra,
  options,
  ...props
}) => {
  const { accountProfile, user } = options
  return (
    <Card
      classNames={{
        body: '!space-y-[16px]',
      }}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="text-[20px] leading-[28px] font-[500]">{title}</div>
        {extra || (
          <ScheduleHolidayModalForm
            initialValues={accountProfile?.dayoff_account}
            user={user}
          >
            <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
          </ScheduleHolidayModalForm>
        )}
      </div>

      <div className="flex items-center gap-[16px]">
        <div className="flex-1 space-y-[8px]">
          <div className="text-[14px] leading-[22px] text-[#00000073]">
            Tổng ngày phép có hưởng lương
          </div>
          <div className="text-[14px] leading-[22px] font-[600]">
            {accountProfile?.dayoff_account?.total_holiday_with_salary || 0}{' '}
            ngày
          </div>
        </div>
        <div className="flex-1 space-y-[8px]">
          <div className="text-[14px] leading-[22px] text-[#00000073]">
            Phép thâm niên
          </div>
          <div className="text-[14px] leading-[22px] font-[600]">
            {accountProfile?.dayoff_account?.seniority_holiday || 0} ngày
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ScheduleHolidayCard
