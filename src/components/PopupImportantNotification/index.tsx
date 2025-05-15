import { Avatar, Card, Divider, Modal } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

type PopupImportantNotificationProps = {
  visible: boolean
  onClose: () => void
  notice: any
}

const PopupImportantNotification: React.FC<PopupImportantNotificationProps> = ({
  visible,
  onClose,
  notice,
}) => {
  return (
    <Modal
      title={notice?.title}
      closable={{ 'aria-label': 'Custom Close Button' }}
      onCancel={onClose}
      footer={null}
    >
      <Card className="w-full p-[24px]">
        <img
          alt="example"
          src={notice?.thumbnail}
          className="h-[300px] w-full rounded-2xl object-cover"
        />
        {/* <p className="mt-[12px] text-[20px] font-[500]">{notice?.title}</p> */}

        <div className="my-[12px] flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar src={notice?.manager?.avatar || ''} />
            <p className="text-[16px] text-gray-500">
              {notice?.manager?.full_name}
            </p>
          </div>
          <span className="text-gray-500">•</span>
          <p className="text-[16px] text-gray-500">
            {dayjs(notice?.created_at).format('HH:mm - DD/MM/YYYY')}
          </p>
        </div>

        <Divider />
        <p
          className="overflow-hidden text-[16px] break-words whitespace-pre-line text-gray-500"
          dangerouslySetInnerHTML={{ __html: notice?.message }}
        />
      </Card>
    </Modal>
  )
}

export default PopupImportantNotification
