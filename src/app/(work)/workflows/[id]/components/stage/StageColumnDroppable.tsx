import { useSortable } from '@dnd-kit/sortable'
import React, { useMemo } from 'react'
import StageColumnPresentation from './StageColumnPresentation'

type StageColumnProps = {
  stage: any
  userId?: number
  options?: any
}

const StageColumnDroppable: React.FC<StageColumnProps> = ({
  stage,
  ...rest
}) => {
  const { attributes, transform, setNodeRef, isOver } = useSortable({
    id: stage?.id,
    data: stage,
  })
  const highlightStyle = useMemo(
    () => ({
      boxShadow: isOver ? '0 0 5px #1677ff' : 'none',
    }),
    [isOver],
  )
  return (
    <div className="relative">
      <div
        style={highlightStyle}
        className="pointer-events-none fixed z-51 h-full w-[272px]"
      />
      <StageColumnPresentation
        setNodeRef={setNodeRef}
        stage={stage}
        attributes={attributes}
        transform={transform}
        {...rest}
      />
    </div>
  )
}

export default StageColumnDroppable
