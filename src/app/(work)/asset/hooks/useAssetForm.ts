'use client'

import { useMemo } from 'react'

export const useAssetForm = () => {
  const statusOptions = useMemo(
    () => [
      { label: 'Đang sử dụng', value: 'using', key: 'using' },
      { label: 'Chưa sử dụng', value: 'unused', key: 'unused' },
      { label: 'Đã thanh lý', value: 'liquidated', key: 'liquidated' },
      { label: 'Đang bảo hành', value: 'warranty', key: 'warranty' },
      { label: 'Hỏng', value: 'broken', key: 'broken' },
    ],
    [],
  )

  return {
    statusOptions,
  }
}
