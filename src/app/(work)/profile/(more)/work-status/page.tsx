import { getMe } from '@/libs/data'
import React from 'react'
import { getPauseHistoryAction } from '../action'
import WorkLeaveHistoryCard from './components/work-leave-history-card'
import WorkPauseHistoryCard from './components/work-pause-history-card'
import WorkStatusCard from './components/work-status-card'

const WorkStatusPage: React.FC = async () => {
  const user = await getMe({
    include: 'profile',
  })

  const pauseHistory = await getPauseHistoryAction(2, 'leave')
  const quitHistory = await getPauseHistoryAction(2, 'quit')

  return (
    <div className="no-scroll h-[calc(100vh-87px)] !space-y-[16px] overflow-y-auto">
      <WorkStatusCard title="Tình trạng việc làm" user={user} />

      <WorkPauseHistoryCard
        title="Lịch sử tạm nghỉ"
        dataTable={pauseHistory}
        user={user}
      />

      <WorkLeaveHistoryCard
        title="Lịch sử nghỉ việc"
        dataTable={quitHistory}
        user={user}
      />
    </div>
  )
}

export default WorkStatusPage
