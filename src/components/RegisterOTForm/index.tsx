'use client'

import { calculateDayOffTotal } from '@/libs/utils'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { App, Button, Col, DatePicker, Form, Input, Row } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { addProposeAction } from '../../app/(work)/check-in/components/checkin-form/action'

type RegisterOTFormProps = {
  initialValues?: any
}

const FormFields: React.FC<{
  initialValues?: any
  onStartChange?: (time: any) => void
  onEndChange?: (time: any) => void
}> = ({ initialValues, onStartChange, onEndChange }) => {
  console.log(initialValues)
  return (
    <>
      <div className="flex items-start justify-between gap-[24px]">
        <Form.Item name="date" label="Ngày">
          <DatePicker className="w-[229px]" locale={locale} />
        </Form.Item>

        <div className="text-right">
          <div className="text-[14px] text-[#00000073]">Tổng thời gian OT</div>
          <div className="text-[24px]">{initialValues?.ot} ngày</div>
        </div>
      </div>

      <Form.List name="timestamps" initialValue={initialValues?.timestamps}>
        {(fields, { add, remove }) => (
          <Row gutter={[24, 24]}>
            {fields.map(({ key, name, ...restField }, index) => (
              <Col key={key} span={12}>
                <div className="gutter-row relative overflow-hidden rounded-[16px] border border-[#D9D9D9] bg-[#F6F6F6] px-[24px]! py-[16px]">
                  <div className="mb-[24px]">Thời gian đăng ký OT</div>
                  <div className="flex items-center gap-[24px]">
                    <Form.Item
                      {...restField}
                      className="mb-0! flex-1"
                      name={[name, 'from']}
                      label="Từ giờ"
                    >
                      <DatePicker
                        className="w-full"
                        locale={locale}
                        picker="time"
                        showSecond={false}
                        onChange={(e) => onStartChange?.(e ? e.toDate() : '')}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      className="mb-0! flex-1"
                      name={[name, 'to']}
                      label="Đến giờ"
                    >
                      <DatePicker
                        className="w-full"
                        locale={locale}
                        picker="time"
                        showSecond={false}
                        onChange={(e) => onEndChange?.(e ? e.toDate() : '')}
                      />
                    </Form.Item>
                  </div>

                  <div className="absolute top-0 right-0 flex items-center">
                    <Button
                      type="primary"
                      className="rounded-none rounded-bl-lg bg-[#52C41A]"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Thêm
                    </Button>
                    {index > 0 && (
                      <Button
                        type="primary"
                        className="rounded-none"
                        danger
                        onClick={() => remove(name)}
                        icon={<DeleteOutlined />}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Form.List>

      <Form.Item
        className="mt-[24px]"
        name="description"
        label="Lý do đăng ký OT"
      >
        <Input.TextArea
          autoSize={{
            minRows: 3,
          }}
        />
      </Form.Item>
    </>
  )
}

const RegisterOTForm: React.FC<RegisterOTFormProps> = ({ initialValues }) => {
  const { mode, ...restInitialValues } = initialValues

  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const router = useRouter()

  const [startTime, setStartTime] = useState<any>(new Date())
  const [endTime, setEndTime] = useState<any>()

  const [ot, setOt] = useState(0)

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    const { date, timestamps, ...restFormData } = formData
    const day = String(dayjs(date).format('YYYY-MM-DD'))

    const holiday = timestamps?.map((t: any) => ({
      start_date:
        `${day} ${t?.from ? String(dayjs(t?.from).format('HH:mm:ss')) : ''}`.trim(),
      end_date:
        `${day} ${t?.from ? String(dayjs(t?.to).format('HH:mm:ss')) : ''}`.trim(),
    }))

    try {
      const { message: msg, errors } = await addProposeAction({
        ...restFormData,
        name: 'Đăng ký OT',
        propose_category_id: 4,
        holiday,
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

  useEffect(() => {
    if (!startTime && !endTime) {
      setOt(0)
    }

    if (!startTime || !endTime) return

    const start = new Date(startTime)
    const end = new Date(endTime)

    const total = calculateDayOffTotal(start, end)

    setOt(Number(total.toFixed(3)))
  }, [startTime, endTime])

  if (mode === 'modal') {
    return (
      <FormFields
        initialValues={{
          ...restInitialValues,
          timestamps: [
            {
              from: dayjs(restInitialValues?.date),
            },
          ],
        }}
        onStartChange={setStartTime}
        onEndChange={setEndTime}
      />
    )
  }

  return (
    <div className="rounded-[16px] bg-[#fff] p-[16px]">
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
        initialValues={{
          ...restInitialValues,
          date: dayjs(restInitialValues?.date),
          timestamps: [
            {
              from: dayjs(restInitialValues?.date),
            },
          ],
        }}
      >
        <FormFields
          initialValues={{
            ot,
          }}
          onStartChange={setStartTime}
          onEndChange={setEndTime}
        />

        <Form.Item className="mt-[24px] mb-0!">
          <Button htmlType="submit" type="primary" loading={loading}>
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default RegisterOTForm
