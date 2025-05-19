'use client'

import { List, ListProps } from 'antd'
import React, { memo, useCallback, useContext } from 'react'
import toast from 'react-hot-toast'
import { deleteTaskAction } from '../../../action'
import { StageContext } from '../stage'
import { StageContext as WorkflowContext } from '../WorkflowPageLayout'
import TaskItem from './TaskItem'

type TaskListProps = ListProps<any> & {
  stageId?: number
  userId?: number
  options?: any
  tasks?: any[]
  loading?: boolean
}

const TaskList: React.FC<TaskListProps> = memo(
  ({ tasks, stageId, loading, userId, options }) => {
    const { members, failedStageId } = useContext(StageContext)
    const { stages, setStages } = useContext(WorkflowContext)

    const currentStage = stages?.find((s: any) => s?.id === stageId)

    const sortItems = tasks ? tasks.map((t: any) => t.id) : []

    const handleDelete = useCallback(async (id: number) => {
      try {
        const { message, errors } = await deleteTaskAction(id)

        if (errors) {
          toast.error(message)
          return
        }

        toast.success('Đã xóa nhiệm vụ.')
      } catch (error) {
        throw new Error()
      }
    }, [])

    return (
      <List
        className="space-y-[8px]"
        dataSource={tasks}
        loading={loading}
        renderItem={(task) => (
          <div key={task?.id} className="relative">
            <TaskItem
              task={task}
              isCompleted={currentStage?.index === 1}
              isFailed={currentStage?.index === 0}
              members={members}
              expired={currentStage?.expired_after_hours}
              userId={userId}
              options={options}
              onDelete={() => handleDelete(task?.id)}
            />
          </div>
        )}
        locale={{
          emptyText: <></>,
        }}
      />
    )
  },
)

export default TaskList
