'use client'

import { List, ListProps } from 'antd'
import React from 'react'
import ContractDocumentItemCard from './ContractDocumentItemCard'

export type ContractDocumentListProps = ListProps<any> & {}

const ContractDocumentList: React.FC<ContractDocumentListProps> = ({
  dataSource,
  ...props
}) => {
  return (
    <List
      dataSource={dataSource}
      grid={{
        gutter: [16, 16],
        column: 2,
      }}
      renderItem={(item) => (
        <List.Item className="!mb-0">
          <ContractDocumentItemCard item={item} />
        </List.Item>
      )}
      {...props}
    />
  )
}

export default ContractDocumentList
