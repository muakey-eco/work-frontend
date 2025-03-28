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
  const [dateStrings, setDateStrings] = useState<string[]>([])
  const [ids, setIds] = useState<any[]>([])
  const { message } = App.useApp()
  const router = useRouter()

  const [mode, setMode] = useState<'multiple' | 'range'>('multiple')

  const { workSchedule } = initialValues

  const workScheduleFiltered = workSchedule?.filter(
    (s: any) => s?.go_to_work === 0,
  )
  const handleSubmit = async (formData?: any) => {
    setLoading(true)

    const { multiple_ids, range_ids, ...restFormData } = formData

    const nextSchedule = await addWorkScheduleAction()

    const dayOffIds = multiple_ids?.map((date: Date) => {
      const dateStr = String(dayjs(date).format('YYYY-MM-DD'))

      const schedule = [...workSchedule, ...nextSchedule]?.find(
        (s: any) => s?.day_of_week === dateStr,
      )

      return schedule?.id || null
    })

    const dayWorkIds = workScheduleFiltered
      ?.filter((w: any) => !dateStrings?.includes(w?.day_of_week))
      .map((w: any) => w?.id)

    try {
      const { message: msg, errors } = await updateWorkScheduleAction({
        ...restFormData,
        ...(!!range_ids
          ? {
              start_date: String(dayjs(range_ids[0]).format('DD-MM-YYYY')),
              end_date: String(dayjs(range_ids[1]).format('DD-MM-YYYY')),
            }
          : {
              is_holiday: dayOffIds,
              is_not_holiday: dayWorkIds,
            }),
      })

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

    setIds(
      mode === 'multiple'
        ? workScheduleFiltered?.map((s: any) => dayjs(s?.day_of_week))
        : undefined,
    )
  }, [mode, open, workScheduleFiltered])

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
              multiple_ids: ids,
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
          <Form.Item
            name="multiple_ids"
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
              onChange={(_, dateStr) =>
                setDateStrings(
                  typeof dateStr === 'string' ? [dateStr] : [...dateStr],
                )
              }
            />
          </Form.Item>
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
              onChange={(_, dateStr) =>
                setDateStrings(
                  typeof dateStr === 'string' ? [dateStr] : [...dateStr],
                )
              }
            />
          </Form.Item>
        )}

        <Form.Item name="description" label="Ghi chú">
          <Input.TextArea
            autoSize={{ minRows: 6 }}
            placeholder="Ghi chú ngày nghỉ"
          />
        </Form.Item>
      </Modal>
    </>
  )
}

export default CheckInScheduleModalForm
