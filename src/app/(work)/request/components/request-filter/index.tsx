'use client'

import { getAccounts } from '@/libs/data'
import { DatePicker, Input, Select } from 'antd'
import { Dayjs } from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const { RangePicker } = DatePicker

const RequestFilter: React.FC<any> = () => {
  //người tạo
  const [account, setAccount] = useState<any[]>([])
  const [accountId, setAccountId] = useState('')
  //ngày tạo
  const [date, setDate] = useState<[Dayjs | null, Dayjs | null]>([null, null])
  //mã yêu cầu
  const [idRequest, setIdRequest] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const account = async () => {
      const account = await getAccounts()
      setAccount(account)
    }
    account()
  }, [])
  const accountOptions = account.map((item) => ({
    value: item.id,
    label: item.full_name,
  }))

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
      <Select
        placeholder="Chọn người tạo"
        className="w-[276px] px-3 py-2"
        options={accountOptions}
        onChange={(value) => {
          setAccountId(value)
          updateSearchParams('account_id', value ?? '')
        }}
        allowClear
      />
      <RangePicker
        className="w-[276px] px-3 py-2"
        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
        format="DD/MM/YYYY"
        value={date}
        onChange={(dates) => {
          setDate(dates ?? [null, null])

          // Gửi lên query nếu có giá trị
          if (dates && dates[0] && dates[1]) {
            updateSearchParams(
              'date_start',
              dates[0].format('YYYY-MM-DD'),
              'date_end',
              dates[1].format('YYYY-MM-DD'),
            )
          } else {
            updateSearchParams('date_start', '', 'date_end', '')
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
    </div>
  )
}

export default RequestFilter
