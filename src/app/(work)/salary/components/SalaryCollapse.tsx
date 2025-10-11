'use client'

import type { CollapseProps } from 'antd'
import { Collapse, Pagination, Spin } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import SalaryTable from './SalaryTable'

interface SalaryCollapseProps {
  salariesData: Record<string, any[]>
  loadingMonths: Set<string>
  onLoadSalaryData: (month: string) => Promise<any[]>
  onUpdateSalaryData: (month: string, updater: any) => void
  closedMonths: Record<string, boolean>
}

const SalaryCollapse: React.FC<SalaryCollapseProps> = ({
  salariesData,
  loadingMonths,
  onLoadSalaryData,
  onUpdateSalaryData,
  closedMonths,
}) => {
  const currentMonth = dayjs().month() + 1 // Tháng hiện tại (1–12)
  const currentYear = dayjs().year()
  const [activeKeys, setActiveKeys] = useState<string[]>([String(currentMonth)])

  // Tạo danh sách tháng từ currentMonth → 1
  const months = Array.from(
    { length: currentMonth },
    (_, i) => currentMonth - i,
  )

  // Load dữ liệu cho tháng hiện tại khi component mount
  useEffect(() => {
    const currentMonthStr = dayjs().format('YYYY-MM')
    onLoadSalaryData(currentMonthStr)
  }, [onLoadSalaryData])

  const handleCollapseChange = async (keys: string | string[]) => {
    const activeKeysArray = Array.isArray(keys) ? keys : [keys]
    setActiveKeys(activeKeysArray)

    // Load dữ liệu cho các tháng được mở
    for (const key of activeKeysArray) {
      const month = parseInt(key)
      const monthStr = dayjs()
        .year(currentYear)
        .month(month - 1)
        .format('YYYY-MM')

      if (!salariesData[monthStr]) {
        await onLoadSalaryData(monthStr)
      }
    }
  }

  const items: CollapseProps['items'] = months.map((month) => {
    const monthStr = dayjs()
      .year(currentYear)
      .month(month - 1)
      .format('YYYY-MM')
    // const isActive = activeKeys.includes(String(month))

    const isLoading = loadingMonths.has(monthStr)

    const monthSalaries = salariesData[monthStr] || []

    console.log('monthSalaries', monthSalaries)

    // Lọc nhân viên bỏ role Admin
    const employeeSalaries = monthSalaries.filter(
      (salary: any) => salary.role !== 'Admin',
    )

    return {
      key: String(month),
      label: `Bảng lương tháng ${month}/${currentYear}`,
      children: isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <SalaryTable
          salaries={employeeSalaries}
          currentMonth={month}
          monthStr={monthStr}
          isClosedSalary={Boolean(closedMonths[monthStr])}
          setSalaries={(updater: any) => {
            onUpdateSalaryData(monthStr, updater)
          }}
          onMonthClosed={async (m: string) => {
            // Mark month closed and reload its closed data
            // Optimistically set closed flag
            // Note: parent holds the source of truth in page state; we can trigger parent load
            await onLoadSalaryData(m)
          }}
        />
      ),
    }
  })

  return (
    <div className="h-[calc(100vh-90px)] overflow-y-auto p-[12px]">
      <Collapse
        items={items}
        activeKey={activeKeys}
        onChange={handleCollapseChange}
      />
      <Pagination className="!mt-[12px]" total={100} showSizeChanger={false} />
    </div>
  )
}

export default SalaryCollapse
