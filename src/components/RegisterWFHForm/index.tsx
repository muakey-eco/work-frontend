'use client'

import { Alert, Button, DatePicker, Form, Input } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import React, { useState } from 'react'

type RegisterWFHFormProps = {
  initialValues?: any
}
const FormFields: React.FC<{
  dateWFH?: any
  initialValues?: any
}> = ({ dateWFH, initialValues }) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-[16px]">
          <Form.Item label="Ngày WFH" name="dateWFH">
            <DatePicker className="w-[229px]" locale={locale} />
          </Form.Item>
          <Alert
            message="Lưu ý: Ngày công khi làm việc WFH sẽ được tính 80% so với ngày công làm việc trực tiếp tại công ty."
            type="warning"
            showIcon
            className="h-[44px] w-[484px] px-3 py-2 !text-[12px] leading-[18px]"
          />
        </div>

        <Form.Item className="" name="description" label="Lý do đăng ký nghỉ">
          <Input.TextArea
            autoSize={{
              minRows: 3,
            }}
          />
        </Form.Item>
      </div>
    </>
  )
}

const RegisterWFHForm: React.FC<RegisterWFHFormProps> = ({ initialValues }) => {
  //   const { user } = initialValues
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const [timestamps, setTimestamps] = useState<any>({})
  const list = [
    {
      label: 'Ngày WFH chưa sử dụng',
      value: 1,
      //   user?.day_off - user?.day_off_used
    },
    {
      label: 'Ngày WFH đã sử dụng',
      value: 4,
      //user?.day_off_used
    },
    {
      label: 'Tổng số ngày được WFH trong 1 tháng',
      value: 5,
      //user?.day_off
    },
  ]

  const handleSubmit = async (formData: any) => {
    setLoading(true)
  }

  return (
    <>
      <div className="flex items-center rounded-[16px] bg-[#fff] p-[24px]">
        {list.map((l: any, index) => (
          <div key={index} className="flex-1 text-center">
            <div className="mb-[4px] text-[14px] leading-[22px] text-[#00000073]">
              {l.label}
            </div>
            <div className="text-[24px] leading-[38px]">{l.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-[16px] rounded-[16px] bg-[#fff] p-[16px]">
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={(_, { timestamps }) => {
            setTimestamps(timestamps[0])
          }}
          form={form}
          initialValues={{
            type: 'Nghỉ không hưởng lương',
            timestamps: [
              {
                isDefault: true,
                startDate: dayjs(initialValues?.date),
              },
            ],
          }}
        >
          <FormFields
            initialValues={{
              startDate: initialValues?.date,
            }}
          />

          <Form.Item className="mt-[24px] mb-0!">
            <Button htmlType="submit" type="primary" loading={loading}>
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default RegisterWFHForm
