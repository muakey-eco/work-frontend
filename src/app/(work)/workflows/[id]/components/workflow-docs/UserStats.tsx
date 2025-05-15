'use client'

import { Avatar, Card, Divider, Progress } from 'antd'

type UserStatsProps = {
  title?: string
  description?: string
  data?: {
    name: string
    avatar: string
    totalTasks: number
    completedTasks: number
    overDueTasks?: number
  }[]
  progress?: boolean
}

const data: UserStatsProps['data'] = [
  {
    name: 'John Doe1',
    avatar: 'https://picsum.photos/400/300',
    totalTasks: 10,
    completedTasks: 5,
  },
  {
    name: 'John Doe2',
    avatar: 'https://picsum.photos/400/300',
    totalTasks: 10,
    completedTasks: 5,
  },
  {
    name: 'John Doe3',
    avatar: 'https://picsum.photos/400/300',
    totalTasks: 10,
    completedTasks: 5,
    overDueTasks: 2,
  },
]

const UserStats = ({ title, description, progress }: UserStatsProps) => {
  return (
    <Card className="w-full">
      <div className="flex flex-col gap-[12px]">
        <p className="!pb-4 text-[16px] font-[500]">{title}</p>
        {data.map((item, index) => (
          <>
            <div
              key={item.name}
              className="flex items-center justify-between gap-[12px]"
            >
              <div className="flex w-full items-center gap-[12px]">
                <Avatar src={item.avatar} size={32} className="flex-shrink-0" />
                <div className="flex w-full flex-col gap-[4px]">
                  <span className="text-[12px] font-[600]">{item.name}</span>
                  <span className="text-[12px] font-[400] text-gray-500">
                    {item.overDueTasks ? (
                      <>
                        <span className="text-[12px] font-[400] text-gray-500">
                          {`${item.overDueTasks} lần quá hạn`}
                        </span>{' '}
                        •{' '}
                      </>
                    ) : (
                      ''
                    )}
                    {`${item.completedTasks}/${item.totalTasks} ${description}`}
                  </span>
                </div>

                {progress && (
                  <div className="ml-auto">
                    {' '}
                    <Progress
                      success={{
                        percent: (item.completedTasks / item.totalTasks) * 100,
                      }}
                      percent={(item.completedTasks / item.totalTasks) * 100}
                      type="circle"
                      width={42}
                      strokeWidth={8}
                    />
                  </div>
                )}
              </div>
            </div>
            {index < data.length - 1 && <Divider className="!m-0" />}
          </>
        ))}
      </div>
    </Card>
  )
}

export default UserStats
