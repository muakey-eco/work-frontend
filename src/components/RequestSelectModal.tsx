import { PlusOutlined } from '@ant-design/icons'
import { App, Button, Form, Input, List, Modal, ModalProps } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {
  addProposeCategoryAction,
  deleteProposeCategoryAction,
  updateProposeCategoryAction,
} from './action'
import RequestItem from './RequestItem'

type RequestSelectModalProps = Omit<ModalProps, 'onCancel'> & {
  dataSource?: any[]
  onItemClick?: (id: number) => void
  onCancel?: () => void
  isAdmin?: boolean
}

const RequestSelectModal: React.FC<RequestSelectModalProps> = ({
  dataSource,
  onItemClick,
  onCancel,
  isAdmin,
  ...rest
}) => {
  const [loading, setLoading] = useState(false)

  const [group, setGroup] = useState<{
    name: string
    description: string
  }>({
    name: '',
    description: '',
  })
  const { message } = App.useApp()
  const router = useRouter()

  const handleAddGroup = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    e.preventDefault()
    setLoading(true)

    if (group.name === '') {
      setLoading(false)
      message.error('Tên nhóm không được để trống')
      return
    }

    try {
      const { message: msg, errors } = await addProposeCategoryAction(group)

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      setLoading(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  const handleUpdateGroup = async (id: number, values: any) => {
    try {
      const { messagem: msg, errors } = await updateProposeCategoryAction(
        id,
        values,
      )

      if (errors) {
        message.error(msg)
        return
      }
    } catch (error) {
      throw new Error(String(error))
    }
  }

  const handleDeleteGroup = async (id: number) => {
    try {
      const { message: msg, errors } = await deleteProposeCategoryAction(id)

      if (errors) {
        message.success(msg)
        return
      }

      message.success('Xóa thành công')
      router.refresh()
    } catch (error) {
      throw new Error(String(error))
    }
  }

  return (
    <Modal
      onCancel={onCancel}
      title="LỰA CHỌN NHÓM ĐỀ XUẤT"
      destroyOnClose
      modalRender={(dom) => <Form layout="vertical">{dom}</Form>}
      footer={<></>}
      {...rest}
    >
      <List
        itemLayout="horizontal"
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item
            className="group -mx-[24px] cursor-pointer hover:bg-[#fafafa]"
            onClick={() => {
              onCancel?.()
              onItemClick?.(item)
            }}
          >
            <RequestItem
              item={item}
              onDelete={() => handleDeleteGroup(item?.id)}
              onEdit={(values) => handleUpdateGroup(item?.id, values)}
            />
          </List.Item>
        )}
      />
      {isAdmin && (
        <div className="mt-[16px] flex items-center gap-[12px]">
          <Input
            placeholder="Tên nhóm đề xuất"
            onChange={(e) =>
              setGroup((prev) => ({
                ...prev,
                name: e.target.value || '',
              }))
            }
          />
          <Input
            placeholder="Mô tả"
            onChange={(e) =>
              setGroup((prev) => ({
                ...prev,
                description: e.target.value || '',
              }))
            }
          />
          <Button
            className="w-[100px]!"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddGroup}
            loading={loading}
          />
        </div>
      )}
    </Modal>
  )
}

export default RequestSelectModal
