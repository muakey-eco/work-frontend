'use client'

import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, DatePicker, DatePickerProps } from 'antd'
import { useRouter } from 'next/navigation'

const SalaryHeader = ({ id }: { id: string }) => {
  const router = useRouter()
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    router.push(`/profile/${id}/salary?date=${dateString}`)
  }
  return (
    <div className="flex items-center justify-between gap-[12px]">
      <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
        Quay lại
      </Button>
      <DatePicker onChange={onChange} picker="month" />
    </div>
  )
}

export default SalaryHeader
