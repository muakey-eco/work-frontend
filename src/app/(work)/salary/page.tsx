'use client'

import { PageHeader } from '@/components'
import { useCallback, useState } from 'react'
import { getSalaryAction, getSalaryCloseAction } from './action'
import SalaryCollapse from './components/SalaryCollapse'

const SalaryPage: React.FC<any> = () => {
  const [salariesData, setSalariesData] = useState<Record<string, any[]>>({})
  const [loadingMonths, setLoadingMonths] = useState<Set<string>>(new Set())
  const [closedMonths, setClosedMonths] = useState<Record<string, boolean>>({})

  const loadSalaryData = useCallback(
    async (month: string) => {
      if (salariesData[month]) {
        return salariesData[month] // Return cached data if available
      }

      setLoadingMonths((prev) => new Set(prev).add(month))

      try {
        const isClosed = await getSalaryCloseAction(month)
        console.log(`[${month}] isClosed data:`, isClosed)
        let data = []

        if (isClosed && isClosed.length !== 0) {
          // Đã chốt lương
          console.log(`[${month}] Tháng đã chốt lương, sử dụng data từ isClosed`)
          setClosedMonths((prev) => ({ ...prev, [month]: true }))
          data = isClosed
        } else {
          // Chưa chốt, check bảng nháp
          console.log(`[${month}] Tháng chưa chốt, lấy data nháp`)
          setClosedMonths((prev) => ({ ...prev, [month]: false }))
          data = await getSalaryAction(month)
        }

        console.log(`[${month}] Final data:`, data)

        setSalariesData((prev) => ({
          ...prev,
          [month]: data,
        }))
        return data
      } catch (error) {
        console.error('Error loading salary data:', error)
        return []
      } finally {
        setLoadingMonths((prev) => {
          const newSet = new Set(prev)
          newSet.delete(month)
          return newSet
        })
      }
    },
    [salariesData],
  )

  const updateSalaryData = useCallback((month: string, updater: any) => {
    setSalariesData((prev) => ({
      ...prev,
      [month]:
        typeof updater === 'function' ? updater(prev[month] || []) : updater,
    }))
  }, [])

  return (
    <div className="h-[100vh] bg-[#f6f6f6]">
      <PageHeader title="Bảng lương" />
      <SalaryCollapse
        salariesData={salariesData}
        loadingMonths={loadingMonths}
        onLoadSalaryData={loadSalaryData}
        onUpdateSalaryData={updateSalaryData}
        closedMonths={closedMonths}
      />
    </div>
  )
}

export default SalaryPage
