'use client'

import { Card, Select } from 'antd'
import React from 'react'
import MarketingChart from '../charts'

type DataCardProps = {
  title: string
  value: string
  options?: any[]
  data?: any[]
  total?: number
}
const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  total,
  options,
}) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  return (
    <Card className="flex max-h-[310px] w-[390px] flex-col !p-0 [&>*]:!p-0">
      <div className="flex items-center justify-between gap-2 px-6 py-4">
        <div className="text-[16px]">{title}</div>
        {options ? (
          <Select
            defaultValue={options?.[0]?.value}
            style={{ width: 121, height: 24, fontSize: 12 }}
            onChange={handleChange}
            options={options}
          />
        ) : (
          <div className="text-sm font-bold text-[#007bff]">{value}</div>
        )}
      </div>
      {options && (
        <div className="flex items-center justify-center gap-2 px-6 text-sm font-bold">
          <div>👁️ 1.3M</div>
          <div>👍 2.4K</div>
          <div>💬 100</div>
          <div>⏱️ 234</div>
          <div>📅 40</div>
        </div>
      )}

      <MarketingChart title={title} total={total} options={options} />
    </Card>
  )
}

export default DataCard
