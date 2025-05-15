'use client'

import { Card, Table, TableColumnsType } from 'antd'
import { TableProps } from 'antd/lib'

type DataType = {
  key: string
  phase: string
  totalTasks: number
  inTimeTasks: number
  overdueTasks: number
  completedTasks: number
  failedTasks: number
  time: string
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Giai đoạn',
    dataIndex: 'phase',
    sorter: (a, b) => a.phase.localeCompare(b.phase),
    render: (text) => <span style={{ color: '#0958D9' }}>{text}</span>,
  },
  {
    title: 'Tổng số nhiệm vụ',
    dataIndex: 'totalTasks',
    sorter: (a, b) => a.totalTasks - b.totalTasks,
  },
  {
    title: 'Trong thời hạn',
    dataIndex: 'inTimeTasks',
    sorter: (a, b) => a.inTimeTasks - b.inTimeTasks,
  },
  {
    title: 'Quá hạn',
    dataIndex: 'overdueTasks',
    sorter: (a, b) => a.overdueTasks - b.overdueTasks,
  },
  {
    title: 'Hoàn thành',
    dataIndex: 'completedTasks',
    sorter: (a, b) => a.completedTasks - b.completedTasks,
  },
  {
    title: 'Thất bại',
    dataIndex: 'failedTasks',
    sorter: (a, b) => a.failedTasks - b.failedTasks,
  },
  {
    title: 'Time dự kiến',
    dataIndex: 'time',
    sorter: (a, b) => a.time.localeCompare(b.time),
  },
]

const data: DataType[] = [
  {
    key: '1',
    phase: 'Giai đoạn 1',
    totalTasks: 120,
    inTimeTasks: 100,
    overdueTasks: 20,
    completedTasks: 100,
    failedTasks: 20,
    time: '100h',
  },
  {
    key: '2',
    phase: 'Giai đoạn 2',
    totalTasks: 150,
    inTimeTasks: 130,
    overdueTasks: 20,
    completedTasks: 130,
    failedTasks: 20,
    time: '130h',
  },
  {
    key: '3',
    phase: 'Giai đoạn 3',
    totalTasks: 90,
    inTimeTasks: 60,
    overdueTasks: 30,
    completedTasks: 60,
    failedTasks: 30,
    time: '60h',
  },
  {
    key: '4',
    phase: 'Giai đoạn 4',
    totalTasks: 110,
    inTimeTasks: 90,
    overdueTasks: 20,
    completedTasks: 90,
    failedTasks: 20,
    time: '90h',
  },
  {
    key: '5',
    phase: 'Giai đoạn 5',
    totalTasks: 6,
    inTimeTasks: 6,
    overdueTasks: 0,
    completedTasks: 6,
    failedTasks: 0,
    time: '6h',
  },
]

const onChange: TableProps<DataType>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra,
) => {
  console.log('params', pagination, filters, sorter, extra)
}

const TaskStatsByPhaseTable = () => {
  return (
    <Card title="Thống kê nhiệm vụ theo giai đoạn" bordered={false}>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={false}
      />
    </Card>
  )
}

export default TaskStatsByPhaseTable
