import { getAttendances, getWorkflowCategories } from '@/libs/data'
import { getSession } from '@/libs/session'
import { getTodos } from '@/libs/todos'
import { Navigation } from '@/ui'
import { Layout, SideProps } from '@/ui/layout'
import {
  ContainerFilled,
  DatabaseOutlined,
  FileFilled,
  FolderOpenFilled,
  ProfileFilled,
  SignalFilled,
} from '@ant-design/icons'
import React from 'react'
import LeftSideBar from './LeftSideBar'
import Search from './Search'
import User from './User'

export type SideBarProps = SideProps & {
  items?: any[]
  user?: any
}

const SideBar: React.FC<SideBarProps> = async ({ user, ...props }) => {
  const today = new Date().getDate()
  const [workflowCategories, session, attendances, todosCount] =
    await Promise.all([
      getWorkflowCategories(),
      getSession(),
      getAttendances({
        me: 1,
      }),
      getTodos({
        include: 'number',
      }),
    ])

  const lastAttendance = attendances ? attendances[attendances?.length - 1] : {}

  const isCheckedIn = !!lastAttendance?.checkin && !lastAttendance?.checkout

  const hasCheckedIn = !!attendances && attendances?.length > 0

  const navigationItems = [
    {
      label: 'Quản lý công việc',
      icon: <FolderOpenFilled className="text-[14px]" />,
      expand: true,
      type: 'filled-rounded',
      children: [
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[16px] w-[16px]" />
              <span>Quản lý quy trình</span>
            </div>
          ),
          href: '/workflows',
        },
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[16px] w-[16px]" />
              <span>Công việc của tôi</span>
            </div>
          ),
          taskCount: 10,
          href: '/department',
        },
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[16px] w-[16px]" />
              <span>Thống kê</span>
            </div>
          ),
        },
      ],
    },
    {
      label: 'Quản lý nhân sự',
      icon: <FolderOpenFilled className="text-[14px]" />,
      expand: true,
      type: 'filled-rounded',
      children: [
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[16px] w-[16px]" />
              <span>Danh sách tài khoản</span>
            </div>
          ),
        },
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[16px] w-[16px]" />
              <span>Danh sách nhân sự</span>
            </div>
          ),
        },
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[16px] w-[16px]" />
              <span>Phòng ban</span>
            </div>
          ),
        },
      ],
    },
    {
      label: 'Quản lý chấm công',
      icon: <FolderOpenFilled className="text-[14px]" />,
      expand: true,
      type: 'filled-rounded',
      children: [
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[16px] w-[16px]" />
              <span>Chấm công</span>
            </div>
          ),
        },
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[16px] w-[16px]" />
              <span>Yêu cầu</span>
            </div>
          ),
        },
      ],
    },
    {
      label: 'Marketing',
      icon: <FolderOpenFilled className="text-[14px]" />,
      expand: true,
      type: 'filled-rounded',
      children: [],
    },
    {
      label: 'Tài nguyên',
      icon: <FolderOpenFilled className="text-[14px]" />,
      expand: true,
      type: 'filled-rounded',
      children: [],
    },
    {
      label: 'Danh mục 1',
      expand: true,
      type: 'plain',
      children: [
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <FolderOpenFilled className="text-[14px]" />
              <span>Quy trình 1</span>
            </div>
          ),
          shouldRound: true,
          href: '/check-in',
        },
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <FolderOpenFilled className="text-[14px]" />
              <span>Quy trình 2</span>
            </div>
          ),
          shouldRound: true,
        },
        {
          label: (
            <div className="flex items-center gap-[12px]">
              <SignalFilled className="text-[16px]" />
              <span>Thống kê</span>
            </div>
          ),
          href: '/statistics',
        },
        {
          label: (
            <div className="flex items-center gap-[12px]">
              <ProfileFilled className="text-[16px]" />
              <span>Yêu cầu</span>
            </div>
          ),
          href: '/request',
        },
        {
          label: (
            <div className="flex items-center gap-[12px]">
              <FileFilled className="text-[16px]" />
              <span>Tài nguyên</span>
            </div>
          ),
          href: '/resources',
        },
        {
          label: (
            <div className="flex items-center gap-[12px]">
              <DatabaseOutlined className="text-[16px]" />
              <span>Tài sản công ty</span>
            </div>
          ),
          href: '/asset',
        },
        user?.role === 'Quản trị cấp cao'
          ? {
              label: (
                <div className="flex items-center gap-[12px]">
                  <ContainerFilled className="text-[16px]" />
                  <span>Danh sách tài khoản</span>
                </div>
              ),
              href: '/accounts',
            }
          : {},
        // {
        //   label: (
        //     <div className="flex items-center gap-[12px]">
        //       <FileFilled className="text-[16px]" />
        //       <span>Quản lý nhân sự</span>
        //     </div>
        //   ),
        //   children: [
        //     {
        //       label: <div className="pl-[28px]">Danh sách tài khoản</div>,
        //       href: '/accounts',
        //     },
        //     {
        //       label: <div className="pl-[28px]">Danh sách nhân sự</div>,
        //       href: '/staffs',
        //     },
        //   ],
        // },
      ],
    },
    {
      label: 'Danh mục 2',
      expand: true,
      type: 'plain',
      children: [
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <FolderOpenFilled className="text-[14px]" />
              <span>Quy trình 1</span>
            </div>
          ),
          shouldRound: true,
        },
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <FolderOpenFilled className="text-[14px]" />
              <span>Quy trình 2</span>
            </div>
          ),
          shouldRound: true,
        },
      ],
    },
  ]

  return (
    <Layout.Side
      subSide={
        <LeftSideBar
          user={user}
          options={{
            isCheckedIn,
            hasCheckedIn,
            isFirstLogin: session.firstLoginDate !== today,
          }}
        />
      }
      {...props}
    >
      <div className="flex-1 pr-[4px]">
        <div className="flex w-[207px] flex-col justify-center px-[13px]">
          <User user={user} />
          <Search />
        </div>
        <Navigation
          className="no-scroll mt-[24px] h-[calc(100vh-96px)] overflow-auto pb-[40px]"
          items={navigationItems}
        />
        {/* <Menu mode="inline" items={navigationItems} /> */}
      </div>
    </Layout.Side>
  )
}

export default SideBar
