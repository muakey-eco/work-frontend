'use client'

import { Skeleton } from 'antd'

const Loading = () => {
  return (
    <div className="flex h-screen flex-col bg-[#f6f6f6]">
      {/* Header */}
      <div className="flex w-full items-start bg-[#fff] px-6 py-3">
        <div className="text-[20px] font-medium">Quản lý tài sản</div>
      </div>

      <div className="flex-1 p-4">
        <div className="rounded-lg bg-[#fff] p-6">
          {/* Table Header Skeleton */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton.Input active size="small" style={{ width: 200 }} />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton.Button active />
              <Skeleton.Button active />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 border-b border-[#f0f0f0] pb-4">
              {[...Array(12)].map((_, index) => (
                <Skeleton.Input
                  key={index}
                  active
                  size="small"
                  style={{ width: '100%' }}
                />
              ))}
            </div>

            {/* Table Rows */}
            {[...Array(5)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-12 gap-6 border-b border-[#f0f0f0] py-4"
              >
                {[...Array(12)].map((_, colIndex) => (
                  <Skeleton.Input
                    key={colIndex}
                    active
                    size="small"
                    style={{ width: '100%' }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-4 flex items-center justify-between">
            <Skeleton.Input active size="small" style={{ width: 100 }} />
            <div className="flex items-center gap-2">
              <Skeleton.Button active size="small" />
              <Skeleton.Button active size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading
