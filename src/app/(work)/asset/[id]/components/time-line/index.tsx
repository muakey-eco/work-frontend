import { Card, Timeline } from 'antd'
import React from 'react'

const AssetTimeline: React.FC<any> = ({ asset }) => {
  const items = [
    ...(asset?.history_assets?.map((item: any) => ({
      color: item?.status === 'created' ? 'red' : 'blue',
      key: item?.id,
      children: (
        <p>
          {item.status === 'created' ? 'Tạo lúc ' : 'Cập nhật lúc '}{' '}
          {item.created_at.split('T')[0]} bởi <b>{item?.account?.full_name}</b>
        </p>
      ),
    })) || []),
    {
      color: 'gray',
      key: 'final',
      className: 'last:hidden',
      children: '',
    },
  ]

  return (
    <Card className="max-h-[calc(100vh-85px)] overflow-hidden p-4">
      <p className="pb-2 text-[16px] font-medium">Lịch sử cập nhật</p>

      <div className="custom-scrollbar max-h-[calc(100vh-115px)] overflow-y-auto">
        <Timeline mode="left" className="!pt-1 !pb-4" items={items} />
      </div>
    </Card>
  )
}

export default AssetTimeline
