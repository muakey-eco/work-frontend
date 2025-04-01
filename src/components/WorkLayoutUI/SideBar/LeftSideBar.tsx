'use client'

import {
  checkedInAction,
  checkOutAction,
  logoutAction,
} from '@/components/action'
import { useAsyncEffect } from '@/libs/hook'
import {
  BellFilled,
  ExclamationCircleFilled,
  LoadingOutlined,
  LogoutOutlined,
  MehFilled,
  MenuOutlined,
} from '@ant-design/icons'
import { App, Avatar, Badge, Drawer, Dropdown } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  getIpAddressRequest,
  getNotificationsAction,
  seenNotificationsAction,
} from './action'
import CheckoutButton from './CheckoutButton'
import NotificationsList from './NotificationsList'

export type SubSideProps = {
  user?: any
  options?: any
}

const SubSide: React.FC<SubSideProps> = ({ user, options }) => {
  const { hasCheckedIn } = options

  const [loading, setLoading] = useState(false)
  const [openNotice, setOpenNotice] = useState(false)
  const [openCheckedIn, setOpenCheckedIn] = useState(!!hasCheckedIn)
  const [notifications, setNotifications] = useState<any[]>()
  const [notificationsWithNotRead, setNotificationsWithNotRead] =
    useState<any[]>()

  const router = useRouter()
  const { message, modal } = App.useApp()

  const handleLogout = async () => {
    await logoutAction()
    router.push('/login')
  }

  const handleCheckedIn = async () => {
    setLoading(true)

    const { ip } = await getIpAddressRequest()

    try {
      const { message: msg, errors } = await checkedInAction({
        ip_wifi: ip,
      })

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Điểm danh thành công')
      setLoading(false)
      router.refresh()
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  const handleCheckedOut = async () => {
    try {
      const { success, error } = await checkOutAction()

      if (error) {
        message.error(error)
        return
      }

      message.success(success)
      router.refresh()
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const handleSeeNotifications = async () => {
    setOpenNotice(true)

    if (!(notificationsWithNotRead && notificationsWithNotRead?.length > 0))
      return

    try {
      await seenNotificationsAction()

      setNotificationsWithNotRead([])
      router.refresh()
    } catch (error: any) {
      throw new Error(error)
    }
  }

  useEffect(() => {
    if (!openCheckedIn) {
      modal.confirm({
        title: `Điểm danh`,
        content: <p>Điểm danh please!</p>,
        okText: 'Điểm danh',
        cancelText: 'Hủy',
        icon: <ExclamationCircleFilled className="!text-[#1677ff]" />,
        okButtonProps: {
          loading,
        },
        open: openCheckedIn,
        onCancel: () => setOpenCheckedIn(false),
        onOk: handleCheckedIn,
      })
    }
  }, [openCheckedIn])

  useAsyncEffect(async () => {
    if (!openNotice) return

    const res = await getNotificationsAction()

    setNotifications(res)
  }, [openNotice])

  useEffect(() => {
    setNotificationsWithNotRead(
      notifications?.filter((notify: any) => notify?.new === 1),
    )
  }, [notifications])

  return (
    <div className="w-[47px] text-[#fff]">
      <Dropdown
        dropdownRender={() => (
          <div className="ml-[8px] min-w-[400px] rounded-[4px] bg-[#fff] p-[16px] shadow-[0_2px_4px_0_#0000001a]">
            <div className="flex items-center gap-[16px]">
              <Avatar className="!text-[16px]" shape="circle" size={36}>
                {String(user?.full_name).charAt(0).toLocaleUpperCase()}
              </Avatar>
              <div>
                {user?.full_name} · {user?.username}
              </div>
            </div>
          </div>
        )}
        trigger={['click']}
        placement="bottomLeft"
        arrow
      >
        <div className="flex size-[47px] cursor-pointer items-center justify-center">
          <MenuOutlined className="text-[16px]" />
        </div>
      </Dropdown>


      <Drawer
        classNames={{
          body: '!p-0',
        }}
        title={
          <div className="flex items-center justify-between">
            <span className="text-[20px]">Thông báo</span>
            <div className="cursor-pointer text-[14px] text-[#1677ff]">
              Gỡ tất cả thông báo
            </div>
          </div>
        }
        onClose={() => setOpenNotice(false)}
        open={openNotice}
        placement="left"
        width={600}
      >
        <NotificationsList
          dataSource={notifications}
          loading={notifications === undefined}
        />
      </Drawer>

      <div className='flex flex-col gap-[8px]'>
        <div
          className="flex size-[47px] cursor-pointer items-center justify-center"
          onClick={handleSeeNotifications}
        >
          <Badge
            size="small"
            overflowCount={99}
            count={notificationsWithNotRead?.length}
            classNames={{
              indicator:
                '!shadow-[0_0_0_1px_#1469c9] !p-[2px] !text-[10px] !leading-none',
            }}
          >
            <BellFilled className="text-[14px] !text-[#fff]" />
          </Badge>
        </div>
        <div className="flex size-[47px] cursor-pointer items-center justify-center">
          {loading ? (
            <LoadingOutlined />
          ) : options?.isCheckedIn ? (
            <CheckoutButton onCheckedOut={handleCheckedOut} />
          ) : (
            <MehFilled className="text-[14px]" onClick={handleCheckedIn} />
          )}
        </div>

        <div
          className="flex size-[47px] cursor-pointer items-center justify-center"
          onClick={() => {
            modal.confirm({
              title: 'Bạn có muốn đăng xuất khỏi hệ thống ngay bây giờ?',
              icon: <ExclamationCircleFilled />,
              onOk: handleLogout,
              width: 500,
              okText: 'Đăng xuất',
              cancelText: 'Quay lại',
            })
          }}
        >
          <LogoutOutlined className="text-[14px]" />
        </div>
      </div>

    </div>
  )
}

export default SubSide
