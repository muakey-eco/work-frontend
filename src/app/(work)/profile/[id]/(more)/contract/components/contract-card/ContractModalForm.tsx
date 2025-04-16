'use client'

import { TiptapEditor } from '@/components'
import { mapAsFile } from '@/lib/utils'
import { useAsyncEffect } from '@/libs/hook'
import { UploadOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormProps,
  Input,
  Modal,
  ModalProps,
  Radio,
  Select,
  SelectProps,
  Upload,
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {
  addContractAction,
  getContractCategoriesAction,
  updateContractAction,
  uploadFilesAction,
} from '../../../action'

type ContractModalFormProps = ModalProps & {
  children?: React.ReactNode
  formProps?: FormProps
  action?: 'create' | 'edit'
  initialValues?: any
}

const ContractModalForm: React.FC<ContractModalFormProps> = ({
  children,
  formProps,
  action = 'create',
  initialValues,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contractTypes, setContractTypes] = useState<any[]>([])

  const { message } = App.useApp()
  const router = useRouter()

  const {
    id,
    account_id,
    isPresent,
    status,
    start_date,
    end_date,
    ...restInitialValues
  } = initialValues || {}

  const handleSubmit = async (values: any) => {
    setLoading(true)

    const { fileList, timestamps, ...restValues } = values

    const formValues = {
      ...restValues,
      note: restValues?.note || '',
      start_date: timestamps?.[0]
        ? dayjs(timestamps?.[0]).format('YYYY-MM-DD')
        : undefined,
      end_date: timestamps?.[1]
        ? dayjs(timestamps?.[1]).format('YYYY-MM-DD')
        : undefined,
      account_id: account_id || id || undefined,
    }

    const attachmentList = mapAsFile(
      fileList.filter((fl: any) => !(fl instanceof File)),
    )

    const formData = new FormData()

    attachmentList.forEach((file: any) => {
      formData.append('files[]', file)
    })

    if (action === 'create') {
      for (const key in formValues) {
        formData.append(key, formValues[key])
      }
    }

    try {
      if (action === 'create') {
        var { message: msg, errors } = await addContractAction(
          {},
          {
            body: formData,
          },
        )
      } else {
        const files = await uploadFilesAction(formData)

        var { message: msg, errors } = await updateContractAction(id, {
          ...formValues,
          files: [
            ...initialValues?.files,
            ...(Array.isArray(files) ? files : []),
          ],
        })
      }

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success(
        action === 'create' ? 'Tạo thành công' : 'Cập nhật thành công',
      )
      setOpen(false)
      setLoading(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }

    return e?.fileList
  }

  const typeOptions: SelectProps['options'] = contractTypes.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  const statusOptions = [
    {
      label: 'Đã ký',
      value: 'signed',
    },
    {
      label: 'Chưa ký',
      value: 'not_signed',
    },
  ]

  useAsyncEffect(async () => {
    if (!open) return

    const data = await getContractCategoriesAction()

    setContractTypes(data)
  }, [open])

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        title={action === 'create' ? 'Tạo hợp đồng mới' : 'Chỉnh sửa hợp đồng'}
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        okText={action === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText="Hủy"
        width={846}
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            layout="vertical"
            initialValues={{
              ...restInitialValues,
              isPresent: isPresent || true,
              status: status || 'signed',
              timestamps:
                start_date && end_date
                  ? [dayjs(start_date), dayjs(end_date)]
                  : undefined,
              fileList: Array.isArray(restInitialValues?.files)
                ? initialValues?.files?.map((file: any) => {
                    const fl = new File([file], file?.file_name, {
                      type: 'text/plain',
                    })

                    return fl
                  })
                : [],
            }}
            onFinish={handleSubmit}
            {...formProps}
          >
            {dom}
          </Form>
        )}
        {...props}
      >
        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Nhân sự"
            name="full_name"
          >
            <Input placeholder="Nhập" disabled />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Loại hợp đồng"
            name="category__contract_id"
          >
            <Select options={typeOptions} placeholder="Chọn loại hợp đồng" />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Thời gian (Bắt đầu - kết thúc)"
            name="timestamps"
          >
            <DatePicker.RangePicker className="w-full" locale={locale} />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Trạng thái"
            name="status"
          >
            <Radio.Group options={statusOptions} />
          </Form.Item>
        </div>

        <Form.Item
          className="mb-[16px]! flex-1"
          label="Tệp đính kèm"
          name="fileList"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload multiple>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          className="mb-[16px]! flex-1"
          label="Ghi chú"
          name="note"
          valuePropName="content"
        >
          <TiptapEditor />
        </Form.Item>

        <Form.Item
          className="mb-0! flex-1"
          name="isPresent"
          valuePropName="checked"
        >
          <Checkbox>Hợp đồng hiện tại</Checkbox>
        </Form.Item>
      </Modal>
    </>
  )
}

export default ContractModalForm
