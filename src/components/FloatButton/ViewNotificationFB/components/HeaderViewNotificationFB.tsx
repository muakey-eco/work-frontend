'use client'

import { seenNotificationsAction } from '@/components/WorkLayoutUI/SideBar/action'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { App, Button } from 'antd'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

const HeaderViewNotificationFB = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void
}) => {
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const router = useRouter()
  const handleReadAll = useCallback(async () => {
    try {
      setLoading(true)
      const res = await seenNotificationsAction()
      if (res.success) {
        message.success(res.success)
      }
      router.refresh()
      setLoading(false)
    } catch (error) {
      console.log(error)
      message.error('Đã xảy ra lỗi')
    }
  }, [])
  return (
    <div className="flex items-center justify-between px-6">
      <span className="text-lg font-semibold">Thông báo</span>
      <div className="flex items-center gap-2">
        <Button
          icon={<CheckOutlined />}
          onClick={handleReadAll}
          loading={loading}
        >
          Đã đọc tất cả
        </Button>
        <Button
          type="text"
          onClick={() => setOpen(false)}
          className="cursor-pointer items-center text-2xl text-gray-400 hover:text-gray-600"
          style={{ lineHeight: 1 }}
          icon={<CloseOutlined />}
        />
      </div>
    </div>
  )
}

export default HeaderViewNotificationFB
