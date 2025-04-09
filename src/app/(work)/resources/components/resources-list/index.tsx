import { ResourceModalForm } from '@/components'
import { convertTime, randomColor } from '@/libs/utils'
import {
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { Avatar, Col, Empty, Row } from 'antd'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import React from 'react'
import ResourcesCard from '../resources-card'
import ResourcesDetailModal, {
  ResourcesDetailModalProps,
} from '../resources-detail-modal'

export type ResourcesListProps = {
  resources?: any
}

dayjs.extend(duration)

const ResourcesList: React.FC<ResourcesListProps> = ({ resources }) => {
  if (!resources || resources?.length <= 0) {
    return <Empty description="Chưa có tài liệu" />
  }

  return (
    <Row gutter={[16, 16]}>
      {resources?.map((item: any) => {
        const t = new Date(item?.expired_date).getTime() - new Date().getTime()
        const time = dayjs.duration(Math.abs(t))

        const body =
          item.type === 'text'
            ? {
                text: {
                  content: item.text_content,
                },
              }
            : {
                account: {
                  name: item.account,
                  password: item.password,
                  note: item.note,
                },
              }

        const resourcesAsContent: ResourcesDetailModalProps['resources'] = [
          ...(item.type === 'text'
            ? [
                {
                  label: 'Nội dung',
                  value: (
                    <span
                      className="line-clamp-5"
                      dangerouslySetInnerHTML={{ __html: item?.text_content }}
                    />
                  ),
                },
              ]
            : [
                {
                  label: 'Tài khoản',
                  value: item.account,
                  copyable: true,
                },
                {
                  label: 'Mật khẩu',
                  value: item.password,
                  copyable: true,
                },
                {
                  label: 'Ghi chú',
                  value: (
                    <span
                      className="line-clamp-5 inline-block flex-1"
                      dangerouslySetInnerHTML={{ __html: item?.note }}
                    />
                  ),
                },
              ]),
          ...(item?.expired_date
            ? [
                {
                  label: 'Thời gian hết hạn',
                  value: (
                    <div className="flex items-center gap-[8px] text-[#F5222D]">
                      <ClockCircleOutlined />
                      <span>Còn {convertTime(time.asSeconds())}</span>
                    </div>
                  ),
                },
              ]
            : []),
        ]

        return (
          <Col key={item?.id} span={6}>
            <ResourcesCard
              title={
                <div className="flex items-center gap-[8px]">
                  <Avatar
                    src={item.thumbnail}
                    shape="square"
                    style={{
                      backgroundColor: randomColor(String(item?.name || '')),
                    }}
                    alt={String(item?.name || '')}
                    size={32}
                  >
                    {item?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div className="line-clamp-1 flex-1 text-[16px] leading-[24px] font-[500]">
                    {item?.name}
                  </div>
                </div>
              }
              extra={
                <div className="flex items-center gap-[12px]">
                  <ResourcesDetailModal
                    resources={resourcesAsContent}
                    title={
                      <div className="flex items-center gap-[8px]">
                        <Avatar
                          src={item?.thumbnail}
                          shape="square"
                          style={{
                            backgroundColor: randomColor(
                              String(item?.name || ''),
                            ),
                          }}
                        >
                          {item?.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <span className="text-[16px] leading-[24px] font-[700]">
                          {item.name}
                        </span>
                      </div>
                    }
                    initialValues={item}
                  >
                    <EyeOutlined className="text-[#1677ff]" />
                  </ResourcesDetailModal>
                  <ResourceModalForm initialValues={item} mode="edit">
                    <EditOutlined />
                  </ResourceModalForm>
                </div>
              }
              body={body}
              footer={
                item?.expired_date && (
                  <div className="flex items-center gap-[8px] px-[24px] text-[#F5222D]">
                    <ClockCircleOutlined />
                    {t > 0 ? (
                      <span>Còn {convertTime(time.asSeconds())}</span>
                    ) : (
                      <span>Đã hết hạn</span>
                    )}
                  </div>
                )
              }
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default ResourcesList
