'use client'

import type { CollapseProps } from 'antd'
import { Collapse, Pagination } from 'antd'
import React from 'react'
import SalaryTable from './SalaryTable'

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'Bảng lương tháng 06/2025',
    children: <SalaryTable />,
  },
  {
    key: '2',
    label: 'Bảng lương tháng 05/2025',
    children: <SalaryTable />,
  },
  {
    key: '3',
    label: 'Bảng lương tháng 04/2025',
    children: <SalaryTable />,
  },
  {
    key: '4',
    label: 'Bảng lương tháng 03/2025',
    children: <SalaryTable />,
  },
]

const SalaryCollapse: React.FC = () => {
  const onChange = (key: string | string[]) => {
    console.log(key)
  }

  return (
    <div className="h-[calc(100vh-90px)] overflow-y-auto p-[12px]">
      <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />
      <Pagination className="!mt-[12px]" total={100} />
    </div>
  )
}

export default SalaryCollapse
