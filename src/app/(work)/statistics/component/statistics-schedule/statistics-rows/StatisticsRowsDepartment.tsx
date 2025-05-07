import { randomColor } from '@/libs/utils'
import { Avatar, Col, Row, Tooltip } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import StatisticsCard from '../statistics-card'

type StatisticsRowsDepartmentProps = {
  todos: {
    departmentName: string
    tasks: any[]
  }[]
  options: any
}

const StatisticsRowsDepartment = ({
  todos,
  options,
}: StatisticsRowsDepartmentProps) => {
  const { days } = options

  const countTaskStatuses = (tasks: any) => {
    return tasks?.reduce(
      (count: any, task: any) => {
        if (task.status === 'completed') {
          count.completed += 1
        } else if (task.status === 'completed_late') {
          count.completed_overdue += 1
        } else if (
          task.status === 'in_progress' ||
          task.status === 'completed_late' ||
          task.status === 'overdue'
        ) {
          count.late += 1
        }
        return count
      },
      { completed: 0, completed_overdue: 0, late: 0 },
    )
  }

  return (
    <>
      {todos &&
        todos?.map((t: any) => {
          const statusCount = countTaskStatuses(t?.tasks) // lấy thống kê trạng thái công việc

          return (
            <Row key={t?.departmentName} className="w-max">
              <Col className="!sticky left-0 z-10 w-[296px] overflow-hidden border-r bg-[#f5f5f5]">
                <div className="h-full w-[296px] bg-[#fff] p-[16px]">
                  <div className="flex items-center gap-[8px]">
                    <Avatar
                      size={32}
                      style={{
                        backgroundColor: randomColor(String(t?.departmentName)),
                      }}
                    >
                      {String(t?.departmentName).charAt(0).toUpperCase()}
                    </Avatar>
                    <span className="line-clamp-2 inline-block flex-1">
                      {String(t?.departmentName)}
                    </span>
                  </div>

                  <div className="mt-[12px] flex items-center gap-[8px] leading-[22px]">
                    <span>Hoàn thành:</span>
                    <span className="text-[#389E0D]">
                      {statusCount?.completed || 0}{' '}
                    </span>
                  </div>

                  <div className="mt-[12px] flex items-center gap-[8px] leading-[22px]">
                    <span>Hoàn thành & Quá hạn:</span>
                    <span className="text-[#B64FEE]">
                      {statusCount?.completed_overdue || 0}{' '}
                    </span>
                  </div>

                  <div className="mt-[12px] flex items-center gap-[8px] leading-[22px]">
                    <span>Chưa hoàn thành & Quá hạn:</span>
                    <span className="text-[#F5222D]">
                      {statusCount?.late || 0}
                    </span>
                  </div>
                </div>
              </Col>
              {days?.map((day: string) => {
                const tasksOfDay = t?.tasks.filter((task: any) => {
                  const taskStart = dayjs(task?.start)
                  return taskStart.format('YYYY-MM-DD') === day
                })

                return (
                  <Col
                    className="w-[400px] space-y-[8px] border-r bg-[#f5f5f5] p-[8px]"
                    key={day}
                  >
                    {tasksOfDay?.map((task: any, index: number) => (
                      <Link
                        className="block rounded-[8px] hover:text-[#000]"
                        key={`${task?.name_task}_${index}`}
                        href={`/task/${task?.task_id}`}
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
                            <Tooltip title={task?.name_task}>
                              <Avatar
                                size="small"
                                src={task?.avatar}
                                style={{
                                  backgroundColor: randomColor(
                                    String(task?.name_task),
                                  ),
                                }}
                              >
                                {String(task?.name_task)
                                  .charAt(0)
                                  .toUpperCase()}
                              </Avatar>
                            </Tooltip>
                          }
                          status={task?.status}
                        />
                      </Link>
                    ))}
                  </Col>
                )
              })}
            </Row>
          )
        })}
    </>
  )
}

export default StatisticsRowsDepartment
