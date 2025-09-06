'use client'

import { PageHeader } from '@/components'
import { useCallback, useState } from 'react'
import { getSalaryAction } from './action'
import SalaryCollapse from './components/SalaryCollapse'

const SalaryPage: React.FC<any> = () => {
  const [salariesData, setSalariesData] = useState<Record<string, any[]>>({})
  const [loadingMonths, setLoadingMonths] = useState<Set<string>>(new Set())

  const loadSalaryData = useCallback(
    async (month: string) => {
      if (salariesData[month]) {
        return salariesData[month] // Return cached data if available
      }

      setLoadingMonths((prev) => new Set(prev).add(month))

      try {
        const data = await getSalaryAction(month)
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
      />
    </div>
  )
}

export default SalaryPage
