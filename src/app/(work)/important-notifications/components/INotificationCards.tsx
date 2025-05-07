'use client'

import { Pagination } from 'antd'
import { cardData } from '../data'
import INotificationCard from './INotificationCard'

const INotificationCards: React.FC = () => {
  return (
    <>
      <div className="flex flex-wrap gap-4">
        {cardData.map((card, index) => (
          <INotificationCard
            id={index}
            title={card.title}
            image={card.image}
            description={card.description}
          />
        ))}
      </div>

      <Pagination
        total={85}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
        className="!mt-[16px]"
      />
    </>
  )
}

export default INotificationCards
