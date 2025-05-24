'use client'

import { useDraggable } from '@dnd-kit/core'
import React, { useCallback } from 'react'
import TaskItemPresentation from './TaskItemPresentation'

export type TaskItemProps = {
  className?: string
  task?: any
  isCompleted?: boolean
  isFailed?: boolean
  members?: any
  expired?: number
  onDelete?: (id?: any) => Promise<void>
  userId?: number
  options?: any
  style?: React.CSSProperties
  grabbing?: boolean
  onDroppable?: boolean
}

const TaskItemDraggable: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  ...rest
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task?.id,
    data: task,
  })

  const handleDelete = useCallback(
    (taskId?: any) => {
      onDelete?.(taskId)
    },
    [onDelete],
  )

  return (
    <TaskItemPresentation
      setNodeRef={setNodeRef}
      task={task}
      attributes={attributes}
      listeners={listeners}
      onDelete={handleDelete}
      isDragging={isDragging}
      {...rest}
    />
  )
}

export default TaskItemDraggable
