'use client'

import { PageHeader } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import Input, { SearchProps } from 'antd/es/input'
import { useRouter } from 'next/navigation'
import INotificationModalForm from '../components/INotificationModalForm'
const { Search } = Input

const SettingHeader = ({ notifications }: { notifications: any }) => {
  const router = useRouter()
  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    if (value) {
      router.push(`/important-notifications/setting?search=${value}`)
    } else {
      router.push('/important-notifications/setting')
    }
  }
  return (
    <PageHeader
      title="Cài đặt thông báo quan trọng"
      headerExtra={
        <INotificationModalForm action="create">
          <Button icon={<PlusOutlined />} type="primary">
            Tạo thông báo mới
          </Button>
        </INotificationModalForm>
      }
      tab={{
        items: [
          {
            label: `Đã gửi (${notifications.count})`,
            key: '1',
          },
          {
            label: `Đã ẩn (${notifications.count_hidden})`,
            key: '2',
          },
        ],
        onChangeTab: (key) => {
          if (key === '2') {
            router.push('/important-notifications/setting?include=hidden')
          } else {
            router.push('/important-notifications/setting')
          }
        },
      }}
      extra={
        <Search
          placeholder="Tìm kiếm theo tiêu đề"
          allowClear
          onSearch={onSearch}
          style={{ width: 278 }}
        />
      }
    />
  )
}

export default SettingHeader
