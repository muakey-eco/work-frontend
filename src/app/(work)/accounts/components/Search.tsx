'use client'

import { Input } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const Search: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = new URLSearchParams(searchParams)

  const search = query.get('search')
  const handleSearch = (value: string) => {
    if (value) {
      query.set('search', value)
    } else {
      query.delete('search')
    }
    query.delete('page')
    router.push(`?${query.toString()}`)
  }

  return (
    <Input.Search
      placeholder="Tìm kiếm nhân sự"
      height={32}
      width={278}
      defaultValue={search || ''}
      onSearch={handleSearch}
    />
  )
}

export default Search
