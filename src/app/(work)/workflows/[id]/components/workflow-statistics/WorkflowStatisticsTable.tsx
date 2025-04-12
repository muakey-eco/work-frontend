'use client'

import { Modal, Table, TableProps } from 'antd'
import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const WorkflowStatisticsTable: React.FC<
  TableProps & {
    statistics?: any
  }
> = ({ statistics, ...props }) => {
  const [openModal, setOpenModal] = useState(false)
  const [valueModal, setValueModal] = useState<any[]>([])
  const params = useParams()

  const sColumns: TableProps['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 60,
    },
    {
      title: 'Tên nhiệm vụ',
      dataIndex: 'task_name',
      render: (value, record) => (
        <Link href={`/task/${record?.task_id}`}>{value}</Link>
      ),
    },
    {
      title: 'Giai đoạn hiện tại',
      dataIndex: 'stage',
      width: 200,
      render: (value) => (
        <span
          className={clsx({
            'text-[#ff4d4f]': value === 'Thất bại',
            'text-[#52c41a]': value === 'Hoàn thành',
          })}
        >
          {value}
        </span>
      ),
    },
  ]

  const renderStageColumn = (value: any) =>
    Array.isArray(value) ? (
      <span
        // className="cursor-pointer hover:text-[#1987FF]"
        onClick={() => {
          setOpenModal(true)
          setValueModal(value)
        }}
      >
        {value?.length}
      </span>
    ) : (
      value
    )

  const stageColumns: TableProps['columns'] = Object.keys(statistics?.[0] || {})
    .filter((s: any) => s !== 'id')
    .map((k: string) => ({
      title: k,
      dataIndex: k,
      render: renderStageColumn,
    }))

  return (
    <>
      <Table columns={stageColumns} {...props} dataSource={statistics} />
      <Modal
        classNames={{
          content: 'min-h-[306px]',
        }}
        title="Người thực thi nhiệm vụ"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        width={760}
        footer={<></>}
      >
        <Table
          columns={sColumns}
          dataSource={[
            ...valueModal?.map((v: any, index: number) => ({
              index: index + 1,
              ...v,
            })),
          ]}
        />
      </Modal>
    </>
  )
}

export default WorkflowStatisticsTable
