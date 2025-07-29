'use client'

import { PageHeader } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

const ManageVideoHeader = () => {
  const router = useRouter()
  const params = useParams()
  const { department_id, tab } = params

  const [activeTab, setActiveTab] = useState(tab || 'youtube-channels')

  const handleChangeTab = (key: string) => {
    setActiveTab(key)
    router.push(`/department/${department_id}/manage-video?tab=${key}`)
  }
  return (
    <div>
      <PageHeader
        title="Quản lý đăng video"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm video
          </Button>
        }
        tab={{
          items: [
            {
              key: 'youtube-channels',
              label: 'Kênh Youtube',
            },
            {
              key: 'youtube-uploads',
              label: 'Video đăng lên Youtube',
            },
            {
              key: 'tiktok-uploads',
              label: 'Kênh Tiktok',
            },
          ],
          onChangeTab: handleChangeTab,
          activeKey: activeTab as string,
        }}
      />
    </div>
  )
}

export default ManageVideoHeader
