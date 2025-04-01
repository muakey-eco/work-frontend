import { Descriptions, DescriptionsProps } from 'antd'
import React from 'react'

const AssetDescription: React.FC<any> = ({ asset }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Loại tài sản',
      children: (
        <span className="font-bold">{asset?.asset_category?.name}</span>
      ),
    },
    {
      key: '2',
      label: 'Nhà cung cấp',
      children: <span className="font-bold">{asset?.brand?.name}</span>,
    },
    {
      key: '3',
      label: 'Người mua',
      children: <span className="font-bold">{asset?.buyer?.full_name}</span>,
    },
    {
      key: '4',
      label: 'Số serial',
      children: <span className="font-bold">{asset?.code}</span>,
    },
    {
      key: '5',
      label: 'Giá mua',
      children: <span className="font-bold">{asset?.price}</span>,
    },
    {
      key: '6',
      label: 'Ngày thanh lý',
      children: <span className="font-bold">{asset?.buy_date}</span>,
    },
    {
      key: '7',
      label: 'Người sử dụng',
      children: <span className="font-bold">{asset?.account?.full_name}</span>,
    },
    {
      key: '8',
      label: 'Ngày mua',
      children: <span className="font-bold">{asset?.buy_date}</span>,
    },
    {
      key: '9',
      label: 'Giá thanh lí',
      children: <span className="font-bold">{asset?.sell_price}</span>,
    },
    {
      key: '10',
      label: 'Thời gian sử dụng',
      children: (
        <span className="font-bold">
          {asset?.start_date && asset?.sell_date
            ? (() => {
                const startDate = new Date(asset.start_date)
                const sellDate = new Date(asset.sell_date)
                const days =
                  Math.ceil(
                    (startDate.getTime() - sellDate.getTime()) /
                      (1000 * 60 * 60 * 24),
                  ) + 1
                return `${days} ngày`
              })()
            : 'Không xác định'}
        </span>
      ),
    },
    {
      key: '11',
      label: 'Hạn bảo hành',
      children: <span className="font-bold">{asset?.warranty_date}</span>,
    },
    {
      key: '12',
      label: 'Người thanh lý',
      children: <span className="font-bold">{asset?.seller?.full_name}</span>,
    },
    {
      key: '13',
      label: 'Ghi chú',
      children: <span className="font-bold">{asset?.description}</span>,
    },
  ]
  return (
    <div className="mt-4">
      <Descriptions layout="vertical" items={items} column={4} colon={false} />
    </div>
  )
}

export default AssetDescription
