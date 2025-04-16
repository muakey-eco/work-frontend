'use client'

import { mapAsFile } from '@/lib/utils'
import { UploadOutlined } from '@ant-design/icons'
import { App, Button, Form, FormProps, Modal, ModalProps, Upload } from 'antd'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateAccountAction, uploadFilesAction } from '../../../action'

type ContractDocumentModalFormProps = ModalProps & {
  children?: React.ReactNode
  formProps?: FormProps
  initialValues?: any
}

const ContractDocumentModalForm: React.FC<ContractDocumentModalFormProps> = ({
  children,
  formProps,
  initialValues,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { message } = App.useApp()
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setLoading(true)

    const { fileList } = values

    const originFileList = mapAsFile(fileList)

    const formData = new FormData()

    originFileList.forEach((file: File) => {
      formData.append('files[]', file)
    })

    try {
      const files = await uploadFilesAction(formData)

      var { messgae: msg, errors } = await updateAccountAction(
        initialValues.id,
        {
          personal_documents: files,
        },
      )

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Thêm thành công')
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

    return e && e.fileList
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Modal
        title="Thêm giấy tờ nhân sự"
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        width={846}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              ...initialValues,
            }}
            {...formProps}
          >
            {dom}
          </Form>
        )}
        {...props}
      >
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
      </Modal>
    </>
  )
}

export default ContractDocumentModalForm
