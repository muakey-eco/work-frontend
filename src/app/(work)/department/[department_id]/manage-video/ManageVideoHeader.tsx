'use client'

import { PageHeader } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
const YoutubeModal = dynamic(
  () => import('@/components/Youtube/YoutubeModal'),
  {
    ssr: false,
  },
)
const ChannelModal = dynamic(
  () => import('@/components/Youtube/ChannelModal'),
  {
    ssr: false,
  },
)

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
          <div className="flex gap-2">
            <ChannelModal action="create">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm Kênh
              </Button>
            </ChannelModal>
            <YoutubeModal action="create">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm Video
              </Button>
            </YoutubeModal>
          </div>
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
