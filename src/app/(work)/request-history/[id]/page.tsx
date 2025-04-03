import { RequestConfirmModalForm } from '@/components'
import { getMe } from '@/libs/data'
import { getProposeById } from '@/libs/propose'
import { randomColor } from '@/libs/utils'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Avatar, Badge, Button, Divider } from 'antd'
import dayjs from 'dayjs'
import { uniqueId } from 'lodash'
import React from 'react'
import PageHeader from './components/PageHeader'
import RequestInfo from './components/RequestInfo'

const generateStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return (
        <div className="flex items-center gap-[8px] text-[#FAAD14]">
          <Badge dot color="#FAAD14" />
          <span>Đang chờ duyệt</span>
        </div>
      )

    case 'approved':
      return (
        <div className="flex items-center gap-[8px] text-[#389e0d]">
          <Badge dot color="#389e0d" />
          <span>Đã duyệt</span>
        </div>
      )

    case 'canceled':
      return (
        <div className="flex items-center gap-[8px] text-[#cf1322]">
          <Badge dot color="#cf1322" />
          <span>Đã hủy</span>
        </div>
      )

    case 'rejected':
      return (
        <div className="flex items-center gap-[8px] text-[#cf1322]">
          <Badge dot color="#cf1322" />
          <span>Từ chối</span>
        </div>
      )

    default:
      return <></>
  }
}

const page: React.FC<any> = async (props) => {
  const params = await props?.params
  const id = await params?.id

  const user = await getMe()
  const propose = await getProposeById(id)

  console.log('propose', propose)

  const isAdmin = user?.role === 'Quản trị cấp cao'

  const oldTime = `${propose?.old_check_in ? dayjs(propose?.old_check_in).format('DD/MM/YYYY HH:mm') : dayjs(propose?.start_time).format('DD/MM/YYYY') + ' --:--'} - ${propose?.old_check_out ? dayjs(propose?.old_check_out).format('DD/MM/YYYY HH:mm') : '--:--'}`
  const newTime = `${dayjs(propose?.start_time).format('DD/MM/YYYY HH:mm')} - ${propose?.end_time ? dayjs(propose?.end_time).format('DD/MM/YYYY HH:mm') : '--:--'}`

  const timeInfo =
    propose?.propose_category?.name !== 'Sửa giờ vào ra'
      ? [
          {
            key: uniqueId(),
            label: 'Ngày yêu cầu',
            children: (
              <div className="flex flex-wrap items-center gap-[8px]">
                {propose?.date_holidays?.map((d: any) => {
                  const start = dayjs(d?.start_date).format('DD/MM/YYYY HH:mm')
                  const end = dayjs(d?.end_date).format('DD/MM/YYYY HH:mm')

                  return `${start} - ${end}`
                })}
              </div>
            ),
          },
          {
            key: uniqueId(),
            label: 'Tổng thời gian',
            children: `${propose?.number_holiday} ngày`,
          },
        ]
      : [
          {
            key: uniqueId(),
            label: 'Giờ cũ',
            children: (
              <div className="flex items-center gap-[8px]">
                <Badge dot color="#cf1322" />
                <span>{oldTime}</span>
              </div>
            ),
          },
          {
            key: uniqueId(),
            label: 'Giờ mới',
            children: (
              <div className="flex items-center gap-[8px]">
                <Badge dot color="#389e0d" />
                <span>{newTime}</span>
              </div>
            ),
          },
        ]

  const items: any[] = [
    [
      {
        key: uniqueId(),
        label: 'Mã yêu cầu',
        children: propose?.id,
      },
      {
        key: uniqueId(),
        label: 'Loại yêu cầu',
        children: propose?.propose_category?.name,
      },
      {
        key: uniqueId(),
        label: 'Thời gian gửi yêu cầu',
        children: dayjs(propose?.created_at).format('HH:mm - DD/MM/YYYY'),
      },
      {
        key: uniqueId(),
        label: 'Trạng thái',
        children: generateStatus(propose?.status),
      },
      {
        key: uniqueId(),
        label: 'Người yêu cầu',
        children: (
          <div className="flex items-center gap-[8px]">
            <Avatar
              shape="circle"
              src={propose?.account?.avatar}
              style={{
                backgroundColor: randomColor(propose?.account?.full_name),
              }}
            >
              {String(propose?.account?.full_name).charAt(0).toUpperCase()}
            </Avatar>
            <span>{propose?.account?.full_name}</span>
          </div>
        ),
      },
    ],
    [
      {
        key: 'component',
        component: <Divider />,
      },
    ],
    // Thông tin chỉnh tài khoản
    ...(propose?.new_value
      ? [
          Object.entries(propose?.new_value || {}).map(([key, value]) => ({
            key: uniqueId(),
            label: key,
            children: String(value), // Chuyển về string để tránh lỗi nếu value không phải text
          })),
        ]
      : []),
    // Hiện thị thông tin chỉnh ngày
    ...(propose?.name === 'Sửa giờ vào ra'
      ? [
          [
            ...timeInfo,
            {
              key: uniqueId(),
              label: 'Lý do đăng ký nghỉ',
              children: propose?.description || 'Chưa có',
            },
          ],
        ]
      : []),
  ]

  return (
    <div className="h-[100vh] bg-[#f6f6f6]">
      <PageHeader title="Chi tiết yêu cầu" />

      <div className="p-[24px]">
        <div className="rounded-[16px] bg-[#fff] p-[24px]">
          <RequestInfo info={items} />

          {!['approved', 'canceled'].includes(propose?.status) && (
            <div className="mt-[24px] flex items-center gap-[12px]">
              {isAdmin ? (
                <>
                  <RequestConfirmModalForm
                    initialValues={{
                      id,
                    }}
                    status="approved"
                  >
                    <Button
                      icon={<CheckOutlined />}
                      type="primary"
                      style={{ backgroundColor: '#389E0D' }}
                    >
                      Duyệt
                    </Button>
                  </RequestConfirmModalForm>
                  <RequestConfirmModalForm
                    initialValues={{
                      id,
                    }}
                    status="canceled"
                  >
                    <Button icon={<CloseOutlined />} type="primary" danger>
                      Từ chối
                    </Button>
                  </RequestConfirmModalForm>
                </>
              ) : (
                <>
                  <Button icon={<EditOutlined />} type="primary">
                    Sửa yêu cầu
                  </Button>
                  <Button icon={<DeleteOutlined />} danger>
                    Hủy yêu cầu
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default page
