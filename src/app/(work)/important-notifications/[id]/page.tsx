import { PageHeader } from '@/components'
import { getImportantNotificationById } from '@/libs/data'
import { Avatar, Card, Divider } from 'antd'
import dayjs from 'dayjs'

const ImportantNotificationDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const notice = await getImportantNotificationById(Number(id))

  return (
    <div className="flex h-screen flex-col">
      <PageHeader title="Thông báo quan trọng" onBackLink={true} />
      <div className="flex-1 overflow-y-auto bg-[#F6F6F6] p-[16px]">
        <div className="mx-auto max-w-[1020px]">
          <Card className="w-full p-[24px]">
            <img
              alt="example"
              src={notice?.thumbnail}
              className="h-[300px] w-full rounded-2xl object-cover"
            />
            <p className="mt-[12px] text-[20px] font-[500]">{notice?.title}</p>

            <div className="my-[12px] flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar src={notice?.manager?.avatar || ''} />
                <p className="text-[16px] text-gray-500">
                  {notice?.manager?.full_name}
                </p>
              </div>
              <span className="text-gray-500">•</span>
              <p className="text-[16px] text-gray-500">
                {dayjs(notice?.created_at).format('HH:mm - DD/MM/YYYY')}
              </p>
            </div>

            <Divider />
            <p
              className="overflow-hidden text-[16px] break-words whitespace-pre-line text-gray-500"
              dangerouslySetInnerHTML={{ __html: notice?.message }}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ImportantNotificationDetail
