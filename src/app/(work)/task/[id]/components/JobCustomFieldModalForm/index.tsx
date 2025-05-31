'use client'

import { UploadOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  DatePicker,
  Form,
  FormInstance,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from 'antd'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { editTaskAction, uploadImageAction } from '../../../actions'

type JobCustomFieldModalFormProps = {
  children?: React.ReactNode
  initialValues?: any
}

const generateInitialValues = (type: string, value: any) => {
  switch (type) {
    case 'date':
      return dayjs(dayjs(value).format('YYYY-MM-DD')).valueOf()

    default:
      return value
  }
}

const JobCustomFieldModalForm: React.FC<JobCustomFieldModalFormProps> = ({
  children,
  initialValues,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [image, setImage] = useState<{ url: string; preview: string }>({
    url: '',
    preview: '',
  })
  const formRef = useRef<FormInstance>(null)
  const { message } = App.useApp()

  const {
    require,
    taskId,
    value: defaultValue,
    fieldId,
    options,
    ...rest
  } = initialValues

  const initVal = generateInitialValues(rest?.type, defaultValue)

  const handleUpload = useCallback(
    async (info: UploadChangeParam<UploadFile<File>>) => {
      const { file } = info
      const formData = new FormData()

      formData.append('image', file.originFileObj || '')

      try {
        const { url, error } = await uploadImageAction(formData)

        if (error) {
          toast.error(error)
          return
        }

        setImage(() => ({
          url,
          preview: file.originFileObj
            ? URL.createObjectURL(file.originFileObj)
            : '',
        }))
      } catch (error: any) {
        throw new Error(error)
      }
    },
    [],
  )

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true)
      var { error, success } = await editTaskAction(taskId, {
        fields: [
          {
            id: fieldId,
            value: rest?.type === 'file' ? image.url : formData?.value,
          },
        ],
      })

      if (error) {
        message.error(error)
        setOpen(false)
        return
      }

      message.success(`Cập nhật trường ${rest?.name} thành công`)
      router.refresh()
      setOpen(false)
      setLoading(false)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  useEffect(() => {
    formRef.current?.resetFields()
  }, [open])

  useEffect(() => {
    if (image.preview) {
      return () => URL.revokeObjectURL(image.preview)
    }
  }, [image])

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        {children}
      </div>
      <Modal
        title={`CHỈNH SỬA ${String(rest?.name).toLocaleUpperCase()}`}
        open={open}
        width={520}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <Form
          onFinish={handleSubmit}
          labelCol={{ flex: '24px' }}
          wrapperCol={{ flex: 1 }}
          initialValues={{
            ...rest,
            value: initVal,
          }}
          ref={formRef}
        >
          <Form.Item
            label={rest?.name}
            name="value"
            rules={
              require
                ? [
                    {
                      required: true,
                      message: 'Trường này không được để trống.',
                    },
                  ]
                : undefined
            }
            layout="vertical"
            getValueProps={(value) => ({
              value:
                rest?.type === 'date' ? value && dayjs(Number(value)) : value,
            })}
          >
            {rest?.type === 'date' && (
              <DatePicker
                className="w-full"
                placeholder={rest?.name}
                format={(time) => String(dayjs(time).format('DD-MM-YYYY'))}
              />
            )}
            {rest?.type === 'paragraph' && <Input placeholder={rest?.name} />}
            {rest?.type === 'number' && (
              <InputNumber
                className="w-full"
                placeholder={String(rest?.name)}
              />
            )}
            {rest?.type === 'file' && (
              <>
                <Upload itemRender={() => <></>} onChange={handleUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <div className="mt-[8px]">
                  {(defaultValue || image.preview) && (
                    <Image
                      src={defaultValue || image.preview}
                      width="100%"
                      height="100%"
                      alt="Preview Image"
                    />
                  )}
                </div>
              </>
            )}
            {rest?.type === 'list' && (
              <Select
                options={options?.map((val: any) => ({
                  title: val,
                  value: val,
                }))}
                mode="multiple"
                placeholder="Chọn danh sách"
              />
            )}
          </Form.Item>
          <Form.Item>
            <div className="flex items-center gap-[16px]">
              <Button className="flex-1" onClick={() => setOpen(false)}>
                Bỏ qua
              </Button>
              <Button
                className="flex-1"
                color="primary"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Cập nhật
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default JobCustomFieldModalForm
