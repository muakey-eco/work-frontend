'use client'

import { App, Button, Form, FormProps, Input, Modal, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import {
  addAssetCategoryAction,
  deleteAssetCategoryAction,
  getAssetCategoriesAction,
  updateAssetCategoryAction,
} from '../action'

type DataType = {
  key: string
  name: string
}

type ManageModalFormProps = {
  children: React.ReactNode
  formProps?: FormProps
  title?: string
}

const ManageModalForm: React.FC<ManageModalFormProps> = ({
  children,
  formProps,
  title,
  ...props
}) => {
  const { message, modal } = App.useApp()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any>([])
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list') // list hoặc add
  const [editRowId, setEditRowId] = useState<number | null>(null)
  const [editName, setEditName] = useState<string>('')

  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      width: '300px',
      render: (_: any, record: any) =>
        editRowId === record.id ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            allowClear
          />
        ) : (
          record.name
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          {editRowId === record.id ? (
            <>
              <a onClick={() => handleSave(editName)}>Cập nhật</a>
              <a onClick={() => setEditRowId(null)}>Hủy</a>
            </>
          ) : (
            <>
              <a
                onClick={() => {
                  setEditRowId(record.id)
                  setEditName(record.name)
                }}
              >
                Sửa
              </a>
              <a onClick={() => handleDelete(record.id)}>Xóa</a>
            </>
          )}
        </Space>
      ),
    },
  ]

  const fetchCategories = async () => {
    const res = await getAssetCategoriesAction()
    setCategories(res)
  }

  useEffect(() => {
    if (open) fetchCategories()
  }, [open])

  const handleAdd = async (values: any) => {
    setLoading(true)
    const res = await addAssetCategoryAction(values)
    if (res) {
      message.success(`Thêm loại tài sản thành công`)
      await fetchCategories()
      setMode('list') // Quay về chế độ list
    }
    setLoading(false)
  }

  const handleDelete = (id: string) => {
    modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa loại tài sản này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        setLoading(true)
        const res = await deleteAssetCategoryAction(Number(id))
        if (res) {
          message.success(`Xóa loại tài sản thành công`)
          await fetchCategories()
        }
        setLoading(false)
      },
      onCancel: () => {
        console.log('Cancel')
      },
    })
  }
  const handleSave = async (name: string) => {
    setLoading(true)
    const res = await updateAssetCategoryAction(Number(editRowId), {
      name,
    })
    if (res) {
      message.success(`Cập nhật loại tài sản thành công`)
      await fetchCategories()
      setEditRowId(null)
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setOpen(false)
    setMode('list') // Reset lại mode khi đóng
    form.resetFields()
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Modal
        open={open}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        title={
          <div className="flex justify-between">
            <h2>{title}</h2>
            <Button type="primary" onClick={() => setMode('add')}>
              Thêm mới
            </Button>
          </div>
        }
        destroyOnClose
        {...props}
      >
        {mode === 'add' ? (
          <Form
            {...formProps}
            form={form}
            layout="vertical"
            onFinish={handleAdd}
          >
            <Form.Item
              label="Tên loại tài sản"
              name="name"
              rules={[
                {
                  required: true,
                  message: `Tên loại tài sản không được để trống`,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={() => setMode('list')}>Quay lại</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Lưu
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <Table<DataType>
              columns={columns}
              dataSource={categories}
              pagination={false}
              rowKey="key"
            />
          </>
        )}
      </Modal>
    </>
  )
}

export default ManageModalForm
