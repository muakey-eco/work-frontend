import { getMe } from '@/libs/data'
import { Button, Col, Result, Row } from 'antd'
import Link from 'next/link'
import React from 'react'
import Sidebar from './Sidebar'

type AdminLayoutUIProps = {
  children?: React.ReactNode
}

const AdminLayoutUI: React.FC<AdminLayoutUIProps> = async ({ children }) => {
  const user = await getMe()

  if (user?.role !== 'Admin') {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không được phép truy cập trang này."
        extra={
          <Link href="/workflows">
            <Button type="primary">Quay lại</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="min-h-[100vh] bg-[#B5C2CA] p-[24px]">
      <Row gutter={24}>
        <Col span={6}>
          <Sidebar />
        </Col>
        <Col span={18}>{children}</Col>
      </Row>
    </div>
  )
}

export default AdminLayoutUI
