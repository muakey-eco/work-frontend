import { randomColor } from '@/libs/utils'
import { Avatar, Col, Row } from 'antd'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import StatisticsCard from '../statistics-card'
type StatisticsRowsStaffProps = {
  todos?: any[]
  options?: any
}

const StatisticsRowsStaff: React.FC<StatisticsRowsStaffProps> = ({
  todos,
  options,
}) => {
  const { days } = options
  console.log('todos', todos)

  return (
    <>
      {todos &&
        todos?.map((t: any, index: number) => (
          <Row key={t?.name} className="w-max">
            <Col className="!sticky left-0 z-10 w-[296px] overflow-hidden border-r bg-[#f5f5f5]">
              <div
                className={clsx('h-full w-[296px] bg-[#fff] p-[16px]', {
                  'pb-[80px]': index === todos?.length - 1,
                })}
              >
                <div className="flex items-center gap-[8px]">
                  <Avatar
                    src={t?.user?.avatar}
                    style={{
                      backgroundColor: randomColor(String(t?.user?.fullName)),
                    }}
                  >
                    {String(t?.user?.fullName).charAt(0).toUpperCase()}
                  </Avatar>
                  <span>{String(t?.user?.fullName)}</span>
                </div>

                <div className="mt-[12px] flex items-center gap-[8px] leading-[22px]">
                  <span>Tổng thời gian:</span>
                  <span className="text-[#CF1322]">
                    {Number(t?.user?.hours)}h
                  </span>
                </div>
              </div>
            </Col>
            {days?.map((day: string) => {
              const tasksOfDay = t?.tasks?.[day]

              return (
                <Col
                  className="w-[400px] space-y-[8px] border-r bg-[#f5f5f5] p-[8px]"
                  key={day}
                >
                  {tasksOfDay?.map((task: any, index: number) => (
                    <Link
                      className="block rounded-[8px] bg-[#fff] hover:text-[#000]"
                      key={`${task?.name_task}_${index}`}
                      href={task?.stage_id ? `/task/${task?.task_id}` : '#'}
                      data-no-drag
                    >
                      <StatisticsCard
                        title={
                          <>
                            <span className="font-[500]">
                              {task?.stage_name
                                ? `${String(task?.stage_name).toUpperCase()}: `
                                : ''}
                            </span>
                            <span>{task?.name_task}</span>
                          </>
                        }
                        extra={
                          <span className="text-[#0958D9]">
                            {Number(task?.hours_work || 0)}h
                          </span>
                        }
                        status={task?.status}
                      />
                    </Link>
                  ))}
                </Col>
              )
            })}
          </Row>
        ))}
    </>
  )
}

export default StatisticsRowsStaff
