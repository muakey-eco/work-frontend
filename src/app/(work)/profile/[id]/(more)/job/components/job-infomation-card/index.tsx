import { EditOutlined, PaperClipOutlined } from '@ant-design/icons'
import { Badge, Button, Card, ListProps } from 'antd'
import dayjs from 'dayjs'
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
      value: externalData?.personnel_class || '--',
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
        <div className="flex items-center gap-[8px]">
          <PaperClipOutlined className="text-[#00000073]!" />
          <span className="text-[14px] leading-[22px] font-[400] text-[#1890FF]">
            xxx.pdf
          </span>
        </div>
      ),
    },
    {
      label: 'Giấy tờ nhân sự',
      value: (
        <div className="flex items-center gap-[8px]">
          <PaperClipOutlined className="text-[#00000073]!" />
          <span className="text-[14px] leading-[22px] font-[400] text-[#1890FF]">
            xxx.pdf
          </span>
        </div>
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
