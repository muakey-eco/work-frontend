'use client'

import { Input } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

const Search: React.FC = () => {
  const router = useRouter()

  const handleSearch = async (value: string) => {
    if (value === '') {
      router.push(`/resources`)
    } else {
      try {
        router.push(`/resources?search=${value}`)
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <Input.Search
      className="!w-[400px]"
      placeholder="Tìm kiếm"
      onSearch={handleSearch}
    />
  )
}

export default Search
