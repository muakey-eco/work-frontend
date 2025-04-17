'use client'

import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable'
import { ConfigProvider, List, ListProps } from 'antd'
import { cloneDeep } from 'lodash'
import React, { useCallback, useContext } from 'react'
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
}

const TaskList: React.FC<TaskListProps> = ({
  stageId,
  userId,
  options,
  tasks,
  ...rest
}) => {
  const { members } = useContext(StageContext)
  const { stages, setStages } = useContext(WorkflowContext)

  const currentStage = stages?.find((s: any) => s?.id === stageId)

  const sortItems = tasks ? tasks.map((t: any) => t.id) : []

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        const { error, success } = await deleteTaskAction(id || 0)

        if (error) {
          toast.error(error)

          return
        }

        setStages((prevStages: any[]) => {
          const newStages = cloneDeep(prevStages)

          return newStages?.map((s: any) => {
            if (String(s?.id).includes(String(stageId))) {
              return {
                ...s,
                tasks: s?.tasks?.filter((task: any) => task?.id !== id),
              }
            }

            return s
          })
        })
        toast.success(success)
      } catch (error: any) {
        throw new Error(error)
      }
    },
    [setStages, stageId],
  )

  return (
    <SortableContext items={sortItems} strategy={horizontalListSortingStrategy}>
      <ConfigProvider
        theme={{
          components: {
            List: {
              emptyTextPadding: 0,
            },
          },
        }}
      >
        <List
          dataSource={tasks}
          renderItem={(task: any) => (
            <>
              <TaskItem
                task={task}
                isCompleted={currentStage?.index === 1}
                isFailed={currentStage?.index === 0}
                members={members}
                expired={currentStage?.expired_after_hours}
                onDelete={() => handleDelete(task?.id)}
                userId={userId}
                options={options}
              />
            </>
          )}
          locale={{
            emptyText: <></>,
          }}
          {...rest}
        />
      </ConfigProvider>
    </SortableContext>
  )
}

export default TaskList
