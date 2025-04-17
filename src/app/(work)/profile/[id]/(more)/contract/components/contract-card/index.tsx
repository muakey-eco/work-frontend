import { PlusOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import React from 'react'
import ContractList from './ContractList'
import ContractModalForm from './ContractModalForm'

export type ContractCardProps = {
  title?: React.ReactNode
  extra?: React.ReactNode
  items?: any
}

const ContractCard: React.FC<ContractCardProps> = ({ title, extra, items }) => {
  const { contracts, full_name, id } = items

  return (
    <Card
      classNames={{
        body: '!space-y-[16px]',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[20px] leading-[28px] font-[500]">{title}</div>
        {extra || (
          <ContractModalForm initialValues={{ full_name, id }}>
            <Button type="primary" icon={<PlusOutlined />}>
              Tạo mới
            </Button>
          </ContractModalForm>
        )}
      </div>

      <ContractList dataSource={contracts} />
    </Card>
  )
}

export default ContractCard
