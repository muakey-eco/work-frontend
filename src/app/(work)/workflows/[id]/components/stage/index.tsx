'use client'

import { getTaskHistoriesAction } from '@/components/action'
import TimeConfirmationModal from '@/components/TimeConfirmationModal'
import { useAsyncEffect } from '@/libs/hook'
import { toast } from '@/ui'
import Portal from '@/ui/portal'
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { App, DatePickerProps, Row } from 'antd'
import dayjs from 'dayjs'
import { cloneDeep, pick } from 'lodash'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { addTaskReportAction, moveStageAction } from '../../../action'
import TaskItemDraggable from '../task/TaskItemDraggable'
import { StageContext as WorkflowStageContext } from '../WorkflowPageLayout'

import StageColumnListSkeleton from './StageColumnListSkeleton'
const PORTAL_HOLDER_ID = 'portals'

const TaskDoneModalForm = dynamic(
  () =>
    import('@/app/(work)/workflows/[id]/components/stage/TaskDoneModalForm'),
  {
    ssr: false,
  },
)

const StageColumnList = dynamic(() => import('./StageColumnList'), {
  ssr: false,
  loading: () => <StageColumnListSkeleton />,
})

export type StageListProps = {
  members?: any
  stages?: any
  options?: any
}

export const StageContext = createContext<any>({})

const StageList: React.FC<StageListProps> = ({ members, stages, options }) => {
  const { modal } = App.useApp()
  const [activeId, setActiveId] = useState<UniqueIdentifier>()
  const [currentStage, setCurrentStage] = useState<any>()
  const [activeItem, setActiveItem] = useState<any>()
  // const [open, setOpen] = useState(false)
  const [doneOpen, setDoneOpen] = useState(false)
  const [reports, setReports] = useState<any[]>([])
  const [dragEvent, setDragEvent] = useState<DragEndEvent>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStartedAt, setNewStartedAt] = useState<any>()
  const [currentTimeDifference, setCurrentTimeDifference] = useState<number>(0)
  const [currentStartedAt, setCurrentStartedAt] = useState<dayjs.Dayjs>()
  const [stagesMinimal, setStagesMinimal] = useState<any>([])

  const onOk = (value: DatePickerProps['value']) => {}

  const activeRef = useRef<any>(null)

  const { message } = App.useApp()
  const { user, requiredLink } = options

  const { setStages } = useContext(WorkflowStageContext)
  const params = useParams()

  const getMinimalStages = useCallback((stages: any) => {
    const result = stages.map((st: any) => {
      const tasks = st.tasks?.map((ta: any) =>
        pick(ta, [
          'date_posted',
          'view_count',
          'id',
          'name',
          'account_id',
          'stage_id',
          'expired',
          'sticker',
          'tags',
          'started_at',
          'like_count',
          'comment_count',
          'link_youtube',
          'description',
        ]),
      )
      return { ...st, tasks }
    })
    setStagesMinimal(result)
  }, [])

  useEffect(() => {
    getMinimalStages(stages)
  }, [getMinimalStages, stages])

  const failedStageId = useMemo(
    () =>
      Number(
        stagesMinimal?.length > 0
          ? stagesMinimal
              ?.find((stage: any) => stage.index === 0)
              ?.['id'].split('_')
              .pop()
          : 0,
      ),
    [stagesMinimal],
  )

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  const moveTaskToNextStage = useCallback(
    async (activeTaskId: number, stageId: number, activeData: any) => {
      try {
        // Move the task to the new stage
        const { message: msg, errors } = await moveStageAction(
          activeTaskId as number,
          stageId,
        )

        if (errors) {
          message.error(msg)
          return
        }

        // Retrieve task history
        const taskHistory = await getTaskHistoriesAction({
          task_id: activeData.id,
          stage_id: stageId,
        })

        // Update the stages
        setStages((prevStages: any) => {
          const newStages = cloneDeep(prevStages)

          // Find active and over columns
          const activeColumn = newStages.find(
            (s: any) => s.id === `stage_${activeData.stage_id}`,
          )
          const overColumn = newStages.find(
            (s: any) => s.id === `stage_${stageId}`,
          )

          // Remove the task from the current stage
          if (activeColumn) {
            activeColumn.tasks = activeColumn.tasks.filter(
              (t: any) => t.id !== activeTaskId,
            )
          }

          // Add the task to the new stage
          if (overColumn) {
            overColumn.tasks = [
              {
                ...activeData,
                stage_id: stageId,
                account_id: taskHistory?.worker || null,
                expired: taskHistory?.worker
                  ? taskHistory?.expired_at
                    ? taskHistory?.expired_at
                    : overColumn.expired_after_hours
                      ? new Date().setHours(
                          new Date().getHours() +
                            overColumn.expired_after_hours,
                        )
                      : null
                  : null,
                started_at: taskHistory?.started_at || null,
              },
              ...overColumn.tasks,
            ]
          }

          return newStages
        })
      } catch (error: any) {
        message.error('Có lỗi xảy ra khi di chuyển task')
        throw new Error(error)
      }
    },
    [message, setStages],
  )

  const isAdjacentStage = useCallback(
    (currentStageId: number, targetStageId: number) => {
      const currentStageIndex = stagesMinimal.findIndex(
        (s: any) => s.id === `stage_${currentStageId}`,
      )
      const targetStageIndex = stagesMinimal.findIndex(
        (s: any) => s.id === `stage_${targetStageId}`,
      )
      // Cho phép kéo tới cột thành công hoặc thất bại - Cần không nhỉ : ))
      // if (targetStageIndex === 0 || targetStageIndex === 1) return true

      // Kiểm tra xem cột có liền kề nhau không
      return Math.abs(currentStageIndex - targetStageIndex) === 1
    },
    [stagesMinimal],
  )

  const handleDrag = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (!over) return

      if (active.id !== over.id) {
        const {
          data: { current: overData },
        } = over
        const {
          id: activeTaskId,
          data: { current: activeData },
        } = active

        if (!overData || !activeData) return

        const stageId = Number(
          String(overData.stage_id || overData.id)
            .split('_')
            .pop(),
        )

        const memberIds = members?.map((member: any) => member?.id)

        if (
          !memberIds?.includes(user?.id) &&
          !user?.role?.toLocaleLowerCase()?.includes('Admin')
        ) {
          message.error(' Bạn không phải thành viên trong quy trình này.')
          return
        }

        // Nếu là quản lý viên và task chưa được giao, cho phép kéo
        if (
          (String(user?.role).toLocaleLowerCase().includes('quản lý') ||
            String(user?.role).toLocaleLowerCase().includes('Admin')) &&
          !activeData?.account_id
        ) {
          moveTaskToNextStage(Number(activeTaskId), stageId, activeData)
          return
        }

        if (
          !user?.role?.toLocaleLowerCase()?.includes('quản lý') &&
          !activeData?.started_at
        ) {
          message.error('Nhiệm vụ chưa được bắt đầu.')
          return
        }

        // Check the time difference between the current time and the task's started_at
        const startedAt = dayjs(activeData?.started_at)

        if (!startedAt.isValid()) {
          message.error('Nhiệm vụ chưa được bắt đầu.')
          return
        }
        const currentTime = dayjs()
        const timeDifference = currentTime.diff(startedAt, 'minutes') || 0 // in minutes

        // If the time difference is less than 5 minutes, show the confirmation modal
        if (timeDifference < 5) {
          setCurrentTimeDifference(timeDifference)
          setCurrentStartedAt(startedAt)
          setIsModalOpen(true)
          return
        } else {
          // If time difference is greater than or equal to 5 minutes, move the task immediately
          moveTaskToNextStage(Number(activeTaskId), stageId, activeData)
        }
      }
    },
    [members, message, moveTaskToNextStage, user?.id, user?.role],
  )

  const handleDragStart = useCallback(
    (e: DragStartEvent) => {
      const {
        active: {
          id: activeId,
          data: { current },
        },
      } = e

      const stage = stagesMinimal?.find(
        (s: any) => s.id === current?.stage_id || activeId,
      )

      setCurrentStage(stage)
      setActiveId(activeId)
      setActiveItem(current)
    },
    [stagesMinimal],
  )

  const handleDragEnd = async (e: DragEndEvent) => {
    setDragEvent(e)

    const { active, over } = e

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeData = active.data.current
    const overData = over.data.current

    if (!activeData || !overData) return

    const activeStageId = activeData.stage_id
    const overStageId = +String(overId).split('_')[1]

    // Kiểm tra xem cột có liền kề nhau không
    if (!isAdjacentStage(activeStageId, overStageId)) {
      message.error('Chỉ có thể kéo task sang cột liền kề')
      return
    }

    if (!String(user?.role).toLocaleLowerCase().includes('quản lý')) {
      if (activeData.account_id !== user?.id) {
        message.error(
          'Không thể kéo nhiệm vụ của người khác hoặc chưa được giao.',
        )
        return
      }
    } else {
      // Nếu là quản lý viên và task chưa được giao, cho phép kéo
      if (!activeData.account_id) {
        await handleDrag(e)
        return
      }
    }

    const activeIndex = stagesMinimal?.find(
      (stage: any) => stage.id === `stage_${activeData.stage_id}`,
    )?.index
    const overIndex = stagesMinimal?.find(
      (stage: any) =>
        stage.id ===
        (overData.stage_id ? `stage_${overData.stage_id}` : overData.id),
    )?.index

    if (
      (overIndex === 1 && requiredLink) ||
      (options?.isKeyWorkflow && overIndex === 1)
    ) {
      setDoneOpen(true)
      return
    }

    await handleDrag(e)
  }

  const handleSubmit = async (values: any) => {
    if (!dragEvent) return

    const { active } = dragEvent

    const {
      data: { current: activeData },
    } = active

    if (!activeData) return

    const formData = Object.fromEntries(
      Object.keys(values).map((key: string) => [key, values[key] || '']),
    )

    try {
      const { message, errors } = await addTaskReportAction(
        {
          ...formData,
        },
        {
          task_id: activeData.id,
          workflow_id: activeData.workflow_id,
        },
      )

      if (errors) {
        toast.error(message)
        return
      }

      await handleDrag(dragEvent)
      // setOpen(false)
    } catch (error) {
      throw new Error()
    }
  }

  const generateInitialValues = useCallback(() => {
    if (!dragEvent) return {}

    const { active } = dragEvent

    const {
      data: { current: activeData },
    } = active

    return {
      link_youtube: activeData?.link_youtube,
    }
  }, [dragEvent])

  useAsyncEffect(async () => {
    if (!dragEvent) return

    const { active, over } = dragEvent

    if (!over) return

    const {
      data: { current: activeData },
    } = active

    const {
      data: { current: overData },
    } = over

    if (!activeData || !overData) return

    const activeIndex = stagesMinimal?.find(
      (stage: any) => stage.id === `stage_${activeData.stage_id}`,
    )?.index

    const overIndex = stagesMinimal?.find(
      (stage: any) =>
        stage.id ===
        (overData.stage_id ? `stage_${overData.stage_id}` : overData.id),
    )?.index

    if (
      `stage_${activeData.stage_id}` ===
      (overData.stage_id ? `stage_${overData.stage_id}` : overData.id)
    )
      return
  }, [dragEvent])

  useEffect(() => {
    if (!activeId) return

    activeRef.current = activeId
  }, [activeId])

  const contextValue = useMemo(
    () => ({
      activeId,
      setActiveId,
      members,
      failedStageId,
    }),
    [activeId, members, failedStageId],
  )

  const handleOk = () => {
    setIsModalOpen(false)
    if (dragEvent && dragEvent.over?.data.current) {
      moveTaskToNextStage(
        Number(dragEvent.active.id),
        Number(
          String(
            dragEvent.over.data.current.stage_id ||
              dragEvent.over.data.current.id,
          )
            .split('_')
            .pop(),
        ),
        dragEvent.active.data.current,
      )
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <StageContext.Provider value={contextValue}>
        <Row className="h-full w-max" wrap={false}>
          <StageColumnList
            items={stagesMinimal}
            options={{
              user,
              activeItem,
            }}
          />
        </Row>

        {/* Modal xác nhận có link youtube */}

        <TaskDoneModalForm
          open={doneOpen}
          onCancel={() => setDoneOpen(false)}
          taskId={Number(activeId)}
          isKeyWorkflow={options?.isKeyWorkflow}
          workflowsForProcess={options?.workflowsForProcess}
          hasLink={requiredLink}
          onSubmit={async () => {
            if (!dragEvent) return

            await handleDrag(dragEvent)
          }}
          onOk={() => setDoneOpen(false)}
          initialValues={generateInitialValues()}
        />

        {/* Modal xác nhận thời gian thực hiện */}
        <TimeConfirmationModal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          currentTimeDifference={currentTimeDifference}
          currentStartedAt={currentStartedAt}
        />
        <Portal>
          <DragOverlay>
            {activeItem && activeItem?.id && (
              <TaskItemDraggable
                style={{
                  transform: 'rotate(5deg)',
                  transformOrigin: 'center center',
                }}
                key={activeItem?.id}
                task={activeItem}
                isCompleted={currentStage?.index === 1}
                isFailed={currentStage?.index === 0}
                members={members}
                expired={currentStage?.expired_after_hours}
                userId={user?.id}
                options={{
                  role: user?.role,
                  stages,
                }}
                className="!bg-[#fff]"
                grabbing
              />
            )}
          </DragOverlay>
        </Portal>
      </StageContext.Provider>
    </DndContext>
  )
}

export default memo(StageList)
