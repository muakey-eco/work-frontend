import { cn } from '@/lib/utils'
import React from 'react'

export type ScheduleHolidayTagProps = {
  children?: React.ReactNode
  type?: 'info' | 'warning' | 'error' | 'success' | 'purple'
}

const ScheduleHolidayTag: React.FC<ScheduleHolidayTagProps> = ({
  children,
  type = 'info',
}) => {
  return (
    <div
      className={cn(
        'rounded-full py-[4px] text-center text-[14px] leading-[20px] text-[#fff]',
        {
          'bg-[#1890FF]': type === 'info',
          'bg-[#237804]': type === 'success',
          'bg-[#F5222D]': type === 'error',
          'bg-[#FA8C16]': type === 'warning',
          'bg-[#722ED1]': type === 'purple',
        },
      )}
    >
      {children}
    </div>
  )
}

export default ScheduleHolidayTag
