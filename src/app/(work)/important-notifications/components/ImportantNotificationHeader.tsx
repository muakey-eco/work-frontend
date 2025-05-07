'use client'

import { PageHeader } from '@/components'
import { SettingOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { SearchProps } from 'antd/es/input'
import { useRouter } from 'next/navigation'
const { Search } = Input
type ImportantNotificationHeaderProps = {
  user: any
}

const ImportantNotificationHeader = ({
  user,
}: ImportantNotificationHeaderProps) => {
  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value)

  const router = useRouter()

  return (
    <PageHeader
      title="Thông báo quan trọng"
      extra={
        <div className="flex items-center gap-[24px]">
          {user.role === 'Quản trị cấp cao' && (
            <Button
              icon={<SettingOutlined />}
              type="primary"
              onClick={() => {
                router.push('/important-notifications/setting')
              }}
            >
              Cài đặt
            </Button>
          )}
          <Search
            placeholder="Tìm kiếm"
            allowClear
            onSearch={onSearch}
            style={{ width: 278 }}
          />
        </div>
      }
    />
  )
}

export default ImportantNotificationHeader
