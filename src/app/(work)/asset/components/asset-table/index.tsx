'use client'

import { Asset } from '@/interfaces'
import { formatCurrency } from '@/lib/utils'
import { ColumnHeightOutlined, SettingOutlined } from '@ant-design/icons'
import { Table, TableProps, Tabs, TabsProps, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { filterAssetsAction } from '../asset-drawer/action'

export type AssetTableProps = TableProps & {
  onStatusChange?: (status: string) => void
  defaultActiveKey?: string
  dataSource?: Asset[]
  per_page?: number
  total?: number
}

const genStatus = (
  status: 'using' | 'unused' | 'warranty' | 'broken' | 'liquidated',
) => {
  switch (status) {
    case 'using':
      return <Tag color="success">Đang sử dụng</Tag>
    case 'unused':
      return <Tag color="default">Chưa sử dụng</Tag>
    case 'warranty':
      return <Tag color="warning">Đang bảo hành</Tag>
    case 'broken':
      return <Tag color="error">Hỏng</Tag>
    case 'liquidated':
      return <Tag color="purple">Đã thanh lý</Tag>
  }
}

const tabs: TabsProps['items'] = [
  {
    label: 'Tất cả',
    key: 'all',
  },
  {
    label: 'Đang sử dụng',
    key: 'using',
  },
  {
    label: 'Chưa sử dụng',
    key: 'unused',
  },
  {
    label: 'Đang bảo hành',
    key: 'warranty',
  },
  {
    label: 'Hỏng',
    key: 'broken',
  },
  {
    label: 'Đã thanh lý',
    key: 'liquidated',
  },
]

const AssetTable: React.FC<AssetTableProps> = ({
  onStatusChange,
  defaultActiveKey = 'all',
  dataSource,
  total = dataSource?.length,
  per_page,
  ...props
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [tab, setTab] = useState(defaultActiveKey)
  const [assets, setAssets] = useState<Asset[]>(dataSource || [])

  useEffect(() => {
    const status = searchParams.get('status')
    if (status) {
      setTab(status)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      const res = await filterAssetsAction(searchParams.toString())
      setAssets(res.data)
    }
    fetchData()
  }, [searchParams])

  const handleChangeTab = async (key: string) => {
    const currentParams = new URLSearchParams(window.location.search) // Giữ nguyên tham số hiện tại
    currentParams.delete('page') // Reset phân trang

    if (key === 'all') {
      router.push('/asset')
      setTab(key)
      setAssets(dataSource || [])
      onStatusChange?.(key)
      return
    }

    currentParams.set('status', key)
    router.push(`/asset?${currentParams.toString()}`)
    setTab(key)
    onStatusChange?.(key)

    try {
      const res = await filterAssetsAction(currentParams.toString())
      if (res.success && Array.isArray(res.data)) {
        setAssets(res.data)
      }
    } catch (error) {
      console.error('Error fetching assets:', error)
    }
  }

  const handleRowClick = (record: any) => {
    router.push(`/asset/${record.id}`)
  }

  const handleChangePage = async (page: number) => {
    const currentParams = new URLSearchParams()

    router.push(`/asset?${currentParams.toString()}`, { scroll: false })
  }

  const columns: ColumnsType<any> = [
    { title: 'Mã', dataIndex: 'code' },
    { title: 'Tên tài sản', dataIndex: 'name' },
    { title: 'Loại tài sản', dataIndex: ['asset_category', 'name'] },
    { title: 'Người sử dụng', dataIndex: ['account', 'full_name'] },
    { title: 'Nhà cung cấp', dataIndex: ['brand', 'name'] },
    {
      title: 'Giá mua',
      dataIndex: 'price',
      render: (value: number) => (value ? `${formatCurrency(value)}đ` : '--'),
    },
    {
      title: 'Ngày mua',
      dataIndex: 'buy_date',
      render: (value: string | null | undefined) => {
        const date = dayjs(value)
        return date.isValid() ? date.format('YYYY/MM/DD') : '--'
      },
    },
    {
      title: 'Hạn bảo hành',
      dataIndex: 'warranty_date',
      render: (value: string | null | undefined) => {
        const date = dayjs(value)
        return date.isValid() ? date.format('YYYY/MM/DD') : '--'
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (value: string) =>
        genStatus(
          value as 'using' | 'unused' | 'warranty' | 'broken' | 'liquidated',
        ),
    },
  ]

  const tabActions = (
    <div className="flex items-center gap-[8px]">
      <ColumnHeightOutlined />
      <SettingOutlined />
    </div>
  )

  return (
    <div className="rounded-[8px] bg-[#fff] px-[16px]">
      <Tabs
        items={tabs}
        tabBarExtraContent={tabActions}
        activeKey={tab}
        onChange={handleChangeTab}
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={assets}
        {...props}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        className="cursor-pointer"
        pagination={{
          current: Number(searchParams.get('page')) || 1,
          pageSize: per_page || 1,
          total: assets?.length < 8 ? assets.length : (total ?? assets?.length),
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
          showTotal: (total) => `Total ${total} items`,
          onChange: handleChangePage,
        }}
      />
    </div>
  )
}

export default AssetTable
