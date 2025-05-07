import { Card } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

type INotificationCardProps = {
  id?: number
  title?: string
  description?: string
  image?: string
}

const INotificationCard: React.FC<INotificationCardProps> = ({
  id,
  title,
  description,
  image,
}) => {
  const router = useRouter()
  return (
    <Card
      key={id}
      hoverable
      style={{ width: 252, height: 236 }}
      cover={
        <img
          alt="example"
          src={image}
          className="h-[120px] w-[252px] object-cover"
        />
      }
      onClick={() => {
        router.push(`/important-notifications/${id}`)
      }}
    >
      <p className="line-clamp-1 !text-[16px] font-bold">{title}</p>
      <p className="line-clamp-2 !text-[14px] text-gray-500">{description}</p>
    </Card>
  )
}

export default INotificationCard
