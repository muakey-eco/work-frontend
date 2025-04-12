import type { DependencyList } from 'react'
import { useCallback, useEffect, useState } from 'react'

export const useAsyncEffect = (
  effect: () => Promise<void>,
  deps?: DependencyList,
) => {
  useEffect(() => {
    effect()
  }, deps)
}

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export const useDragScroll = () => {
  const [node, setNode] = useState<HTMLDivElement | null>(null)

  const ref = useCallback((ele: HTMLDivElement) => {
    setNode(ele)
  }, [])

  // Con trỏ khi đang kéo
  const updateCursor = (ele: HTMLDivElement) => {
    ele.style.cursor = 'grabbing'
    ele.style.userSelect = 'none'
  }

  // Con trỏ khi đã thả
  const resetCursor = (ele: HTMLDivElement) => {
    ele.style.cursor = 'grab'
    ele.style.removeProperty('user-select')
  }

  const handleMouseDown = useCallback<any>(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!node) return
      if ((e.target as HTMLElement)?.closest('[data-no-drag]')) return

      e.preventDefault()
      // Lưu vị trí ban đầu
      const startPosition = {
        left: node?.scrollLeft,
        // top: node?.scrollTop,
        x: e.clientX,
        // y: e.clientY,
      }

      updateCursor(node)

      const handleMouseMove: any = (
        moveE: React.MouseEvent<HTMLDivElement>,
      ) => {
        moveE.preventDefault()

        // Tính toán khoảng cách di chuyển theo trục X - Y
        const dx = moveE.clientX - startPosition.x
        // const dy = moveE.clientY - startPosition.y

        node.scrollTo({
          left: startPosition.left - dx,
          // top: startPosition.top - dy,
        })
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        resetCursor(node)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [node],
  )

  const handleMouseUp = useCallback<any>(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
    },
    [],
  )

  useEffect(() => {
    if (!node) return

    node.addEventListener('mousedown', handleMouseDown)
    node.addEventListener('mouseup', handleMouseUp)

    return () => {
      node.removeEventListener('mousedown', handleMouseDown)
      node.removeEventListener('mouseup', handleMouseUp)
    }
  }, [node, handleMouseDown, handleMouseUp])

  return [ref]
}
