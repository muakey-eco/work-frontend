'use client'

import {
  DndContext,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

export default function Page() {
  const [itemId, setItemId] = useState<UniqueIdentifier>('item-1')

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-8">
      <DndContext
        onDragEnd={({ active, over }) => {
          const id = `${active.id}-${over?.id}`
          console.log(id)

          setItemId(id)
        }}
      >
        <div className="flex gap-8">
          <BoxB ItemId={itemId} id="box-b" />
          <BoxB ItemId={itemId} id="box-c" />
          <BoxB ItemId={itemId} id="box-d" />
        </div>
      </DndContext>
    </main>
  )
}

// ✅ Box B: chỉ có DroppableArea, item KHÔNG draggable
function BoxB({ ItemId, id }: { ItemId?: UniqueIdentifier; id: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: id })

  return (
    <div
      ref={setNodeRef}
      className={`flex h-40 w-40 items-center justify-center rounded border-4 transition-colors ${
        isOver ? 'border-green-500' : 'border-gray-300'
      }`}
    >
      {ItemId === `item-1-${id}` && <DraggableItem id={ItemId} />}
    </div>
  )
}

// ✅ Item có thể kéo (chỉ dùng ở BoxA)
function DraggableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: 'none',
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex h-32 w-32 cursor-move items-center justify-center rounded bg-blue-500 text-white"
    >
      Drag me
    </div>
  )
}
