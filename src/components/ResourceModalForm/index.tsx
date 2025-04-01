'use client'

import { useAsyncEffect } from '@/libs/hook'
import { UploadOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  DatePicker,
  Form,
  FormProps,
  Input,
  Modal,
  ModalProps,
  Radio,
  Select,
  Upload,
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import TiptapEditor from '../TiptapEditor'
import {
  createResourceAction,
  getAccountsReuqest,
  getResourceCategoriesRequest,
  updateResourceAction,
  uploadImageAction,
} from '../action'

export type ResourceModalFormProps = ModalProps & {
  children?: React.ReactNode
  initialValues?: any
  mode?: 'create' | 'edit'
  options?: any
  formProps?: Omit<FormProps, 'initialValues'>
}

const NOTIFICATION_BEFORE_DAYS = 1
const NOTIFICATION_BEFORE_HOURS = 1

const ResourceModalForm: React.FC<ResourceModalFormProps> = ({
  children,
  initialValues,
  mode = 'create',
  options,
  formProps,
  ...modalProps
}) => {
  const [accounts, setAccounts] = useState<any>([])
  const [format, setFormat] = useState(initialValues?.type || 'text')
  const [expireType, setExpireType] = useState('has_expire')
  const [thumbnail, setThumbnail] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resourcesCategories, setResourcesCategories] = useState<any>([])

  const { message } = App.useApp()
  const [form] = Form.useForm()
  const router = useRouter()

  const categoryOptions = resourcesCategories?.map((item: any) => ({
    label: item.name,
    value: item.id,
  }))

  useAsyncEffect(async () => {
    if (!open) {
      setExpireType('has_expire')
      return
    }

    const res = await getAccountsReuqest()
    const categories = await getResourceCategoriesRequest()

    setResourcesCategories(categories)
    setAccounts(res)
  }, [open])

  const handleSubmit = async (values: any) => {
    setLoading(true)

    const { expire_notice, expired_date, ...rest } = values

    const notificationBeforeTime =
      expire_notice === 'notification_before_days'
        ? NOTIFICATION_BEFORE_DAYS
        : NOTIFICATION_BEFORE_HOURS

    const expiredDate = expired_date
      ? String(dayjs(expired_date).format('YYYY-MM-DD HH:mm'))
      : null

    try {
      if (mode === 'create') {
        var { message: msg, errors } = await createResourceAction({
          ...rest,
          [expire_notice]: notificationBeforeTime,
          expired_date: expiredDate,
          thumbnail,
        })
      } else {
        var { message: msg, errors } = await updateResourceAction(
          initialValues.id,
          {
            ...rest,
            [expire_notice]: notificationBeforeTime,
            expired_date: expiredDate,
            thumbnail: thumbnail || initialValues?.thumbnail,
          },
        )
      }

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      setLoading(false)
      setOpen(false)
      router.refresh()
      message.success(
        mode === 'create'
          ? 'Tạo tài liệu thành công'
          : 'Cập nhật tài liệu thành công',
      )
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  const handleChange = useCallback(async (event: any) => {
    const { fileList } = event

    if (fileList.length <= 0) {
      setThumbnail('')
      return
    }

    const formData = new FormData()
    formData.append('image', fileList[0].originFileObj || {})

    if (fileList[0].status === 'done') {
      const { urlImage: url } = await uploadImageAction(formData)

      setThumbnail(url)
    }
  }, [])

  const handlePreview = useCallback(
    (file: any) => {
      const url = URL.createObjectURL(file.originFileObj)

      router.push(url)
    },
    [router],
  )

  useEffect(() => {
    if (!!thumbnail) {
      return () => URL.revokeObjectURL(thumbnail)
    }
  }, [thumbnail])

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Modal
        title={mode === 'create' ? 'Tạo tài liệu mới' : 'Cập nhật tài liệu'}
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        width={846}
        footer={
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        }
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            initialValues={
              mode === 'create'
                ? {
                    ...initialValues,
                    type: 'text',
                    expire_notice: 'notification_before_days',
                  }
                : {
                    ...initialValues,
                    expired_date: initialValues?.expired_date
                      ? dayjs(initialValues?.expired_date)
                      : null,
                    members: initialValues?.members?.map(
                      (item: any) => item.id,
                    ),
                    receivers: initialValues?.receivers?.map(
                      (item: any) => item.id,
                    ),
                  }
            }
            onFinish={handleSubmit}
            {...formProps}
          >
            {dom}
          </Form>
        )}
        {...modalProps}
      >
        <Form.Item
          name="category_resource_id"
          label="Chọn danh mục"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select options={categoryOptions} />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên tài liệu"
          rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu' }]}
        >
          <Input placeholder="Nhập tên tài liệu" />
        </Form.Item>
        <Form.Item name="thumbnail" label="Ảnh bìa tài liệu">
          <Upload
            listType="picture"
            onChange={handleChange}
            onPreview={handlePreview}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="type">
          <Radio.Group
            options={[
              { label: 'Dạng Text', value: 'text' },
              { label: 'Dạng tài khoản', value: 'account' },
            ]}
            onChange={(e) => setFormat(e.target.value)}
          />
        </Form.Item>
        {format === 'account' ? (
          <>
            <Form.Item
              name="account"
              label="Tài khoản"
              rules={[{ required: true, message: 'Vui lòng nhập tài khoản' }]}
            >
              <Input placeholder="Nhập tài khoản" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Form.Item name="note" label="Ghi chú" valuePropName="content">
              <TiptapEditor />
            </Form.Item>
          </>
        ) : (
          <Form.Item name="text_content" valuePropName="content">
            <TiptapEditor />
          </Form.Item>
        )}
        <Form.Item
          name="members"
          label="Phân quyền truy cập tài liệu"
          rules={[{ required: true, message: 'Vui lòng chọn người nhận' }]}
        >
          <Select
            mode="multiple"
            options={accounts?.map((acc: any) => ({
              label: acc.full_name,
              value: acc.id,
            }))}
            placeholder="Chọn người truy cập"
          />
        </Form.Item>
        <Form.Item>
          <Radio.Group
            defaultValue="has_expire"
            options={[
              { label: 'Có thời hạn', value: 'has_expire' },
              { label: 'Không có thời hạn', value: 'no_expire' },
            ]}
            onChange={(e) => setExpireType(e.target.value)}
          />
        </Form.Item>
        {expireType === 'has_expire' && (
          <div className="rounded-[8px] bg-[#0000000A] p-[24px]">
            <Form.Item
              name="expired_date"
              label="Chọn ngày hết hạn"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày hết hạn' },
              ]}
            >
              <DatePicker
                className="w-full"
                locale={locale}
                showTime={{
                  showHour: true,
                  showMinute: true,
                }}
              />
            </Form.Item>
            <Form.Item name="expire_notice" label="Thông báo hết hạn">
              <Radio.Group
                options={[
                  {
                    label: 'Thông báo trước 1 ngày',
                    value: 'notification_before_days',
                  },
                  {
                    label: 'Thông báo trước 1 giờ',
                    value: 'notification_before_hours',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="receivers"
              label="Chọn người nhận thông báo hết hạn"
            >
              <Select
                mode="multiple"
                options={accounts?.map((acc: any) => ({
                  label: acc.full_name,
                  value: acc.id,
                }))}
                placeholder="Chọn người nhận"
              />
            </Form.Item>
          </div>
        )}
      </Modal>
    </>
  )
}

export default ResourceModalForm
