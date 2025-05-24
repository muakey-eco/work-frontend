'use client'

import { PageHeader } from '@/components'
import { useParams, useRouter } from 'next/navigation'

const OverviewHeader = () => {
  const params = useParams()
  const { department_id, tab } = params
  const router = useRouter()
  const activeTab = tab as string

  const handleChangeTab = (key: string) => {
    router.push(`/department/${department_id}/overview/${key}`)
  }
  return (
    <PageHeader
      title="Tổng quan"
      tab={{
        items: [
          ...(department_id === '2'
            ? [
                {
                  key: 'report',
                  label: 'Báo cáo',
                },
              ]
            : []),
          {
            key: 'statistics',
            label: 'Thống kê',
          },
          {
            key: 'compare-data',
            label: 'So sánh dữ liệu',
          },
        ],
        onChangeTab: handleChangeTab,
        activeKey: activeTab,
      }}
    />
  )
}

export default OverviewHeader
