import { EditOutlined } from '@ant-design/icons'
import { Table, TableProps } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

export type WorkPauseHistoryTableProps = TableProps & {
  dataTable?: any[]
}

const WorkPauseHistoryTable: React.FC<WorkPauseHistoryTableProps> = ({
  dataTable,
  ...props
}) => {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
    },
    {
      title: 'Khoảng thời gian',
      dataIndex: 'start_date - end_date',
      render: (text: string, time: any) => {
        return `${dayjs(time.start_date).format('DD/MM/YYYY')} - ${dayjs(time.end_date).format('DD/MM/YYYY')}`
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text: string) => {
        return text === 'active' ? (
          <div className="text-[#389E0D]">Khả dụng</div>
        ) : (
          'Không khả dụng'
        )
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: () => {
        return <EditOutlined style={{ color: '#1677FF', fontSize: 20 }} />
      },
    },
  ]

  return <Table columns={columns} dataSource={dataTable} {...props} />
}

export default WorkPauseHistoryTable
