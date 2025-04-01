'use client'

import { App, Button, DatePicker, DatePickerProps, Form, Input } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { addProposeAction } from '../../app/(work)/check-in/components/checkin-form/action'
import FormCard from './FormCard'

type CheckInTimeEditFormProps = {
  initialValues?: any
}

const FormFields: React.FC<{
  initialValues?: any
  onDateChange?: DatePickerProps['onChange']
}> = ({ initialValues, onDateChange }) => {
  const attendances = initialValues?.attendances

  return (
    <>
      <Form.Item
        className="w-[230px]"
        label="Ngày"
        name="date"
        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
      >
        <DatePicker
          className="w-full"
          locale={locale}
          onChange={onDateChange}
        />
      </Form.Item>

      <div className="flex items-center gap-[24px]">
        <FormCard
          className="flex-1"
          title="Giờ kế hoạch"
          checkIn={
            attendances?.checkin
              ? dayjs(attendances?.checkin).format('HH:mm:ss')
              : '09:00:00'
          }
          checkOut={
            attendances?.check_out_regulation
              ? dayjs(attendances?.check_out_regulation).format('HH:mm:ss')
              : '18:30:00'
          }
        />
        <FormCard
          className="flex-1"
          title="Giờ thực tế"
          checkIn={
            attendances?.checkin
              ? dayjs(attendances?.checkin).format('HH:mm:ss')
              : '09:00:00'
          }
          checkOut={
            attendances?.checkout
              ? dayjs(attendances?.checkout).format('HH:mm:ss')
              : '--:--:--'
          }
        />
        <FormCard
          className="flex-1"
          title="Sửa giờ vào/ra"
          checkIn={
            <Form.Item
              className="mb-0!"
              name="check_in"
              rules={[{ required: true, message: 'Vui lòng chọn giờ vào' }]}
            >
              <DatePicker
                className="w-full"
                locale={locale}
                picker="time"
                showSecond={false}
              />
            </Form.Item>
          }
          checkOut={
            <Form.Item
              className="mb-0!"
              name="check_out"
              rules={[{ required: true, message: 'Vui lòng chọn giờ ra' }]}
            >
              <DatePicker
                className="w-full"
                locale={locale}
                picker="time"
                showSecond={false}
              />
            </Form.Item>
          }
        />
      </div>

      <Form.Item
        className="mt-[24px]"
        name="description"
        label="Lý do sửa giờ vào/ra"
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

const CheckInTimeEditForm: React.FC<CheckInTimeEditFormProps> = ({
  initialValues,
}) => {
  const { mode, attendances, ...restInitialVlues } = initialValues

  const [loading, setLoading] = useState(false)
  const [dateVal, setDateVal] = useState(restInitialVlues?.date || undefined)

  const [form] = Form.useForm()
  const { message } = App.useApp()
  const router = useRouter()

  const dateStr = dateVal
    ? String(dayjs(dateVal).format('YYYY-MM-DD'))
    : undefined
  const dateTarget = attendances?.find((a: any) => {
    const dateTargetStr = String(dayjs(a?.checkin).format('YYYY-MM-DD'))

    return (
      dateStr === dateTargetStr && restInitialVlues?.user?.id === a?.account_id
    )
  })

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    const { check_in, check_out, date } = formData

    const startDate = `${String(dayjs(date).format('YYYY-MM-DD'))} ${check_in ? String(dayjs(check_in).format('HH:mm:ss')) : ''}`
    const endDate = `${String(dayjs(date).format('YYYY-MM-DD'))} ${check_out ? String(dayjs(check_out).format('HH:mm:ss')) : ''}`

    try {
      const { message: msg, errors } = await addProposeAction({
        name: 'Sửa giờ vào ra',
        start_time: startDate.trim(),
        end_time: endDate.trim(),
        propose_category_id: 6,
      })

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Gửi yêu cầu thành công')
      setLoading(false)
      form.resetFields()
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  if (mode === 'modal') {
    return (
      <FormFields
        initialValues={{
          attendances: dateTarget,
          check_in: dateVal,
        }}
        onDateChange={(d) => setDateVal(d)}
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
          ...restInitialVlues,
          date: dayjs(restInitialVlues?.date),
          check_in: dayjs(dateVal),
        }}
      >
        <FormFields
          initialValues={{ attendances: dateTarget }}
          onDateChange={(d) => setDateVal(d)}
        />

        <Form.Item className="mb-0!">
          <Button type="primary" htmlType="submit" loading={loading}>
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CheckInTimeEditForm
