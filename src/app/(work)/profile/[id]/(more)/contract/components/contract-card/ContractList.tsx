'use client'

import { List, ListProps } from 'antd'
import React from 'react'
import { genStatus } from '../ultils'
import ContractItemCard, { ContractItemCardProps } from './ContractItemCard'

export type ContractListProps = ListProps<any> & {}

const ContractList: React.FC<ContractListProps> = ({
  dataSource: externalDataSource,
  ...props
}) => {
  const columns: ContractItemCardProps['columns'] = [
    {
      label: 'Hợp đồng',
      dataIndex: ['account', 'full_name'],
      className: 'text-[#1890FF]',
    },
    {
      label: 'Loại hợp đồng',
      dataIndex: ['category', 'name'],
    },
    {
      label: 'Trạng thái',
      dataIndex: 'status',
      render: (value: any) => genStatus(value),
    },
    {
      label: 'Ngày bắt đầu',
      dataIndex: 'start_date',
    },
    {
      label: 'Ngày kết thúc',
      dataIndex: 'end_date',
    },
  ]

  return (
    <>
      <List
        dataSource={externalDataSource}
        grid={{
          gutter: [16, 16],
          column: 1,
        }}
        renderItem={(item) => (
          <List.Item className="!mb-0">
            <ContractItemCard item={item} columns={columns} />
          </List.Item>
        )}
        {...props}
      />
    </>
  )
}

export default ContractList
