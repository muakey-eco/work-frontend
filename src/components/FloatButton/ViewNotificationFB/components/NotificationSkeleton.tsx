import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Skeleton, Tabs } from 'antd'

const NotificationSkeleton: React.FC = () => {
  const fakeList = Array.from({ length: 6 })

  return (
    <div className="!h-[764px] !w-[549px] p-4">
      {/* Header */}
      <div className="flex items-center justify-between ps-6">
        <span className="text-lg font-semibold">Thông báo</span>
        <div className="flex items-center gap-2">
          <Button icon={<CheckOutlined />}>Đã đọc tất cả</Button>
          <Button
            type="text"
            className="cursor-pointer items-center text-2xl text-gray-400 hover:text-gray-600"
            style={{ lineHeight: 1 }}
            icon={<CloseOutlined />}
          />
        </div>
      </div>

      {/* Tabs giả */}
      <div className="px-6 pb-4">
        <Tabs
          defaultActiveKey="1"
          items={[
            { key: '1', label: `Tất cả (0)` },
            { key: '2', label: `Thông báo từ hệ thống (0)` },
            { key: '3', label: `Thông báo quan trọng (0)` },
          ]}
        />
      </div>

      {/* Skeleton items */}
      <div className="px-6">
        {fakeList.map((_, index) => (
          <div
            key={index}
            className="mb-5 flex items-start space-x-3 border-b border-[#f0f0f0] pb-4"
          >
            {/* Avatar giả */}
            <Skeleton.Avatar active size="large" shape="circle" />

            <div className="flex-1">
              {/* Nội dung dòng */}
              <Skeleton
                paragraph={{
                  rows: 2,
                  width: ['80%', '60%'],
                }}
                active
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationSkeleton
