'use client'

import { addProposeAction } from '@/app/(work)/check-in/components/checkin-form/action'
import { Alert, App, Button, DatePicker, Form, Input } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
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

        <Form.Item name="description" label="Lý do đăng ký WFH">
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
  const { user } = initialValues

  const { message } = App.useApp()
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const [dateWFH, setDateWFH] = useState<any>(new Date())

  const list = [
    {
      label: 'Ngày WFH chưa sử dụng',
      value: user?.work_from_home - user?.WFM_this_month,
    },
    {
      label: 'Ngày WFH đã sử dụng',
      value: user?.WFM_this_month,
    },
    {
      label: 'Tổng số ngày được WFH trong 1 tháng',
      value: user?.work_from_home,
    },
  ]

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    const { dateWFH, description } = formData

    if (user?.WFM_this_month > user?.work_from_home) {
      message.error('Bạn đã sử dụng hết số ngày WFH cho tháng này')
      setLoading(false)
      return
    }

    try {
      const { message: msg, errors } = await addProposeAction({
        name: 'Đăng ký WFH',
        propose_category: 'Đăng ký WFH',
        date_wfh: dayjs(dateWFH).format('YYYY-MM-DD HH:mm:ss'),
        description,
      })

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      setLoading(false)
      message.success('Gửi yêu cầu thành công')
      form.resetFields()
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
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
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <FormFields />
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
