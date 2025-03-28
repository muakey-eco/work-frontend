'use client'

import {
  App,
  Form,
  FormProps,
  Input,
  Modal,
  ModalProps,
  Radio,
  RadioGroupProps,
  Select,
  SelectProps,
} from 'antd'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateProfileAction } from '../action'

export type ProfileDeductionsModalFormProps = ModalProps & {
  initialValues?: any
  children?: React.ReactNode
  formProps?: FormProps
}

const ProfileDeductionsModalForm: React.FC<ProfileDeductionsModalFormProps> = ({
  initialValues,
  children,
  formProps,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { message } = App.useApp()

  const taxReducedOptions: RadioGroupProps['options'] = [
    { label: 'Có', value: 1 },
    { label: 'Không', value: 0 },
  ]

  const salaryScaleOptions: SelectProps['options'] = [
    { label: 'I', value: '1' },
    { label: 'II', value: '2' },
  ]

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      const { message: msg, errors } = await updateProfileAction(
        initialValues?.id,
        {
          ...values,
        },
      )

      if (errors) {
        setLoading(false)
        message.error(msg)
        return
      }

      router.refresh()
      setOpen(false)
      message.success('Cập nhật thông tin thành công')
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        title="Thuế và bảo hiểm"
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        okText="Lưu"
        cancelText="Hủy"
        width={846}
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
              tax_reduced: [0, 1].includes(initialValues?.tax_reduced)
                ? initialValues?.tax_reduced
                : 1,
            }}
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
            label="Mã số thuế"
            name="tax_code"
          >
            <Input placeholder="Nhập mã số thuế" />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Giảm trừ thuế thu nhập cá nhân"
            name="tax_reduced"
          >
            <Radio.Group options={taxReducedOptions} />
          </Form.Item>
        </div>

        <Form.Item className="mb-[16px]!" label="Số sổ BHXH" name="BHXH">
          <Input placeholder="Nhập số sổ BHXH" />
        </Form.Item>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-0! flex-1"
            label="Nơi đăng ký"
            name="place_of_registration"
          >
            <Input placeholder="Nhập nơi đăng ký" />
          </Form.Item>

          <Form.Item
            className="mb-0! flex-1"
            label="Vùng lương"
            name="salary_scale"
          >
            <Select
              options={salaryScaleOptions}
              placeholder="Chọn vùng lương"
            />
          </Form.Item>
        </div>
      </Modal>
    </>
  )
}

export default ProfileDeductionsModalForm
