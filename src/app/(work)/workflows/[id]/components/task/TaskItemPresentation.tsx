import TaskDoneModalForm from '@/app/(work)/workflows/[id]/components/stage/TaskDoneModalForm'
import MarkTaskFailedModalForm from '@/components/MarkTaskModalForm'
import {
  abbreviateNumber,
  convertRelativeTime,
  convertTime,
  randomColor,
} from '@/libs/utils'
import { Avatar } from '@/ui'
import { EllipsisOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { App, Button, Dropdown, Input, MenuProps, Modal, Tag } from 'antd'
import { createStyles } from 'antd-style'
import clsx from 'clsx'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { cloneDeep } from 'lodash'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  assignTaskWithoutWorkAction,
  editTaskAction,
  moveStageAction,
} from '../../../action'
import { StageContext } from '../stage'
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
  onDelete?: (id?: any) => void
  userId?: number
  options?: any
  style?: React.CSSProperties
  grabbing?: boolean
  onDroppable?: boolean
  listeners?: SyntheticListenerMap
  attributes: DraggableAttributes
  setNodeRef: (element: HTMLElement | null) => void
  isDragging?: boolean
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

const TaskItemPresentation: React.FC<TaskItemProps> = memo(
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
    grabbing,
    listeners,
    attributes,
    setNodeRef,
    isDragging,
  }) => {
    const [assignConfirmOpen, setAssignConfirmOpen] = useState(false)
    const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)
    const [doneOpen, setDoneOpen] = useState(false)
    const [taskModalFormOpen, setTaskmodalFormOpen] = useState(false)
    const [ddOpen, setDdOpen] = useState(false)
    const [markTaskFailedOpen, setMarkTaskFailedOpen] = useState(false)
    const [currentStage, setCurrentStage] = useState<any>()
    const router = useRouter()

    const { failedStageId } = useContext(StageContext)
    const { setStages } = useContext(WorkflowStageContext)
    const params = useParams()
    const { message, modal } = App.useApp()
    const { styles } = useStyle()

    const now = new Date()
    const daysFromNow = Math.abs(dayjs(task?.date_posted).diff(now, 'day'))
    const { stages, role } = options

    const isNotAchieved = task?.view_count < 1000 && daysFromNow > 7

    const user = members?.find((u: any) => u?.id === task?.account_id)

    const handleRemoveExecutor = useCallback(
      async (id: number) => {
        if (!String(options?.role).toLowerCase().includes('quản lý')) {
          if (userId !== task?.account_id) {
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
      },
      [
        options?.role,
        setStages,
        task?.account_id,
        task?.id,
        task?.stage_id,
        userId,
      ],
    )

    dayjs.extend(duration)

    const t = new Date(task?.expired).getTime() - new Date().getTime()
    const timeStatus = t >= 0 ? 'inprogress' : 'overdue'
    const time = dayjs.duration(Math.abs(t))

    const handleStageClick = useCallback(
      async (stage: any) => {
        const stageId = +String(stage?.id).split('_')[1]

        if (task?.stage_id === stageId) return

        if (!task?.account_id && [1].includes(stage?.index)) {
          message.error('Nhiệm vụ chưa được giao.')
          return
        }

        if (!String(role).toLocaleLowerCase().includes('quản lý')) {
          if (task?.account_id !== userId) {
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
          message.error('Có lỗi xảy ra khi di chuyển task')
          throw new Error(error)
        }
      },
      [message, role, router, setStages, task, userId],
    )

    const handleAssign = useCallback(
      async (id: number) => {
        const memberIds = members?.map((member: any) => member?.id)
        if (!memberIds?.includes(id)) {
          message.error('Người dùng không phải thành viên trong quy trình này.')
          return
        }

        try {
          const { message: msg, errors } = await editTaskAction(task?.id, {
            account_id: id,
            started_at: new Date(),
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
                        // expired: stage.expired_after_hours
                        //   ? new Date().setHours(
                        //       new Date().getHours() + stage.expired_after_hours,
                        //     )
                        //   : null,
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

          message.success('Bắt đầu công việc thành công.')
          router.refresh()
          setAssignConfirmOpen(false)
        } catch (error: any) {
          throw new Error(error)
        }
      },
      [members, message, router, setStages, task?.id, task?.stage_id],
    )

    const handleAssignWithoutWork = useCallback(
      async (id: number) => {
        const memberIds = members?.map((member: any) => member?.id)
        if (!memberIds?.includes(id)) {
          message.error('Người dùng không phải thành viên trong quy trình này.')
          return
        }

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
      },
      [members, message, setStages, task?.id, task?.stage_id],
    )

    const handleMoveStageClick = useCallback(
      async (stage: any) => {
        const activeStage = stages?.find(
          (s: any) => s?.id === `stage_${task?.stage_id}`,
        )
        const overStage = stages?.find((s: any) => s?.id === stage?.id)

        setCurrentStage(stage)

        if (overStage?.index === 1) {
          setDoneOpen(true)
          return
        }

        handleStageClick(stage)
      },
      [handleStageClick, stages, task?.stage_id],
    )

    const taskDropdownItems = useMemo<MenuProps['items']>(() => {
      return [
        {
          key: '2',
          label: 'Chuyển giai đoạn',
          children: stages
            ?.filter((stage: any) => {
              const currentStageIndex = stages?.findIndex(
                (s: any) => s?.id === `stage_${task?.stage_id}`,
              )
              const stageIndex = stages?.findIndex(
                (s: any) => s?.id === stage?.id,
              )

              // Show first stage, previous stage, and next stage
              return (
                (stageIndex === 0 ||
                  stageIndex === currentStageIndex - 1 ||
                  stageIndex === currentStageIndex + 1) &&
                stageIndex !== currentStageIndex
              )
            })
            .map((stage: any, index: number) => ({
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
                  {stage?.id === stages?.[0]?.id
                    ? 'Giai đoạn đầu tiên'
                    : stage?.name}
                </div>
              ),
            })),
        },
        ...(String(role).toLocaleLowerCase().includes('quản lý')
          ? [
              {
                key: '3',
                label: (
                  <span
                    className="cursor-pointer px-[12px] leading-[32px]"
                    onClick={() => {
                      setTaskmodalFormOpen(true)
                    }}
                  >
                    Chỉnh sửa nhiệm vụ
                  </span>
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
            <span
              className="cursor-pointer px-[12px] leading-[32px]"
              onClick={() => {
                setTaskmodalFormOpen(true)
              }}
            >
              Đánh dấu thất bại
            </span>
          ),
        },
        ...(String(role).toLocaleLowerCase().includes('quản lý')
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
                        onOk: () => onDelete?.(task?.id),
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
    }, [
      handleMoveStageClick,
      handleRemoveExecutor,
      modal,
      onDelete,
      removeConfirmOpen,
      role,
      stages,
      task?.id,
      task?.name,
      task?.stage_id,
    ])

    const renderTooltipOrTag = useCallback(
      (type: 'title' | 'name', data?: any) => {
        const value = data?.[`${type}`]
        const renderTag = (
          <Tag
            key={data?.id}
            className="w-max max-w-[100px]"
            style={{ marginInlineEnd: 4 }}
            color={data?.code_color || '#888'}
          >
            <span className="line-clamp-1">{value}</span>
          </Tag>
        )
        if (data.title) {
          return (
            <div key={data?.id} title={value}>
              {renderTag}
            </div>
          )
        }
        return renderTag
      },
      [],
    )

    const renderTagNameOrSticker = useMemo(() => {
      return (
        <div className="flex items-center">
          {task?.sticker
            ? task?.sticker?.map((s: any) => renderTooltipOrTag('name', s))
            : task?.tags?.map((s: any) => renderTooltipOrTag('title', s))}
        </div>
      )
    }, [renderTooltipOrTag, task?.sticker, task?.tags])

    const style: React.CSSProperties = {
      opacity: isDragging ? 0 : 1,
    }

    return (
      <div
        ref={setNodeRef}
        className={clsx(
          'relative',
          grabbing ? 'cursor-grabbing' : 'cursor-grab',
        )}
        style={{
          ...style,
          ...externalStyle,
        }}
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
              'space-y-[8px]',
              isCompleted || isFailed
                ? 'hover:text-[#fff]'
                : 'hover:text-[#000]',
              grabbing ? '!cursor-grabbing' : '!cursor-grab',
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
            {renderTagNameOrSticker}
            <div
              className="line-clamp-2 leading-[17px] !text-[#000000D9]"
              dangerouslySetInnerHTML={{
                __html: task ? task?.description : 'Không có mô tả',
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
              isCompleted &&
              task?.link_youtube !== null && (
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
            {user ? (
              !task?.started_at && (
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
            ) : (
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
        <>
          <div className="absolute top-[12px] right-[16px] flex items-center">
            {!ddOpen ? (
              <EllipsisOutlined
                className={clsx(
                  'p-[2px] text-[16px] leading-[20px]',
                  {
                    'text-[#fff]!': isCompleted || isFailed,
                  },
                  styles.menu,
                )}
                onClick={() => {
                  setDdOpen(true)
                }}
              />
            ) : (
              <Dropdown
                trigger={['click']}
                rootClassName={clsx('z-auto!', styles.menu)}
                placement="bottomRight"
                menu={{
                  items: taskDropdownItems,
                  style: { width: 200 },
                }}
                open={ddOpen}
                onOpenChange={setDdOpen}
              >
                <EllipsisOutlined
                  className={clsx('p-[2px] text-[16px] leading-[20px]', {
                    'text-[#fff]!': isCompleted || isFailed,
                  })}
                />
              </Dropdown>
            )}
          </div>
          {taskModalFormOpen && (
            <TaskModalForm
              title="CHỈNH SỬA NHIỆM VỤ"
              initialValues={{
                ...task,
                members,
                userId,
              }}
              open={taskModalFormOpen}
              onCancel={() => setTaskmodalFormOpen(false)}
              action="edit"
            />
          )}
          {markTaskFailedOpen && (
            <MarkTaskFailedModalForm
              options={{
                failedStageId,
                task,
              }}
              open={markTaskFailedOpen}
              onCancel={() => setMarkTaskFailedOpen(false)}
            />
          )}
          {assignConfirmOpen && (
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
          )}

          {doneOpen && (
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
          )}
        </>
      </div>
    )
  },
)

TaskItemPresentation.displayName = 'Task item'

export default TaskItemPresentation
