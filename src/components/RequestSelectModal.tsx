import { Form, List, Modal, ModalProps } from 'antd'
import React from 'react'
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
            <RequestItem isAdmin={isAdmin} item={item} />
          </List.Item>
        )}
      />
    </Modal>
  )
}

export default RequestSelectModal
