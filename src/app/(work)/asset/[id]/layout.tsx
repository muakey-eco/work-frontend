import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import Link from 'next/link'

export type AssetLayoutProps = {
  children: React.ReactNode
}
const AssetLayout: React.FC<AssetLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col bg-[#f6f6f6]">
      <div className="flex w-full items-start bg-[#fff] px-6 py-3">
        <Button type="link" className="!p-0">
          <Link
            href="/asset"
            className="flex items-center gap-[8px] text-[#1677ff]"
          >
            <ArrowLeftOutlined className="text-[16px]" />
            <span className="text-[14px] font-medium">Danh sách tài sản</span>
          </Link>
        </Button>
      </div>
      {children}
    </div>
  )
}

export default AssetLayout
