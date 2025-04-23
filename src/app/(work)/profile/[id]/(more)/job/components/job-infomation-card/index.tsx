import { EditOutlined } from '@ant-design/icons'
import { Badge, Button, Card, ListProps } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'
import JobInfomationList from './JobInfomationList'
import JobInfomationModalForm from './JobInfomationModalForm'

export type JobInfomationCardProps = {
  title?: string
  extra?: React.ReactNode
  data?: any
}

const JobInfomationCard: React.FC<JobInfomationCardProps> = ({
  title,
  data: externalData,
  extra,
}) => {
  const data: ListProps<any>['dataSource'] = [
    {
      label: 'Phòng ban',
      value: externalData?.department_name || '--',
    },
    {
      label: 'Chức danh',
      value: externalData?.position || '--',
    },
    {
      label: 'Trạng thái',
      value: (
        <Badge
          status="success"
          text={
            <span className="text-[14px] leading-[22px] font-[600]">
              {externalData?.status}
            </span>
          }
        />
      ),
    },
    {
      label: 'Phân loại nhân sự',
      value:
        String(externalData?.employee_type).charAt(0).toUpperCase() +
          String(externalData?.employee_type).slice(1) || '--',
    },
    {
      label: 'Ngày bắt đầu làm việc',
      value: externalData?.start_trial_date
        ? dayjs(externalData?.start_trial_date).format('DD/MM/YYYY')
        : '--',
    },
    {
      label: 'Ngày chính thức',
      value: externalData?.start_work_date
        ? dayjs(externalData?.start_work_date).format('DD/MM/YYYY')
        : '--',
    },
    {
      label: 'Thông tin hợp đồng',
      value: (
        <Link href={`/profile/${externalData?.id}/contract`}>
          <span className="text-[14px] leading-[22px] font-bold text-[#1890FF] hover:underline">
            Xem hợp đồng
          </span>
        </Link>
      ),
    },
    {
      label: 'Giấy tờ nhân sự',
      value: (
        <Link href={`/profile/${externalData?.id}/contract`}>
          <span className="text-[14px] leading-[22px] font-bold text-[#1890FF] hover:underline">
            Xem giấy tờ
          </span>
        </Link>
      ),
    },
  ]

  return (
    <Card
      classNames={{
        body: 'space-y-[16px]!',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[20px] leading-[28px] font-[500]">{title}</div>
        {extra || (
          <JobInfomationModalForm initialValues={externalData}>
            <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
          </JobInfomationModalForm>
        )}
      </div>

      <JobInfomationList dataSource={data} />
    </Card>
  )
}

export default JobInfomationCard
