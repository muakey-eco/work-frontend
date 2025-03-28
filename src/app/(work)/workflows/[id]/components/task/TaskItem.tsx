'use client'

import MarkTaskFailedModalForm from '@/components/MarkTaskModalForm'
import {
  abbreviateNumber,
  convertRelativeTime,
  convertTime,
  randomColor,
} from '@/libs/utils'
import { EllipsisOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  App,
  Avatar,
  Button,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Tag,
  Tooltip,
} from 'antd'
import { createStyles } from 'antd-style'
import clsx from 'clsx'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { cloneDeep } from 'lodash'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { memo, useContext, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Converter } from 'showdown'
import {
  addTaskReportAction,
  assignTaskWithoutWorkAction,
  editTaskAction,
  moveStageAction,
} from '../../../action'
import { StageContext } from '../stage'
import { getReportFieldsByWorkflowIdAction } from '../stage/action'
import TaskDoneModalForm from '../stage/TaskDoneModalForm'
import TaskReportsModalForm from '../stage/TaskReportsModalForm'
import { StageContext as WorkflowStageContext } from '../WorkflowPageLayout'
import MemberList from './member-list'
import TaskItemStatistics from './task-item-statistics'
import TaskModalForm from './TaskModalForm'

export type TaskItemProps = {
  className?: string
  task?: any
  isCompleted?: boolean
  isFailed?: boolean
  members?: any
  expired?: number
  onDelete?: () => Promise<void>
  userId?: number
  options?: any
  style?: React.CSSProperties
}

const useStyle = createStyles(({ css }) => ({
  menu: css`
    .ant-dropdown-menu {
      .ant-dropdown-menu-item {
        padding: 0;
      }
    }
  `,
}))

const TaskItem: React.FC<TaskItemProps> = memo(
  ({
    className,
    task,
    isCompleted,
    isFailed,
    members,
    onDelete,
    userId,
    options,
    style: externalStyle,
  }) => {
    const [assignConfirmOpen, setAssignConfirmOpen] = useState(false)
    const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)
    const [taskReportOpen, setTaskReportOpen] = useState(false)
    const [doneOpen, setDoneOpen] = useState(false)
    const [reports, setReports] = useState<any[]>([])
    const [currentStage, setCurrentStage] = useState<any>()
    const router = useRouter()

    const { failedStageId } = useContext(StageContext)
    const { setStages } = useContext(WorkflowStageContext)
    const params = useParams()
    const { message, modal } = App.useApp()
    const { styles } = useStyle()
    const converter = new Converter()

    const now = new Date()
    const daysFromNow = Math.abs(dayjs(task?.date_posted).diff(now, 'day'))
    const { stages, role } = options

    const isNotAchieved = task?.view_count < 1000 && daysFromNow > 7

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task?.id, data: task })

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }

    const user = members?.find((u: any) => u?.id === task?.account_id)

    const handleRemoveExecutor = async (id: number) => {
      if (!String(options?.role).toLowerCase().includes('quản trị')) {
        if (userId !== task.account_id) {
          toast.error('Không thể gỡ nhiệm vụ của người khác.')
          return
        }
      }

      try {
        const { message, errors } = await editTaskAction(id, {
          account_id: null,
          started_at: null,
        })

        setStages((prevStages: any[]) => {
          const newStages = cloneDeep(prevStages)

          return newStages?.map((stage: any) => {
            if (stage?.id === `stage_${task?.stage_id}`) {
              return {
                ...stage,
                tasks: stage?.tasks?.map((t: any) => {
                  if (t?.id === task?.id) {
                    return {
                      ...t,
                      account_id: null,
                      expired: null,
                    }
                  }

                  return t
                }),
              }
            }

            return stage
          })
        })

        if (errors) {
          toast.error(message)
          return
        }

        toast.success('Đã gỡ người thực thi.')
        setRemoveConfirmOpen(false)
      } catch (error: any) {
        throw new Error(error)
      }
    }

    dayjs.extend(duration)

    const t = new Date(task?.expired).getTime() - new Date().getTime()
    const timeStatus = t >= 0 ? 'inprogress' : 'overdue'
    const time = dayjs.duration(Math.abs(t))

    const handleStageClick = async (stage: any) => {
      const stageId = +String(stage?.id).split('_')[1]

      if (task?.stage_id === stageId) return

      if (!task.account_id && [1].includes(stage?.index)) {
        message.error('Nhiệm vụ chưa được giao.')
        return
      }

      if (!String(role).toLocaleLowerCase().includes('quản trị')) {
        if (task.account_id !== userId) {
          message.error(
            'Không thể kéo nhiệm vụ của người khác hoặc chưa được giao.',
          )
          return
        }
      }

      try {
        const {
          message: msg,
          errors,
          account_id,
          expired,
        } = await moveStageAction(task?.id, stageId)

        if (errors) {
          message.error(msg)
          return
        }

        setStages((prevStages: any[]) => {
          const newStages = [...prevStages]

          return newStages?.map((stage: any) => {
            if (stage?.id === `stage_${task?.stage_id}`) {
              return {
                ...stage,
                tasks: stage?.tasks?.filter((t: any) => t?.id !== task?.id),
              }
            }

            if (stage?.id === `stage_${stageId}`) {
              return {
                ...stage,
                tasks: [
                  {
                    ...task,
                    stage_id: stageId,
                    account_id: account_id || null,
                    expired: account_id
                      ? expired
                        ? expired
                        : stage?.expired_after_hours
                          ? new Date().setHours(
                              new Date().getHours() +
                                stage?.expired_after_hours,
                            )
                          : null
                      : null,
                  },
                  ...stage?.tasks,
                ],
              }
            }

            return stage
          })
        })

        router.refresh()
      } catch (error: any) {
        throw new Error(error)
      }
    }

    const handleSubmit = async (values: any) => {
      const formData = Object.fromEntries(
        Object.keys(values).map((key: string) => [
          key,
          converter.makeHtml(values[key]),
        ]),
      )

      try {
        const { message, errors } = await addTaskReportAction(
          {
            ...formData,
          },
          {
            task_id: task?.id,
          },
        )

        if (errors) {
          toast.error(message)
          return
        }

        handleStageClick(currentStage)
        setTaskReportOpen(false)
      } catch (error) {
        throw new Error()
      }
    }

    const handleAssign = async (id: number) => {
      try {
        const { message: msg, errors } = await editTaskAction(task?.id, {
          account_id: id,
        })

        setStages((prevStages: any[]) => {
          const newStages = [...prevStages]

          return newStages?.map((stage: any) => {
            if (stage?.id === `stage_${task?.stage_id}`) {
              return {
                ...stage,
                tasks: stage?.tasks?.map((t: any) => {
                  if (t?.id === task?.id) {
                    return {
                      ...t,
                      account_id: id,
                      expired: stage.expired_after_hours
                        ? new Date().setHours(
                            new Date().getHours() + stage.expired_after_hours,
                          )
                        : null,
                      started_at: new Date(),
                    }
                  }

                  return t
                }),
              }
            }

            return stage
          })
        })

        if (errors) {
          message.error(msg)
          return
        }

        message.success('Nhận thành công.')
        setAssignConfirmOpen(false)
      } catch (error: any) {
        throw new Error(error)
      }
    }

    const handleAssignWithoutWork = async (id: number) => {
      try {
        const { message: msg, errors } = await assignTaskWithoutWorkAction(
          task?.id,
          {
            account_id: id,
          },
        )

        setStages((prevStages: any[]) => {
          const newStages = [...prevStages]

          return newStages?.map((stage: any) => {
            if (stage?.id === `stage_${task?.stage_id}`) {
              return {
                ...stage,
                tasks: stage?.tasks?.map((t: any) => {
                  if (t?.id === task?.id) {
                    return {
                      ...t,
                      account_id: id,
                      expired: stage.expired_after_hours
                        ? new Date().setHours(
                            new Date().getHours() + stage.expired_after_hours,
                          )
                        : null,
                    }
                  }

                  return t
                }),
              }
            }

            return stage
          })
        })

        if (errors) {
          message.error(msg)
          return
        }

        message.success('Nhiệm vụ đã được giao.')
        setAssignConfirmOpen(false)
      } catch (error: any) {
        throw new Error(error)
      }
    }

    const handleMoveStageClick = async (stage: any) => {
      const activeStage = stages?.find(
        (s: any) => s?.id === `stage_${task?.stage_id}`,
      )
      const overStage = stages?.find((s: any) => s?.id === stage?.id)

      setCurrentStage(stage)

      if (overStage?.index === 1) {
        setDoneOpen(true)
        return
      }

      const data = await getReportFieldsByWorkflowIdAction({
        workflow_id: Number(params?.id),
        stage_id: task?.stage_id,
        task_id: task?.id,
      })

      setReports(data)

      if (
        data?.length > 0 &&
        task?.account_id &&
        activeStage?.index > overStage?.index
      ) {
        setTaskReportOpen(true)
        return
      }

      handleStageClick(stage)
    }

    const taskDropdownItems: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <Link className="px-[12px] leading-[32px]" href={`/task/${task?.id}`}>
            Xem nhiệm vụ
          </Link>
        ),
      },
      {
        key: '2',
        label: 'Chuyển giai đoạn',
        children: stages?.map((stage: any, index: number) => ({
          key: `2-${index + 1}`,
          label: (
            <div
              className={clsx({
                'text-[#d96c6c]': stage?.index === 0,
                'text-[#42bb14]': stage?.index === 1,
              })}
              key={stage?.id}
              onClick={() => handleMoveStageClick(stage)}
            >
              {stage?.name}
            </div>
          ),
        })),
      },
      ...(String(role).toLocaleLowerCase().includes('quản trị')
        ? [
            {
              key: '3',
              label: (
                <TaskModalForm
                  title="CHỈNH SỬA NHIỆM VỤ"
                  initialValues={{
                    ...task,
                    members,
                    userId,
                  }}
                  action="edit"
                >
                  <span className="px-[12px] leading-[32px]">
                    Chỉnh sửa nhiệm vụ
                  </span>
                </TaskModalForm>
              ),
            },
            {
              key: '7',
              label: (
                <div
                  className="px-[12px] leading-[32px]"
                  onClick={(e) => {
                    e.preventDefault()
                    setAssignConfirmOpen(true)
                  }}
                >
                  Giao
                </div>
              ),
            },
          ]
        : []),
      {
        key: '4',
        label: (
          <MarkTaskFailedModalForm
            options={{
              failedStageId,
              task,
            }}
          >
            <span className="px-[12px] leading-[32px]">Đánh dấu thất bại</span>
          </MarkTaskFailedModalForm>
        ),
      },
      ...(String(role).toLocaleLowerCase().includes('quản trị')
        ? [
            {
              key: '5',
              label: (
                <div
                  className="px-[12px] leading-[32px]"
                  onClick={() => {
                    modal.confirm({
                      title: 'Xác nhận gỡ người thực thi của nhiệm vụ này?',
                      open: removeConfirmOpen,
                      width: 600,
                      onCancel: () => setRemoveConfirmOpen(false),
                      onOk: () => handleRemoveExecutor(task?.id),
                    })
                  }}
                >
                  Gỡ người thực thi
                </div>
              ),
            },
            {
              key: '6',
              label: (
                <div
                  className="px-[12px] leading-[32px] text-[#cc1111]"
                  onClick={() => {
                    modal.confirm({
                      title: `Xác nhận xoá nhiệm vụ ${task?.name.toUpperCase()}?`,
                      content: 'Nhiệm vụ sẽ bị xóa và không thể khôi phục.',
                      width: 600,
                      onOk: () => onDelete?.(),
                    })
                  }}
                >
                  Xóa nhiệm vụ
                </div>
              ),
            },
          ]
        : []),
    ]

    return (
      <div
        className="relative"
        style={{
          ...externalStyle,
          ...style,
        }}
        ref={setNodeRef}
        {...attributes}
      >
        <div
          className={clsx(
            '-z-10 border-b border-[#eee] px-[16px] py-[12px] text-[12px] leading-none transition-all!',
            isCompleted
              ? isNotAchieved
                ? 'bg-yellow-400 text-[#fff]!'
                : 'bg-[#2bbf3d] text-[#fff]!'
              : isFailed
                ? 'bg-[#c34343] text-[#fff]!'
                : 'bg-[#fff] hover:bg-[#f8f8f8]',
            className,
          )}
          {...listeners}
        >
          <Link
            className={clsx(
              'pointer-events-auto! space-y-[8px]',
              isCompleted || isFailed
                ? 'hover:text-[#fff]'
                : 'hover:text-[#000]',
            )}
            key={task?.id}
            href={`/task/${task?.id}`}
            prefetch={false}
          >
            <div
              className={clsx(
                'line-clamp-2 flex items-center justify-between pr-[24px] text-[14px] leading-[18px] font-[600] !text-[#000000D9]',
                isCompleted || isFailed ? 'text-[#fff]!' : 'text-[#000000D9]!',
              )}
              title={task?.name}
            >
              {task?.name}
            </div>
            <div className="flex items-center">
              {task?.tags?.map((s: any) => (
                <Tooltip key={s?.id} title={s?.title}>
                  <Tag
                    className="w-max max-w-[100px]"
                    style={{ marginInlineEnd: 4 }}
                    color={s?.code_color || '#888'}
                  >
                    <span className="line-clamp-1">{s?.title}</span>
                  </Tag>
                </Tooltip>
              ))}
            </div>
            <div
              className="line-clamp-2 leading-[17px] !text-[#000000D9]"
              dangerouslySetInnerHTML={{
                __html: task?.description || 'Không có mô tả',
              }}
            />
            {!isCompleted && !isFailed ? (
              <div>
                {user || task?.started_at ? (
                  <div className="flex min-h-[28px] items-center justify-between gap-[8px]">
                    <div className="flex items-center gap-[4px]">
                      <Avatar
                        src={user?.avatar}
                        style={{
                          backgroundColor: randomColor(String(user?.full_name)),
                        }}
                        shape="circle"
                        size="small"
                        alt={user?.full_name}
                      >
                        {String(user?.full_name)?.charAt(0).toUpperCase()}
                      </Avatar>
                      <span className="text-[#000000D9]">
                        {user?.full_name}
                      </span>
                    </div>
                    {task?.started_at &&
                      (task?.expired ? (
                        <div
                          className={clsx({
                            'text-[#42b814]': timeStatus === 'inprogress',
                            'text-[#D96C6C]': timeStatus === 'overdue',
                          })}
                        >
                          {timeStatus === 'inprogress'
                            ? 'Đến hạn trong'
                            : 'Quá hạn'}{' '}
                          {convertTime(time.asSeconds())}
                        </div>
                      ) : (
                        <div className="text-[#999]">Không thời hạn</div>
                      ))}
                  </div>
                ) : (
                  <span className="flex items-center gap-[4px] leading-[28px] text-[#D96C6C]">
                    <ExclamationCircleFilled className="text-[16px]" />
                    Chưa được giao
                  </span>
                )}
              </div>
            ) : (
              isCompleted && (
                <TaskItemStatistics
                  view={abbreviateNumber(task?.view_count)}
                  like={abbreviateNumber(task?.like_count)}
                  comment={abbreviateNumber(task?.comment_count)}
                  date={convertRelativeTime(task?.date_posted)}
                />
              )
            )}
          </Link>
        </div>

        {!isCompleted && !isFailed && (
          <>
            {user
              ? !task?.started_at && (
                  <Button
                    className="!absolute right-[16px] bottom-[12px] p-[10px]! text-[12px]! text-[#fff]"
                    size="small"
                    type="primary"
                    onClick={() => {
                      modal.confirm({
                        title: 'Bạn muốn nhận công việc này?',
                        onOk: () => handleAssign(userId || 0),
                      })
                    }}
                  >
                    Bắt đầu
                  </Button>
                )
              : !task?.expired && (
                  <Button
                    className="!absolute right-[16px] bottom-[12px] p-[10px]! text-[12px]! text-[#fff]"
                    size="small"
                    type="primary"
                    onClick={() => {
                      modal.confirm({
                        title: 'Bạn muốn nhận công việc này?',
                        onOk: () => handleAssignWithoutWork(userId || 0),
                      })
                    }}
                  >
                    Nhận
                  </Button>
                )}
          </>
        )}

        <div className="absolute top-[12px] right-[16px] flex items-center">
          <Dropdown
            trigger={['click']}
            rootClassName={clsx('z-auto!', styles.menu)}
            placement="bottomRight"
            menu={{
              items: taskDropdownItems,
              style: { width: 200 },
            }}
          >
            <EllipsisOutlined
              className={clsx('p-[2px] text-[16px] leading-[20px]', {
                'text-[#fff]!': isCompleted || isFailed,
              })}
            />
          </Dropdown>
        </div>

        <Modal
          open={assignConfirmOpen}
          onCancel={() => setAssignConfirmOpen(false)}
          title="LỰA CHỌN NGƯỜI PHỤ TRÁCH NHIỆM VỤ NÀY"
          footer={<></>}
          width={500}
        >
          <div className="-mx-[24px] text-[#b1b1b1]">
            <div className="px-[20px]">
              <Input.Search placeholder="Tìm nhanh" />
            </div>
            <div className="divide-y divide-[#0000001a]">
              {members && (
                <MemberList
                  members={members}
                  onItemCLick={(userId) => handleAssignWithoutWork(userId)}
                />
              )}
            </div>
          </div>
        </Modal>

        <TaskReportsModalForm
          reports={reports}
          open={taskReportOpen}
          onCancel={() => setTaskReportOpen(false)}
          onSubmit={(values) => handleSubmit(values)}
        />

        <TaskDoneModalForm
          open={doneOpen}
          onCancel={() => setDoneOpen(false)}
          taskId={Number(task?.id)}
          onSubmit={() => handleStageClick(currentStage)}
          onOk={() => setDoneOpen(false)}
          initialValues={{
            link_youtube: task?.link_youtube,
          }}
        />
      </div>
    )
  },
)

TaskItem.displayName = 'Task item'

export default TaskItem
