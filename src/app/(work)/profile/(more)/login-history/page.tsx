'use client'

import { Table, TableProps } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { getLoginHistoryAction } from '../action'
import LoginHistoryFooterTable from './Components/login-history-footer-table'

const columns: TableProps['columns'] = [
  {
    key: 'method',
    title: 'Phương thức',
    dataIndex: 'method',
  },
  {
    key: 'ip_address',
    title: 'Nguồn gốc',
    dataIndex: 'ip_address',
  },
  {
    key: 'user_agent',
    title: 'Thông tin thiết bị',
    dataIndex: 'user_agent',
    width: 660,
  },
  {
    key: 'created_at',
    title: 'Thời gian đăng nhập',
    dataIndex: 'created_at',
    render: (text: string) => dayjs(text).format('HH:mm - DD/MM/YYYY'),
  },
]

const LoginHistoryPage: React.FC = () => {
  const [data, setData] = useState<any[]>()
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true)
    try {
      const response = await getLoginHistoryAction(page, pageSize)
      const { data, current_page, per_page, total } = response
      setData(data)
      setPagination({
        current: current_page,
        pageSize: per_page,
        total,
      })
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
    fetchData(pagination.current, pagination.pageSize)
  }, [pagination])

  return (
    <div className="no-scroll h-screen overflow-y-scroll pb-[104px]">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        onChange={handleTableChange}
        scroll={{
          scrollToFirstRowOnChange: true,
          x: 'max-content',
        }}
        components={{
          header: {
            cell: (props: any) => (
              <th
                {...props}
                style={{ ...props.style, backgroundColor: 'white' }}
              />
            ),
          },
          body: {
            cell: (props: any) => (
              <td {...props} style={{ ...props.style, color: '#000000E0' }} />
            ),
          },
        }}
      />
      <LoginHistoryFooterTable
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handleTableChange}
      />
    </div>
  )
}

export default LoginHistoryPage
