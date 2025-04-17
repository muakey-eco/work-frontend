import React from 'react'

export type ScheduleHolidayCalendarGuideProps = {}

const ScheduleHolidayCalendarGuide: React.FC<
  ScheduleHolidayCalendarGuideProps
> = () => {
  const guideItems = [
    {
      title: 'Giờ kế hoạch',
      color: '#1890FF',
    },
    {
      title: 'Giờ thực tế',
      color: '#237804',
    },
    {
      title: 'Lỗi chấm công',
      color: '#F5222D',
    },
    {
      title: 'Nghỉ',
      color: '#FA8C16',
    },
    {
      title: 'OT',
      color: '#722ED1',
    },
  ]

  return (
    <div className="flex items-center gap-[24px]">
      {guideItems.map((item, index) => (
        <div className="flex items-center gap-[8px]" key={index}>
          <div
            className="h-[10px] w-[32px]"
            style={{ backgroundColor: item.color }}
          />
          <div className="text-[14px] leading-[22px]">{item.title}</div>
        </div>
      ))}
    </div>
  )
}

export default ScheduleHolidayCalendarGuide
