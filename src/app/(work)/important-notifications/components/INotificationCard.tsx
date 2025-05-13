import { Card } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

type INotificationCardProps = {
  id?: number
  title?: string
  message?: string
  thumbnail?: string
}

const INotificationCard: React.FC<INotificationCardProps> = ({
  id,
  title,
  message,
  thumbnail,
}) => {
  const router = useRouter()
  return (
    <Card
      hoverable
      className="flex h-full w-full flex-col"
      // bodyStyle={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      cover={
        <div className="aspect-[252/120] w-full overflow-hidden">
          <img
            alt="notification banner"
            src={thumbnail || 'https://picsum.photos/400/300'}
            className="h-full w-full object-cover"
          />
        </div>
      }
      onClick={() => {
        router.push(`/important-notifications/${id}`)
      }}
    >
      <div className="flex flex-grow flex-col">
        <p className="line-clamp-1 !text-[16px] !font-[600]">{title}</p>
        <p
          className="mt-2 line-clamp-2 !text-[14px] !font-[400] !text-[#00000073]"
          dangerouslySetInnerHTML={{ __html: message || '' }}
        />
      </div>
    </Card>
  )
}

export default INotificationCard
