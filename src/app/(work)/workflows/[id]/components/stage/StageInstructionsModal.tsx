'use client'

import { TiptapEditor } from '@/components'
import { App, Breadcrumb, Button, Empty, Form, Modal, ModalProps } from 'antd'
import React, { useState } from 'react'
import { Converter } from 'showdown'
import { editStageAction } from '../../../action'

export type StageInstructionsModalProps = ModalProps & {
  children: React.ReactNode
  inititalValues?: any
  onSubmit?: (formData: any) => void
}

const StageInstructionsModal: React.FC<StageInstructionsModalProps> = ({
  children,
  inititalValues,
  onSubmit,
  ...rest
}) => {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const { stage_id, ...restInitialValues } = inititalValues
  const converter = new Converter()
  const { message } = App.useApp()

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    onSubmit?.(formData)

    try {
      var { message: msg, errors } = await editStageAction(stage_id, {
        description: converter.makeHtml(formData?.description),
      })

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      setOpen(false)
      setEdit(false)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Modal
        classNames={{
          mask: 'z-auto!',
          wrapper: 'z-auto!',
        }}
        title="Hướng dẫn hoàn thành các nhiệm vụ trong giai đoạn"
        open={open}
        onCancel={() => {
          setOpen(false)
          setEdit(false)
        }}
        footer={null}
        width={600}
        destroyOnClose
        {...rest}
      >
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[12px] rounded-[16px] border bg-[#f6f6f6] px-[16px] py-[12px]">
            <div className="text-[20px] leading-[22px] font-[600]">Góp ý</div>
            <Breadcrumb
              items={[
                {
                  title: 'Góp ý Base Work',
                },
                {
                  title: 'Góp ý',
                },
              ]}
            />
          </div>

          <div className="flex items-center justify-between gap-[12px]">
            <span className="text-[16px] leading-[24px] font-[600]">
              Hướng dẫn
            </span>
            <span
              className="cursor-pointer text-[14px] leading-[22px] text-[#1677ff]"
              onClick={() => setEdit(!edit)}
            >
              Chỉnh sửa
            </span>
          </div>

          {edit ? (
            <Form
              initialValues={{
                description: restInitialValues?.description || '',
              }}
              onFinish={handleSubmit}
            >
              <Form.Item name="description" valuePropName="content">
                <TiptapEditor placeholder="Mô tả giai đoạn" />
              </Form.Item>
              <Form.Item>
                <div className="flex items-center justify-end gap-[12px]">
                  <Button onClick={() => setEdit(false)}>Bỏ qua</Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Cập nhật
                  </Button>
                </div>
              </Form.Item>
            </Form>
          ) : inititalValues?.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: converter.makeHtml(inititalValues?.description || ''),
              }}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có hướng dẫn"
            />
          )}
        </div>
      </Modal>
    </>
  )
}

export default StageInstructionsModal
