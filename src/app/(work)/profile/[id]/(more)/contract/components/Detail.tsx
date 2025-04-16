import clsx from 'clsx'
import React from 'react'

const Detail: React.FC<{
  label?: React.ReactNode
  value?: React.ReactNode
  className?: string
}> = ({ label, value, className }) => {
  return (
    <div className={clsx('flex flex-col gap-[8px]', className)}>
      <div className="text-[14px] leading-[22px] text-[#00000073]">{label}</div>
      <div className="text-[14px] leading-[22px] font-[600]">{value}</div>
    </div>
  )
}

export default Detail
