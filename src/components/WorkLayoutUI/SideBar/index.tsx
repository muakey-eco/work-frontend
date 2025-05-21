import WorkflowModalForm from '@/app/(work)/workflows/components/workflow-list/WorkflowModalForm'
import { getAttendances, getProjects, getWorkflowCategories } from '@/libs/data'
import { getSession } from '@/libs/session'
import { getTodos } from '@/libs/todos'
import { Navigation, NavigationMenuType } from '@/ui'
import { Layout, SideProps } from '@/ui/layout'
import {
  CalendarFilled,
  DashboardFilled,
  DatabaseFilled,
  PlusCircleFilled,
  ProjectFilled,
} from '@ant-design/icons'
import React from 'react'
import LeftSideBar from './LeftSideBar'
import Search from './Search'
import User from './User'

export type SideBarProps = SideProps & {
  items?: any[]
  user?: any
}

const IconUserFilled = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M12.4141 10.9294C12.1194 10.2312 11.6916 9.59702 11.1547 9.06217C10.6195 8.52578 9.9854 8.09812 9.28754 7.8028C9.28129 7.79967 9.27504 7.79811 9.26879 7.79498C10.2422 7.09186 10.875 5.94655 10.875 4.65436C10.875 2.51373 9.14067 0.779358 7.00004 0.779358C4.85941 0.779358 3.12504 2.51373 3.12504 4.65436C3.12504 5.94655 3.75785 7.09186 4.73129 7.79655C4.72504 7.79967 4.71879 7.80123 4.71254 7.80436C4.01254 8.09967 3.38441 8.52311 2.84535 9.06373C2.30896 9.599 1.8813 10.2331 1.58598 10.9309C1.29585 11.6141 1.13939 12.3466 1.12504 13.0887C1.12462 13.1054 1.12755 13.122 1.13364 13.1375C1.13974 13.1531 1.14888 13.1672 1.16053 13.1792C1.17218 13.1911 1.1861 13.2006 1.20147 13.2071C1.21684 13.2135 1.23336 13.2169 1.25004 13.2169H2.18754C2.25629 13.2169 2.33382 13.2169 2.31254 13.2169C3.50049 13.2169 2.62549 13.2169 3.68441 13.2169C5.10004 13.2169 5.74691 13.2169 7.00004 13.2169C8.25316 13.2169 9.33382 13.2169 10.3157 13.2169C11.2975 13.2169 10.7922 13.2169 11.6875 13.2169C11.6672 13.2169 11.7438 13.2169 11.8125 13.2169H12.75C12.7667 13.2169 12.7832 13.2135 12.7986 13.2071C12.814 13.2006 12.8279 13.1911 12.8396 13.1792C12.8512 13.1672 12.8603 13.1531 12.8664 13.1375C12.8725 13.122 12.8755 13.1054 12.875 13.0887C12.8594 12.3419 12.7047 11.6153 12.4141 10.9294Z"
      fill="white"
    />
  </svg>
)

const SideBar: React.FC<SideBarProps> = async ({ user, ...props }) => {
  const today = new Date().getDate()
  const [workflowCategories, session, attendances, todosCount, myProjects] =
    await Promise.all([
      getWorkflowCategories(),
      getSession(),
      getAttendances({
        me: 1,
      }),
      getTodos({
        include: 'number',
      }),
      getProjects(),
    ])

  const lastAttendance = attendances ? attendances[attendances?.length - 1] : {}

  const isCheckedIn = !!lastAttendance?.checkin && !lastAttendance?.checkout

  const hasCheckedIn = !!attendances && attendances?.length > 0

  const navigationItems: NavigationMenuType[] = [
    {
      label: 'Quản lý công việc',
      icon: <DashboardFilled className="text-[14px]" />,
      expand: true,
      type: 'filled-rounded',
      key: 'work-management',
      children: [
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[14px] w-[12px]" />
              <span>Công việc của tôi</span>
              {todosCount > 0 && (
                <div className="rounded-[4px] bg-[#ff5555] px-[6px] pt-[2px] pb-[4px] text-[12px] font-[500]">
                  <span className="leading-[12px]">{todosCount}</span>
                </div>
              )}
            </div>
          ),
          shouldRound: false,
          key: 'my-todos',
          href: '/todos',
        },
        ...(myProjects && myProjects.length > 0
          ? myProjects?.map((p: any) => ({
              label: (
                <div className="flex items-center gap-[10px]">
                  <div className="h-[14px] w-[12px]" />
                  <span>{p?.name}</span>
                </div>
              ),
              shouldRound: false,
              key: `project-${p?.id}`,
              href: `/workflows/${p?.id}`,
            }))
          : []),
      ],
    },
    ...(workflowCategories && workflowCategories.length > 0
      ? workflowCategories?.map((w: any) => ({
          label: w?.name,
          icon: <DashboardFilled className="text-[14px]" />,
          expand: true,
          type: 'filled-rounded',
          key: `team-${w?.id}`,
          children: [
            {
              label: (
                <div className="flex items-center gap-[10px]">
                  <div className="h-[14px] w-[12px]" />
                  <span>Tổng quan</span>
                </div>
              ),
              shouldRound: false,
              key: `overview-${w?.id}`,
              href: `#`,
            },
            {
              label: (
                <div className="flex items-center gap-[10px]">
                  <div className="h-[14px] w-[12px]" />
                  <span>Thành viên</span>
                </div>
              ),
              shouldRound: false,
              key: `members-${w?.id}`,
              href: `#`,
            },
            ...(w.workflows?.length
              ? [
                  {
                    label: (
                      <div className="group flex items-center gap-[10px]">
                        <div className="h-[14px] w-[12px]" />
                        <div className="flex items-center gap-[10px]">
                          Danh sách quy trình
                          <WorkflowModalForm
                            action="create"
                            initialValues={{
                              members: w?.members,
                              workflow_category_id: w?.id,
                              departments: workflowCategories,
                            }}
                          >
                            <div className="opacity-0 transition group-hover:opacity-100">
                              <PlusCircleFilled />
                            </div>
                          </WorkflowModalForm>
                        </div>
                      </div>
                    ),
                    shouldRound: false,
                    key: `workflow-list-${w?.id}`,
                    children: [
                      ...(w?.workflows?.map((i: any) => ({
                        label: (
                          <div className="ml-4 flex items-center gap-[10px]">
                            <div className="h-[14px] w-[12px]" />
                            <span>{i?.name}</span>
                          </div>
                        ),
                        key: `workflow-${w?.id}-${i?.id}`,
                        href: `/workflows/${i?.id}`,
                      })) || []),
                    ],
                  },
                ]
              : []),
          ],
        }))
      : []),
    {
      label: 'Quản lý danh mục',
      icon: <ProjectFilled className="text-[14px]" />,
      expand: true,
      type: 'filled-rounded',
      key: 'category-management',
      children: [
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[14px] w-[12px]" />
              <span>Quản lý quy trình</span>
            </div>
          ),
          shouldRound: false,
          key: 'workflow-management',
          href: '/workflows',
        },
      ],
    },
    user?.role === 'Admin'
      ? {
          label: 'Quản lý nhân sự',
          icon: <IconUserFilled />,
          expand: true,
          type: 'filled-rounded',
          key: 'hr-management',
          children: [
            {
              label: (
                <div className="flex items-center gap-[10px]">
                  <div className="h-[14px] w-[12px]" />
                  <span>Danh sách tài khoản</span>
                </div>
              ),
              shouldRound: false,
              key: 'account-list',
              href: '/accounts',
            },
            {
              label: (
                <div className="flex items-center gap-[10px]">
                  <div className="h-[14px] w-[12px]" />
                  <span>Danh sách nhân sự</span>
                </div>
              ),
              shouldRound: false,
              key: 'employee-list',
              href: '/employees',
            },
            {
              label: (
                <div className="flex items-center gap-[10px]">
                  <div className="h-[14px] w-[12px]" />
                  <span>Phòng ban</span>
                </div>
              ),
              shouldRound: false,
              key: 'departments',
            },
            {
              label: (
                <div className="flex items-center gap-[10px]">
                  <div className="h-[14px] w-[12px]" />
                  <span>Thông báo quan trọng</span>
                </div>
              ),
              shouldRound: false,
              key: 'important-notifications',
              href: '/important-notifications',
            },
          ],
        }
      : undefined,
    {
      label: 'Quản lý chấm công',
      icon: <CalendarFilled className="text-[14px]" />,
      expand: true,
      type: 'filled-rounded',
      key: 'attendance-management',
      children: [
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[14px] w-[12px]" />
              <span>Chấm công</span>
            </div>
          ),
          shouldRound: false,
          key: 'check-in',
          href: '/check-in',
        },
        {
          label: (
            <div className="flex items-center gap-[10px]">
              <div className="h-[14px] w-[12px]" />
              <span>Yêu cầu</span>
            </div>
          ),
          shouldRound: false,
          key: 'request',
          href: '/request',
        },
      ],
    },
    {
      label: 'Tài nguyên',
      icon: (
        <DatabaseFilled className="text-[14px]" style={{ color: 'white' }} />
      ),
      expand: true,
      type: 'filled-rounded',
      key: 'resources',
      children: [],
      href: '/resources',
    },
    {
      label: 'Tài sản công ty',
      icon: (
        <DatabaseFilled className="text-[14px]" style={{ color: 'white' }} />
      ),
      type: 'filled-rounded',
      expand: true,
      key: 'company-assets',
      children: [],
      href: '/asset',
    },
  ].filter(Boolean) as NavigationMenuType[]

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
      <div className="flex-1">
        <div className="flex w-[207px] flex-col justify-center px-[13px]">
          <User user={user} />
          <Search />
        </div>
        <Navigation
          className="no-scroll mt-[24px] h-[calc(100vh-215px)] overflow-auto pb-[40px]"
          items={navigationItems}
        />
      </div>
    </Layout.Side>
  )
}

export default SideBar
