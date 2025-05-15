'use client'

import { Pagination } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import INotificationCard from './INotificationCard'

type INotificationCardsProps = {
  items: {
    data: any[]
    total: number
  }
}

const INotificationCards: React.FC<INotificationCardsProps> = ({ items }) => {
  const data = items.data
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')
  const currentPage = Number(searchParams.get('page')) || 1
  const currentPageSize = Number(searchParams.get('per_page')) || 18

  const filteredData = useMemo(() => {
    if (!searchQuery) return data
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [data, searchQuery])

  const handleChangePage = (page: number, pageSize: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    params.set('per_page', pageSize.toString())
    router.push(`/important-notifications?${params.toString()}`, {
      scroll: false,
    })
  }

  return (
    <>
      <div className="scrollbar-hide grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {filteredData?.map((item) => (
          <INotificationCard
            key={item.id}
            id={item.id}
            title={item?.title}
            thumbnail={item?.thumbnail}
            message={item?.message}
          />
        ))}
      </div>
      <Pagination
        total={items.total}
        pageSizeOptions={[6, 12, 18, 24, 30]}
        pageSize={currentPageSize}
        current={currentPage}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
        className="!mt-[16px]"
        onChange={handleChangePage}
      />
    </>
  )
}

export default INotificationCards
