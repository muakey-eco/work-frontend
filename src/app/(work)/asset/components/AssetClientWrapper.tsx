'use client'

import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import AssetFilter from './asset-search'
import AssetTable from './asset-table'
import PageContent from './PageContent'

export default function AssetClientWrapper({ assets, status }: any) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true)
    }, 300) // delay nhẹ cho effect loading

    return () => clearTimeout(timeout)
  }, [])

  if (!isReady) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    )
  }

  return (
    <PageContent className="flex flex-col gap-[16px]">
      <AssetFilter />
      <AssetTable
        dataSource={assets.data}
        total={assets.total}
        per_page={assets.per_page}
        total_status={assets.total_status}
        defaultActiveKey={status}
      />
    </PageContent>
  )
}
