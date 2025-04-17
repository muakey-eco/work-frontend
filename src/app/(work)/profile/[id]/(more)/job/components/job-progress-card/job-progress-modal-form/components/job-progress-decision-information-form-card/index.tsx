import { TiptapEditor } from '@/components'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Card, Form, Upload } from 'antd'
import React from 'react'

export type JobProgressDecisionInformationFormCardProps = {
  title?: string
}

const JobProgressDecisionInformationFormCard: React.FC<
  JobProgressDecisionInformationFormCardProps
> = ({ title }) => {
  return (
    <Card>
      <div className="mb-[16px] text-[14px] leading-[22px] font-[600]">
        {title}
      </div>

      <Form.Item className="mb-[16px]!" name="decision_info">
        <TiptapEditor />
      </Form.Item>

      <Form.Item
        className="mb-0! flex-1"
        label="Tệp đính kèm"
        name="attachment"
      >
        <Upload>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
    </Card>
  )
}

export default JobProgressDecisionInformationFormCard
