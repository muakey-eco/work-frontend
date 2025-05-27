'use client'

import { GLOBAL_BAN } from '@/libs/constant'
import { useDragScroll } from '@/libs/hook'
import { getWeek } from '@/libs/utils'
import { Col, Row } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import StatisticsColHeader from './statistics-col-header'

const StatisticsRows = dynamic(() => import('./statistics-rows'), {
  ssr: false,
})

type StatisticsScheduleProps = {
  options?: any
}

const StatisticsSchedule: React.FC<StatisticsScheduleProps> = ({ options }) => {
  const pathname = usePathname()
  const department_id = pathname.split('/')[2]

  const [ref] = useDragScroll()
  const colRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const today = new Date()
  const week = getWeek(options?.dw ? new Date(options?.dw) : today)
  const {
    schedule,
    accounts,
    account_id,
    workflows,
    as,
    departments,
    workflowCategories,
  } = options

  // Lọc workflow categories theo phòng ban
  const workflowCategoriesWithWorkflows = workflowCategories?.filter(
    (w: any) => w?.department_id === Number(department_id),
  )

  // Lọc workflows theo phòng ban
  const workflowsDepartment = workflows?.filter((w: any) =>
    workflowCategoriesWithWorkflows?.some((wf: any) =>
      wf?.workflows.some((wf2: any) => wf2?.id === w?.id),
    ),
  )

  const days = week?.map((w: any) => w?.date)

  // Lọc task theo account và phòng ban
  const todosWithAccounts = accounts
    ?.filter(
      (acc: any) =>
        (!account_id ||
          String(account_id || '')
            .split(',')
            .includes(String(acc?.id))) &&
        acc?.type !== 'department' &&
        acc?.department_id === Number(department_id),
    )
    ?.filter((m: any) => !GLOBAL_BAN.includes(m?.full_name))
    ?.map((acc: any) => {
      const days = week?.map((w: any) => {
        const tasksOfDay = schedule?.filter(
          (s: any) => String(dayjs(s?.start).format('YYYY-MM-DD')) === w?.date,
        )

        return [
          w?.date,
          [...tasksOfDay?.filter((task: any) => task?.account_id === acc?.id)],
        ]
      })

      return {
        user: {
          id: acc?.id,
          fullName: acc?.full_name,
          avatar: acc?.avatar,
          hours: acc?.hours_work,
        },
        tasks: Object.fromEntries(days),
      }
    })

  const todosWithWorkflows = workflowsDepartment?.map((wf: any) => {
    const days = week?.map((w: any) => {
      const tasks = schedule?.filter(
        (s: any) => String(dayjs(s?.start).format('YYYY-MM-DD')) === w?.date,
      )

      return [
        w?.date,
        [
          ...tasks
            ?.filter((task: any) => task?.workflow_id === wf?.id)
            .map((t: any) => {
              const user = accounts?.find(
                (acc: any) => acc?.id === t?.account_id,
              )

              return {
                ...t,
                user: {
                  id: user?.id,
                  fullName: user?.full_name,
                  avatar: user?.avatar,
                },
              }
            }),
        ],
      ]
    })

    return {
      workflow: {
        id: wf?.id,
        name: wf?.name,
        successTasks: wf?.count_task_completed,
        failedTasks: wf?.count_task_completed_late,
        latedTasks: wf?.count_task_overdue,
      },
      tasks: Object.fromEntries(days),
    }
  })

  const todosWithDepartments = departments
    ?.filter((department: any) => department?.id === Number(department_id))
    ?.map((department: any) => {
      const members = department?.members || []

      const tasksForDepartment = members.reduce((tasks: any[], member: any) => {
        const tasksForMember = schedule?.filter(
          (task: any) => task?.account_id === member?.id,
        )

        tasks.push(...tasksForMember)
        return tasks
      }, [])

      return {
        departmentName: department?.name,
        tasks: tasksForDepartment,
      }
    })

  useEffect(() => {
    if (colRef.current) {
      colRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'center',
      })
    }
  }, [options?.currentDate])

  return (
    <div className="cursor-grab overflow-x-auto" ref={ref}>
      <Row wrap={false} className="sticky top-0 z-50 w-max">
        <Col className="w-[296px] border-y border-r bg-[#fff]" />
        {week.map((date) => {
          return (
            <Col
              key={date.day}
              ref={date.date === options?.currentDate ? colRef : null}
              className={clsx('w-[400px] cursor-pointer border-t border-r', {
                'text-[#1677ff]':
                  date.date === String(dayjs(today).format('YYYY-MM-DD')),
                '!border-t-[#096DD9] bg-[#E6F4FF]':
                  date.date === options?.currentDate,
                'bg-[#fff]': date.date !== options?.currentDate,
              })}
              onClick={() => {
                const searchParams = new URLSearchParams(window.location.search)
                searchParams.set('dw', date.date)
                router.push(
                  `/department/${department_id}/overview/statistics?${searchParams.toString()}`,
                )
              }}
            >
              <StatisticsColHeader
                title={date.day}
                subTitle={String(dayjs(date.date).format('DD/MM'))}
              />
            </Col>
          )
        })}
      </Row>
      <div className="no-scroll h-[calc(100vh-244px)] w-full divide-y">
        <StatisticsRows
          type={as ? as : 'workflow'}
          options={{
            accounts,
            days,
            todosWithAccounts,
            todosWithWorkflows,
            todosWithDepartments,
            currentDate: options?.currentDate,
          }}
        />
      </div>
    </div>
  )
}

export default StatisticsSchedule
