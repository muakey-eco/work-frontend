'use client'

import { getAccounts } from '@/libs/data'
import { Button, DatePicker, Input, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const { RangePicker } = DatePicker

const RequestFilter: React.FC<any> = () => {
  const [account, setAccount] = useState<any[]>([])
  const [accountId, setAccountId] = useState('')
  const [date, setDate] = useState<[Dayjs | null, Dayjs | null]>([null, null])
  const [idRequest, setIdRequest] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()

  // Tạo danh sách options cho Select
  const accountOptions = account.map((item) => ({
    value: item.id,
    label: item.full_name,
  }))

  // Hàm lấy object value phù hợp cho Select khi dùng labelInValue
  const getSelectedAccountOption = () => {
    const acc = account.find((item) => item.id.toString() === accountId)
    return acc ? { value: acc.id, label: acc.full_name } : undefined
  }

  // Đồng bộ query string vào state + fetch data
  useEffect(() => {
    const fetchAccounts = async () => {
      const data = await getAccounts()
      setAccount(data)

      const queryAccountId = searchParams.get('account_id') ?? ''
      const queryStartDate = searchParams.get('start_date')
      const queryEndDate = searchParams.get('end_date')
      const queryCode = searchParams.get('code') ?? ''

      setAccountId(queryAccountId)
      setIdRequest(queryCode)

      if (queryStartDate && queryEndDate) {
        setDate([
          dayjs(queryStartDate, 'YYYY-MM-DD'),
          dayjs(queryEndDate, 'YYYY-MM-DD'),
        ])
      }
    }

    fetchAccounts()
  }, [])

  // Cập nhật URL query
  const updateSearchParams = (...args: string[]) => {
    const params = new URLSearchParams(searchParams.toString())

    for (let i = 0; i < args.length; i += 2) {
      const key = args[i]
      const value = args[i + 1]

      if (value && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }

    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Dùng labelInValue để hiển thị label từ account_id */}
      <Select
        placeholder="Chọn người tạo"
        className="w-[276px] px-3 py-2"
        options={accountOptions}
        onChange={(option) => {
          setAccountId(option?.value?.toString() ?? '')
          updateSearchParams('account_id', option?.value?.toString() ?? '')
        }}
        value={getSelectedAccountOption()}
        allowClear
        labelInValue
      />

      <RangePicker
        className="w-[276px] px-3 py-2"
        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
        format="DD/MM/YYYY"
        value={date}
        onChange={(dates) => {
          setDate(dates ?? [null, null])

          if (dates && dates[0] && dates[1]) {
            updateSearchParams(
              'start_date',
              dates[0]?.format('DD/MM/YYYY'),
              'end_date',
              dates[1]?.format('DD/MM/YYYY'),
            )
          } else {
            updateSearchParams('start_date', '', 'end_date', '')
          }
        }}
      />

      <Input.Search
        placeholder="Mã yêu cầu"
        allowClear
        style={{ width: 300 }}
        value={idRequest}
        onChange={(e) => {
          setIdRequest(e.target.value)
          if (e.target.value === '') {
            updateSearchParams('code', '')
          }
        }}
        onSearch={(value) => updateSearchParams('code', value)}
      />

      <Button
        onClick={() => {
          updateSearchParams(
            'account_id',
            '',
            'start_date',
            '',
            'end_date',
            '',
            'code',
            '',
          )

          setAccountId('')
          setDate([null, null])
          setIdRequest('')
        }}
      >
        Xóa tất cả
      </Button>
    </div>
  )
}

export default RequestFilter
