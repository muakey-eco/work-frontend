'use client'

import { Skeleton } from 'antd'

const Loading = () => {
  return (
    <>
      <div className="col-span-3 rounded-lg bg-[#fff] p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-4">
            <Skeleton.Avatar active size={64} />
            <div className="flex flex-col gap-2">
              <Skeleton.Input active size="small" style={{ width: 200 }} />
              <div className="flex items-center gap-2">
                <Skeleton.Input active size="small" style={{ width: 150 }} />
                <Skeleton.Input active size="small" style={{ width: 100 }} />
              </div>
            </div>
          </div>
          <Skeleton.Button active />
        </div>

        {/* Descriptions Skeleton */}
        <div className="mt-4">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(13)].map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton.Input active size="small" style={{ width: 120 }} />
                <Skeleton.Input active size="small" style={{ width: 180 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Skeleton */}
      <div className="col-span-1 h-fit rounded-lg bg-[#fff] p-4">
        <Skeleton.Input
          active
          size="small"
          style={{ width: 200, marginBottom: 16 }}
        />
        <div className="mt-6 flex flex-col gap-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-start gap-4">
              <Skeleton.Avatar active size="small" />
              <div className="flex-1">
                <Skeleton.Input active size="small" style={{ width: '80%' }} />
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: '60%', marginTop: 8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Loading
