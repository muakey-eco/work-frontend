import React from 'react'

type JobProgressGuideItem = {
  label: React.ReactNode
  value: React.ReactNode
}

export type JobProgressGuideProps = {
  items?: JobProgressGuideItem[]
}

const JobProgressGuide: React.FC<JobProgressGuideProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-[16px]">
      {items?.map((item) => (
        <div key={String(item.label)} className="flex flex-col gap-[8px]">
          <div className="text-[14px] leading-[22px] text-[#00000073]">
            {item.label}
          </div>
          <div className="text-[14px] leading-[22px] font-[500]">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export default JobProgressGuide
