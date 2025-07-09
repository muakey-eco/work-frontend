'use client'

import { convertToSlug, randomColor } from '@/libs/utils'
import { Avatar, Table, TableProps } from 'antd'
import { createStyles } from 'antd-style'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getEmployeeAction } from '../action'
import EmployeeFilter from '../employee-filter'
import EmployeePaginationTable from './employee-pagination-table'

export type EmployeeTableProps = Omit<TableProps, 'columns'> & {
  views?: any[]
  columns: any[]
  firstView: string
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
  firstView,
  ...rest
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = new URLSearchParams(searchParams)

  const view = searchParams.get('view') || convertToSlug(firstView)
  const search = searchParams.get('search')
  const page = searchParams.get('page')

  const [viewColumns, setViewColumns] = useState([])

  const { styles } = useStyle()
  const [data, setData] = useState<any[]>()
  const [loading, setLoading] = useState(false)
  const refpagination = useRef({
    current: Number(page) || 1,
    pageSize: 10,
    total: 0,
  })

  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true)
      try {
        query.set('include', 'profile')
        query.set('page', page.toString())
        query.set('per_page', pageSize.toString())
        query.set('search', search || '')

        const response = await getEmployeeAction(query)

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
    },
    [search, page],
  )

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination
    query.set('page', current.toString())
    router.push(`?${query.toString()}`)
    fetchData(current, pageSize)
  }

  const specialColumns: any = {
    full_name: {
      dataIndex: ['full_name'],
      render: (text: any, record: any) => {
        return (
          <div className="flex items-center gap-[8px]">
            <Avatar
              src={record?.avatar}
              alt={text}
              style={{
                backgroundColor: randomColor(String(text)),
              }}
            >
              {String(text || '')
                .charAt(0)
                .toUpperCase()}
            </Avatar>
            <span>{text}</span>
          </div>
        )
      },
    },
    birthday: {
      dataIndex: ['birthday'],
      render: (text: any) => {
        return text && <span>{dayjs(text).format('DD/MM/YYYY')}</span>
      },
    },
    start_work_date: {
      dataIndex: ['start_work_date'],
      render: (text: any) => {
        return text && <span>{dayjs(text).format('DD/MM/YYYY')}</span>
      },
    },
    start_trial_date: {
      dataIndex: ['start_trial_date'],
      render: (text: any) => {
        return text && <span>{dayjs(text).format('DD/MM/YYYY')}</span>
      },
    },
    end_work_date: {
      dataIndex: ['end_work_date'],
      render: (text: any) => {
        return text && <span>{dayjs(text).format('DD/MM/YYYY')}</span>
      },
    },
    contract_start_date: {
      dataIndex: ['contracts', 0, 'start_date'],
      render: (text: any) => {
        return text && <span>{dayjs(text).format('DD/MM/YYYY')}</span>
      },
    },
    contract_end_date: {
      dataIndex: ['contracts', 0, 'end_date'],
      render: (text: any) => {
        return text && <span>{dayjs(text).format('DD/MM/YYYY')}</span>
      },
    },
    personal_documents: {
      dataIndex: ['personal_documents', 0, 'file_url'],
      render: (text: any) => {
        return (
          text && (
            <Link target="_blank" href={text}>
              Link
            </Link>
          )
        )
      },
    },
    url_contract: {
      dataIndex: ['url_contract'],
      render: (text: any) => {
        return (
          text && (
            <Link target="_blank" href={text}>
              Link
            </Link>
          )
        )
      },
    },
    avatar: {
      dataIndex: ['avatar'],
      render: (text: any) => {
        return (
          text && (
            <Link target="_blank" href={text}>
              Link
            </Link>
          )
        )
      },
    },
    start_date: {
      dataIndex: ['educations', 0, 'start_date'],
      render: (text: any) => {
        return text && <span>{dayjs(text).format('DD/MM/YYYY')}</span>
      },
    },
    end_date: {
      dataIndex: ['educations', 0, 'end_date'],
      render: (text: any) => {
        return text && <span>{dayjs(text).format('DD/MM/YYYY')}</span>
      },
    },
    note: {
      dataIndex: ['contracts', 0, 'note'],
      render: (text: any) => {
        return text && <span>{text}</span>
      },
    },
  }

  const columns = viewColumns.map((field: any) => {
    return {
      title: field?.label,
      dataIndex: field?.value,
      ...specialColumns[field?.value],
    }
  })

  useEffect(() => {
    if (!page) {
      refpagination.current.current = 1
    }
    const { current, pageSize } = refpagination.current
    fetchData(current, pageSize)
  }, [fetchData, search])

  useEffect(() => {
    const c = externalColumns?.find(
      (column) => convertToSlug(column.name) === view,
    )

    setViewColumns(c?.field_name || [])
  }, [view, externalColumns])

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
          onRow={(record) => ({
            onClick: (e) => {
              const target = e.target as HTMLElement
              if (target.closest('a')) {
                return
              }
              router.push(`/profile/${record?.id}`)
            },
            className: 'cursor-pointer z-10',
          })}
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
