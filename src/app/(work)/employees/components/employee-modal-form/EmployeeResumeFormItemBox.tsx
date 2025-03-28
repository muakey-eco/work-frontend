import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Upload } from 'antd'
import React from 'react'

export type EmployeeResumeFormItemBoxProps = {
  className?: string
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e
  }
  return e && e.fileList
}

const EmployeeResumeFormItemBox: React.FC<EmployeeResumeFormItemBoxProps> = ({
  className,
}) => {
  return (
    <div className={className}>
      <div className="mb-[16px] text-[16px] leading-[24px] font-[600]">
        Hồ sơ xin việc
      </div>

      <Form.Item
        className="mb-0!"
        name="fileList"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload multiple>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
    </div>
  )
}

export default EmployeeResumeFormItemBox
