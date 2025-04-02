import bg from '@/assets/images/bg.png'
import { ResourceCategoryModalForm } from '@/components'
import { Button } from 'antd'
import React from 'react'
import Search from './Search'

const PageHeader: React.FC = () => {
  return (
    <div
      className="flex h-[190px] flex-col items-center gap-[20px] bg-[#fff] p-[24px]"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-[24px] leading-[32px] font-[500]">
        Nơi lưu trữ tài nguyên của Muakey
      </h1>
      <p className="text-[14px] leading-[22px]">
        Đây là trang Tài nguyên nội bộ của Công ty TNHH Muakey, chỉ dành riêng
        cho nhân viên Muakey. Vui lòng không chia sẻ các tài nguyên này ra bên
        ngoài.
      </p>
      <div className="flex items-center gap-[24px]">
        <Search />
        <ResourceCategoryModalForm>
          <Button type="primary">Tạo danh mục mới</Button>
        </ResourceCategoryModalForm>
      </div>
    </div>
  )
}

export default PageHeader
