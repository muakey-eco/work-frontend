import { Col, Row } from 'antd'
import React from 'react'
import ProfileHeader from './profile-header'
import ProfileOverview from './profile-overview'
import ProfileSidebar from './profile-sidebar'
import ProfileUserSidebar from './profile-user-sidebar'

const ProfileMoreLayout: React.FC<{
  children: React.ReactNode
  user?: any
}> = async ({ children, user }) => {
  return (
    <>
      <ProfileHeader />

      <div className="h-[calc(100vh-55px)] bg-[#f6f6f6] p-[16px]">
        <Row gutter={[16, 16]}>
          <Col span={18}>{children}</Col>
          <Col span={6}>
            <div className="no-scroll h-[calc(100vh-87px)] !space-y-[16px] overflow-y-auto">
              <ProfileOverview user={user} />
              <ProfileSidebar />
              <ProfileUserSidebar />
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default ProfileMoreLayout
