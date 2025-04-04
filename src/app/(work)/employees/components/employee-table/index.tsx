'use client'

import { getAccounts } from '@/libs/data'
import { convertToSlug, randomColor } from '@/libs/utils'
import { Avatar, Table, TableProps } from 'antd'
import { createStyles } from 'antd-style'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import EmployeeFilter from '../employee-filter'
import EmployeePaginationTable from '../employee-pagination-table'

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
  columns: externalColumns,
  ...rest
}) => {
  const [viewColumns, setViewColumns] = useState([])
  const { styles } = useStyle()
  const [data, setData] = useState<any[]>()
  const [loading, setLoading] = useState(false)
  const refpagination = useRef({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const searchParams = useSearchParams()
  const view = searchParams.get('view')

  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true)
    try {
      const response = await getAccounts(
        {
          include: 'list',
        },
        page,
        pageSize,
      )
      const { data, current_page, per_page, total } = response
      setData(data)
      refpagination.current = {
        current: current_page,
        pageSize: per_page,
        total,
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination
    fetchData(current, pageSize)
  }

  useEffect(() => {
    const { current, pageSize } = refpagination.current
    fetchData(current, pageSize)
  }, [])

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
        ) : field.value === 'url_contract' ? (
          <Link
            href={record?.url_contract || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            {record?.url_contract ? 'Link' : ''}
          </Link>
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
      <div className="no-scroll h-screen overflow-y-scroll pb-40">
        <Table
          className={styles.customTable}
          columns={columns}
          dataSource={data}
          scroll={{ x: 'max-content' }}
          loading={loading}
          pagination={false}
          {...rest}
        />
        <EmployeePaginationTable
          current={refpagination.current.current}
          pageSize={refpagination.current.pageSize}
          total={refpagination.current.total}
          onChange={handleTableChange}
        />
      </div>
    </div>
  )
}

export default EmployeeTable
