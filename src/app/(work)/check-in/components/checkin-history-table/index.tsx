'use client'

import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { App, Badge, Table, TableProps } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { deleteProposeAction } from '../action'
import CheckInHistoryFiltered from './CheckInHistoryFiltered'

type CheckInHistoryTableProps = {
  options?: any
}

const generatedStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return (
        <div className="flex items-center gap-[8px] text-[#FAAD14]">
          <Badge dot color="#FAAD14" />
          <span>Đang chờ duyệt</span>
        </div>
      )

    case 'approved':
      return (
        <div className="flex items-center gap-[8px] text-[#389E0D]">
          <Badge dot color="#389E0D" />
          <span>Đã duyệt</span>
        </div>
      )

    case 'canceled':
      return (
        <div className="flex items-center gap-[8px] text-[#CF1322]">
          <Badge dot color="#CF1322" />
          <span>Từ chối</span>
        </div>
      )

    case 'rejected':
      return (
        <div className="flex items-center gap-[8px] text-[#CF1322]">
          <Badge dot color="#CF1322" />
          <span>Từ chối</span>
        </div>
      )

    default:
      return <></>
  }
}

const CheckInHistoryTable: React.FC<CheckInHistoryTableProps> = ({
  options,
}) => {
  const [loading, setLoading] = useState(false)
  const { propose, user } = options
  const { message, modal } = App.useApp()
  const router = useRouter()
  const searchParams = useSearchParams()

  const statusParams = searchParams.get('status')

  const handleDelete = async (id: number) => {
    setLoading(true)

    try {
      const { message: msg, errors } = await deleteProposeAction(id)

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Xóa yêu cầu thành công')
      setLoading(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  const columns: TableProps['columns'] = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'id',
    },
    {
      title: 'Loại yêu cầu',
      dataIndex: 'name',
    },
    {
      title: 'Thời gian gửi yêu cầu',
      dataIndex: 'created_at',
      render: (value) => String(dayjs(value).format('DD-MM-YYYY HH:mm:ss')),
    },
    {
      title: 'Tổng thời gian',
      dataIndex: 'total',
      render: () => '--',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (value) => generatedStatus(value),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (_, record) => (
        <div className="flex items-center gap-[12px]">
          {record?.status === 'pending' ? (
            <>
              <EditOutlined className="cursor-pointer text-[16px] text-[#389E0D]" />
              {/* <CloseOutlined
                className="cursor-pointer text-[16px] text-[#CF1322]"
                onClick={() => {
                  modal.confirm({
                    title: 'Xác nhận hủy yêu cầu này?',
                    onOk: () => handleCanceled(record),
                    okButtonProps: {
                      loading,
                    },
                  })
                }}
              /> */}
            </>
          ) : (
            <></>
          )}
          <DeleteOutlined
            className="cursor-pointer text-[16px] text-[#CF1322]"
            onClick={() => {
              modal.confirm({
                title: 'Xác nhận xóa yêu cầu này?',
                onOk: () => handleDelete(record?.id),
                okButtonProps: {
                  loading,
                },
              })
            }}
          />
          <Link href={`/request-history/${record.id}`}>
            <EyeOutlined className="text-[16px] text-[#1677ff]" />
          </Link>
        </div>
      ),
    },
  ]

  const dataSource: TableProps['dataSource'] = propose
    .filter((p: any) => p?.account?.id === user?.id)
    .filter((p: any) =>
      !statusParams || statusParams === 'all'
        ? true
        : statusParams === p?.status,
    )

  return (
    <>
      <CheckInHistoryFiltered className="mb-[16px]" />

      <Table columns={columns} dataSource={dataSource} />
    </>
  )
}

export default CheckInHistoryTable
