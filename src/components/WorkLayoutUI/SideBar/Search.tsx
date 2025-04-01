import { SearchOutlined } from '@/ui/icons'
import React from 'react'

const Search: React.FC = () => {
  return (
    <div className="flex justify-between h-[32px] w-[207px] rounded-full bg-[#ffffff1a]">
      <input
        type="text"
        className="bg-transparent py-[4px] px-[12px] text-[12px] text-[#ffffff] placeholder:text-[##FFFFFF40] focus-visible:outline-hidden"
        placeholder="Tìm kiếm nhân sự"
      />
      <SearchOutlined className="text-[14px] px-[12px]" />
    </div>
  )
}

export default Search
