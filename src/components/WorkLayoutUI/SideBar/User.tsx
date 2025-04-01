import { randomColor } from '@/libs/utils'
import { Avatar } from 'antd'
import React from 'react'

const User: React.FC<{
  user?: any
}> = ({ user }) => {
  return (
    <div className="flex w-full items-center gap-[6px] py-[16px]">
      <Avatar
        className="rounded-full! text-[16px]!"
        size={28}
        shape="circle"
        src={user?.avatar}
        style={{
          backgroundColor: randomColor(String(user?.full_name)),
        }}
        alt={user?.full_name}
      >
        {String(user?.full_name).charAt(0).toLocaleUpperCase()}
      </Avatar>{' '}
      <div>
        <div className="text-[14px] leading-[20px] font-[400]">
          {user?.full_name}
        </div>
        {user?.position && (
          <div className="text-[11px] leading-[15px] text-[#ffffff4d]">
            {user?.position}
          </div>
        )}
      </div>
    </div>
  )
}

export default User
