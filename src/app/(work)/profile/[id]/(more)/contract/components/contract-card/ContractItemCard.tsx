import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import clsx from 'clsx'
import React from 'react'
import ContractDetailModal from './ContractDetailModal'
import ContractModalForm from './ContractModalForm'

type Item = {
  label: React.ReactNode
  dataIndex: string | string[]
  className?: string
  render?: (value: any, record: any) => React.ReactNode
}

export type ContractItemCardProps = {
  item?: any
  columns?: Item[]
}

const genItemValue = (item: any, dataIndex: string | string[]) => {
  if (Array.isArray(dataIndex)) {
    let value = null
    let restDataIndex = null

    for (const index of dataIndex) {
      value = item[index]
      restDataIndex = dataIndex.filter((i) => i !== index)

      if (!value) return null

      if (restDataIndex?.length > 0) {
        return genItemValue(value, restDataIndex)
      }
    }

    return value
  }

  return item[dataIndex]
}

const ContractItemCard: React.FC<ContractItemCardProps> = ({
  item,
  columns,
}) => {
  return (
    <Card
      className="group relative overflow-hidden transition-all duration-200 hover:!border-[#1677FF]"
      classNames={{
        body: '!space-x-[24px] flex items-start',
      }}
    >
      <div className="flex flex-1 items-start gap-[16px]">
        {columns?.map((column, index) => {
          const value = genItemValue(item, column.dataIndex)

          return (
            <div className="flex-1 !space-y-[8px]" key={index}>
              <div className="text-[14px] leading-[22px] text-[#00000073]">
                {column.label}
              </div>
              <div
                className={clsx(
                  'text-[14px] leading-[22px] font-[500]',
                  column?.className,
                )}
              >
                {column?.render?.(value, item) || value || '--'}
              </div>
            </div>
          )
        })}
      </div>

      <div className="visible !mr-0 flex w-[64px] items-center gap-[24px] text-[16px] text-[#00000073] opacity-0 transition-all duration-200 group-hover:opacity-100">
        <ContractDetailModal item={item}>
          <EyeOutlined />
        </ContractDetailModal>
        <ContractModalForm action="edit" initialValues={item}>
          <EditOutlined />
        </ContractModalForm>
      </div>

      <div
        className={clsx(
          'absolute -right-[33px] -bottom-[13px] aspect-[96/53] w-[96px] -rotate-45 bg-[#1677FF] px-[10px] pt-[4px] pb-[29px] text-center text-[11px] leading-[20px] text-[#fff]',
          item?.active === '0' ? 'opacity-0' : 'opacity-100',
        )}
      >
        HIỆN TẠI
      </div>
    </Card>
  )
}

export default ContractItemCard
