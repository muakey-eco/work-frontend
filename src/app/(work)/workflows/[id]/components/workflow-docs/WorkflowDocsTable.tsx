'use client'

import { Table, TableProps } from 'antd'
import React, { useState } from 'react'
import { Converter } from 'showdown'

type WorkflowDocsTableProps = {
  stageId: number
  stageName: string
}

const WorkflowDocsTable: React.FC<WorkflowDocsTableProps> = ({ stageName }) => {
  const [taskReports, setTaskReports] = useState<any[]>([])
  const converter = new Converter()

  const columnKeys = taskReports?.reduce((prev: any, current: any) => {
    const prevKeyLength = Object.keys(prev)
    const currentKeyLength = Object.keys(current)

    return prevKeyLength > currentKeyLength ? prev : current
  }, {})

  const columns: TableProps['columns'] = Object.keys(columnKeys || {})?.map(
    (report: string) => ({
      title: report.toLocaleUpperCase(),
      dataIndex: report.toLocaleLowerCase(),
      render: (value) => (
        <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(value) }} />
      ),
    }),
  )

  const data: any[] = taskReports?.map((report: any) => {
    const newReport = Object.entries(report).map(([key, value]: any) => [
      String(key).toLocaleLowerCase(),
      value,
    ])

    return Object.fromEntries(newReport)
  })

  return (
    <>
      <div className="my-[16px] ml-[24px] font-[500]">
        Giai đoạn: {String(stageName).toLocaleUpperCase()}
      </div>
      <Table columns={columns} dataSource={data} />
    </>
  )
}

export default WorkflowDocsTable
