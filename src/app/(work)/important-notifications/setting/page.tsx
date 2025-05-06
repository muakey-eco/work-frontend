'use client'

import { PageHeader } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { SearchProps } from 'antd/es/input'
import INotificationModalForm from '../components/INotificationModalForm'
import { cardData } from '../data'
import NotificationTable from './NotificationTable'

const { Search } = Input

const SettingINotification = () => {
  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value)

  return (
    <div>
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
              label: 'Đã gửi (20)',
              key: '1',
            },
            {
              label: 'Đã ẩn (2)',
              key: '2',
            },
          ],
        }}
        extra={
          <Search
            placeholder="Tìm kiếm nhân sự"
            allowClear
            onSearch={onSearch}
            style={{ width: 278 }}
          />
        }
      />
      <NotificationTable data={cardData} />
    </div>
  )
}

export default SettingINotification
