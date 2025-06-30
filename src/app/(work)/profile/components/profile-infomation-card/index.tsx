import { EditOutlined } from '@ant-design/icons'
import { Button, Card, ListProps } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import ProfileInfomationList from './ProfileInfomationList'
import ProfileInfomationModalForm from './ProfileInfomationModalForm'

export type ProfileInfomationCardProps = {
  title?: React.ReactNode
  extra?: React.ReactNode
  user?: any
}

const ProfileInfomationCard: React.FC<ProfileInfomationCardProps> = ({
  title,
  extra,
  user,
}) => {
  const data: ListProps<any>['dataSource'] = [
    {
      label: 'Họ và Tên',
      value: user?.full_name || '--',
    },
    {
      label: 'Tài khoản',
      value: user?.username || '--',
    },
    {
      label: 'Số điện thoại',
      value: user?.phone || '--',
    },
    {
      label: 'Ngày sinh',
      value: user?.birthday ? dayjs(user?.birthday).format('DD/MM/YYYY') : '--',
    },
    {
      label: 'Giới tính',
      value: user?.gender || '--',
    },
    {
      label: 'CCCD',
      value: user?.identity_card || '--',
    },
    {
      label: 'Email cá nhân',
      value: user?.personal_email || '--',
    },
    {
      label: 'Địa chỉ thường trú',
      value: user?.address || '--',
    },
    {
      label: 'Địa chỉ tạm trú',
      value: user?.temporary_address || '--',
    },
    {
      label: 'Hộ chiếu',
      value: user?.passport || '--',
    },
    {
      label: 'Tên ngân hàng',
      value: user?.name_bank || '--',
    },
    {
      label: 'Số tài khoản ngân hàng',
      value: user?.bank_number || '--',
    },
    {
      label: 'Tình trạng hôn nhân',
      value: user?.marital_status || '--',
    },
  ]

  return (
    <Card
      classNames={{
        body: 'p-[24px]! space-y-[16px]',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[20px] leading-[28px] font-[500]">{title}</div>
        {extra || (
          <ProfileInfomationModalForm initialValues={user}>
            <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
          </ProfileInfomationModalForm>
        )}
      </div>

      <ProfileInfomationList dataSource={data} />
    </Card>
  )
}

export default ProfileInfomationCard
