'use client'

import { Input } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type WorkflowSearchProps = {
  className?: string
}

const WorkflowSearch: React.FC<WorkflowSearchProps> = ({ className }) => {
  const [searchValue, setSearchValue] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  )

  const handleChange = (text: string) => {
    setSearchValue(text)
  }

  useEffect(() => {
    if (searchValue) {
      query.set('q', String(searchValue))
    } else {
      query.delete('q')
    }
    router.push(`?${String(query)}`)
  }, [searchValue, query, router])

  return (
    <Input.Search
      className="border-transparent"
      placeholder="Lọc nhanh"
      size="middle"
      onSearch={handleChange}
    />
  )
}

export default WorkflowSearch
