import { ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import React from 'react'

type PageHeaderProps = {
  title?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <div className="bg-[#fff] px-[24px] py-[16px] font-[500]">
      <div className="flex items-center gap-[12px]">
        <Link href="/request">
          <ArrowLeftOutlined />
        </Link>
        <span className="text-[20px]">{title}</span>
      </div>
    </div>
  )
}

export default PageHeader
