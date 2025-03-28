'use client'

import { convertToSlug, randomColor } from '@/libs/utils'
import { Avatar, Table, TableProps } from 'antd'
import { createStyles } from 'antd-style'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import EmployeeFilter from '../employee-filter'

export type EmployeeTableProps = Omit<TableProps, 'columns'> & {
  columns: any[]
}

const useStyle = createStyles(({ css }) => ({
  customTable: css`
    .ant-table-thead {
      tr {
        th {
          background-color: #fff;
        }
      }
    }
    .ant-table {
      .ant-table-container {
        .ant-table-body,
        .ant-table-content {
          scrollbar-width: thin;
          scrollbar-color: #eaeaea transparent;
          scrollbar-gutter: stable;
        }
      }
    }
  `,
}))

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  dataSource,
  columns: externalColumns,
  ...rest
}) => {
  const [viewColumns, setViewColumns] = useState([])
  const { styles } = useStyle()

  const searchParams = useSearchParams()
  const view = searchParams.get('view')

  useEffect(() => {
    const c = externalColumns?.find(
      (column) => convertToSlug(column.name) === (view || 'tong-quan'),
    )

    setViewColumns(c?.field_name || [])
  }, [view, externalColumns])

  const columns = viewColumns
    ?.map((field: any) => ({
      title: field?.label,
      dataIndex: field?.value,
      key: field?.value,
      render: (text: any, record: any) => {
        return field?.value === 'full_name' ? (
          <div className="flex items-center gap-[8px]">
            <Avatar
              src={record?.avatar}
              alt={record?.full_name}
              style={{
                backgroundColor: randomColor(String(record?.full_name)),
              }}
            >
              {String(record?.full_name).charAt(0).toUpperCase()}
            </Avatar>
            <span>{text}</span>
          </div>
        ) : Array.isArray(text) ? (
          ''
        ) : (
          text
        )
      },
    }))
    .flat()

  return (
    <div className="space-y-[16px]">
      <EmployeeFilter />
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 5,
        }}
        {...rest}
      />
    </div>
  )
}

export default EmployeeTable
