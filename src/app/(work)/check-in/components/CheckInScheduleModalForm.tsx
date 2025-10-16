'use client'

import { App, DatePicker, Form, Input, Modal, ModalProps, Radio } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { addWorkScheduleAction, updateWorkScheduleAction } from './action'

type CheckInScheduleModalFormProps = ModalProps & {
  children?: React.ReactNode
  initialValues?: any
}

const CheckInScheduleModalForm: React.FC<CheckInScheduleModalFormProps> = ({
  children,
  initialValues,
  ...rest
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [idsNotSalary, setIdsNotSalary] = useState<any[]>([])
  const [idsHaveSalary, setIdsHaveSalary] = useState<any[]>([])
  const { message } = App.useApp()
  const router = useRouter()

  const [mode, setMode] = useState<'multiple' | 'range'>('multiple')

  const { workSchedule } = initialValues

  const workScheduleFiltered = workSchedule?.filter(
    (s: any) => s?.go_to_work === 0,
  )
  const handleSubmit = async (formData?: any) => {
    setLoading(true)

    const {
      multiple_ids_not_salary,
      multiple_ids_have_salary,
      range_ids,
      ...restFormData
    } = formData
    console.log('formData', formData)

    const nextSchedule = await addWorkScheduleAction()

    const schedules = [...workSchedule, ...nextSchedule]
    const mapSelectedDatesToIds = (dates?: Date[]) =>
      dates?.map((date: Date) => {
        const dateStr = String(dayjs(date).format('YYYY-MM-DD'))
        const schedule = schedules?.find((s: any) => s?.day_of_week === dateStr)
        return schedule?.id || null
      })

    const dayOffIds = mapSelectedDatesToIds(multiple_ids_not_salary)
    const dayOffHaveSalaryIds = mapSelectedDatesToIds(multiple_ids_have_salary)

    const allSelectedDateStrs = new Set(
      [
        ...(multiple_ids_not_salary || []),
        ...(multiple_ids_have_salary || []),
      ].map((d: Date) => String(dayjs(d).format('YYYY-MM-DD'))),
    )

    // ngày còn lại trong tháng sau khi loại bỏ ngày nghỉ có lương và không lương 
    const dayWorkIds = workScheduleFiltered
      ?.filter((w: any) => !allSelectedDateStrs.has(String(w?.day_of_week)))
      .map((w: any) => w?.id)

    try {
      const { description } = restFormData || {}

      const payload = !!range_ids
        ? {
          description,
          start_date: String(dayjs(range_ids[0]).format('DD-MM-YYYY')),
          end_date: String(dayjs(range_ids[1]).format('DD-MM-YYYY')),
        }
        : {
          description,
          is_holiday: (dayOffIds || []).filter((v: any) => v != null),
          is_holiday_have_salary: (dayOffHaveSalaryIds || []).filter((v: any) => v != null),
          is_not_holiday: (dayWorkIds || []).filter((v: any) => v != null),
        }

      const { message: msg, errors } = await updateWorkScheduleAction(payload)

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Cập nhật thành công')
      setOpen(false)
      setLoading(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  const modeOptions = [
    { label: 'Chọn nhiều ngày', value: 'multiple' },
    { label: 'Chọn khoảng thời gian', value: 'range' },
  ]

  useEffect(() => {
    if (!open) {
      setMode('multiple')
      return
    }

    if (mode === 'multiple') {
      setIdsNotSalary(
        workSchedule
          ?.filter((s: any) => s?.go_to_work === 0 && (s?.is_have_salary) === false)
          ?.map((s: any) => dayjs(s?.day_of_week)),
      )

      setIdsHaveSalary(
        workSchedule
          ?.filter((s: any) => s?.go_to_work === 0 && (s?.is_have_salary) === true)
          ?.map((s: any) => dayjs(s?.day_of_week)),
      )
    } else {
      setIdsNotSalary([])
      setIdsHaveSalary([])
    }
  }, [mode, open, workSchedule])

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Modal
        title="Cập nhật lịch làm việc"
        open={open}
        onCancel={() => setOpen(false)}
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            layout="vertical"
            initialValues={{
              multiple_ids_not_salary: idsNotSalary,
              multiple_ids_have_salary: idsHaveSalary,
            }}
            onFinish={handleSubmit}
          >
            {dom}
          </Form>
        )}
        width={760}
        destroyOnClose
        {...rest}
      >
        <div className="item-center my-[12px] flex gap-[12px]">
          <span>Hình thức: </span>
          <Radio.Group
            options={modeOptions}
            onChange={(e) => setMode(e.target.value)}
            value={mode}
          />
        </div>

        {mode === 'multiple' ? (
          <>
            <Form.Item
              name="multiple_ids_not_salary"
              label="Chọn ngày nghỉ"
              rules={[
                {
                  required: true,
                  message: 'Chưa chọn ngày',
                },
              ]}
            >
              <DatePicker
                multiple
                locale={locale}
              />
            </Form.Item>

            <Form.Item
              name="multiple_ids_have_salary"
              label="Chọn ngày nghỉ có lương"
            >
              <DatePicker
                multiple
                locale={locale}
              />
            </Form.Item></>
        ) : (
          <Form.Item
            name="range_ids"
            label="Chọn ngày nghỉ"
            rules={[
              {
                required: true,
                message: 'Chưa chọn ngày',
              },
            ]}
          >
            <DatePicker.RangePicker
              className="w-full"
              locale={locale}
            />
          </Form.Item>
        )}

        <Form.Item name="description" label="Ghi chú">
          <Input.TextArea
            autoSize={{ minRows: 6 }}
            placeholder="Ghi chú ngày nghỉ"
          />
        </Form.Item>
      </Modal >
    </>
  )
}

export default CheckInScheduleModalForm
