'use client'

import { cn } from '@/lib/utils'
import { Switch } from 'antd'
import React, { useEffect, useState } from 'react'

type ClassNamesType = {
  header?: string
  body?: string
}

export type SwitchFormItemProps = {
  className?: string
  title?: React.ReactNode
  children?: React.ReactNode
  extra?: React.ReactNode
  classNames?: ClassNamesType
  checked?: boolean
}

const SwitchFormItem: React.FC<SwitchFormItemProps> = ({
  className,
  title,
  children,
  extra,
  classNames,
  checked: externalChecked,
}) => {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(!!externalChecked)
  }, [externalChecked])

  return (
    <div className={className}>
      <div
        className={cn('flex items-center justify-between', classNames?.header)}
      >
        <div className="flex items-center gap-[16px]">
          <Switch checked={checked} onChange={setChecked} />
          <span className="text-[16px] leading-[24px] font-[600]">{title}</span>
        </div>
        {checked && extra}
      </div>
      {checked && (
        <div className={cn('mt-[16px]', classNames?.body)}>{children}</div>
      )}
    </div>
  )
}

export default SwitchFormItem
