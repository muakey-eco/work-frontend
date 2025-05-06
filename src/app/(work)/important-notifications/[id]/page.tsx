import { PageHeader } from '@/components'
import { Avatar, Card } from 'antd'
import { cardData } from '../data'

const ImportantNotificationDetail = ({
  params,
}: {
  params: { id: string }
}) => {
  const { id } = params
  const card = cardData.find((card) => card.id === Number(id))

  return (
    <>
      <PageHeader title="Danh sách nhân sự" onBackLink={true} />
      <div className="flex h-[calc(100vh)] justify-center bg-[#F6F6F6] p-[16px]">
        <Card className="h-[856px] w-[1020px] items-center p-[24px]">
          <img
            alt="example"
            src={card?.image}
            className="h-[300px] w-full rounded-2xl object-cover"
          />
          <p className="mt-[12px] text-[20px] font-[500]">{card?.title}</p>
          {card?.title === 'Nhân sự mới' && (
            <div className="my-[12px] flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar src={card?.avatar} />
                <p className="text-[16px] text-gray-500">{card?.name}</p>
              </div>
              <span className="text-gray-500">•</span>
              <p className="text-[16px] text-gray-500">{card?.time}</p>
            </div>
          )}
          <p className="mt-3 mb-4 max-h-[400px] overflow-y-auto text-[16px] text-gray-500">
            {card?.description}
          </p>
        </Card>
      </div>
    </>
  )
}

export default ImportantNotificationDetail
