'use client'

import { randomColor } from '@/libs/utils'
import { DeleteOutlined } from '@ant-design/icons'
import { App, Avatar, ConfigProvider, List, ListProps } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Converter } from 'showdown'
import JobCommentCollapse from './JobCommentCollapse'
import { deleteCommentAction } from './action'

type JobCommentListProps = ListProps<any> & {}

const JobCommentList: React.FC<JobCommentListProps> = (props) => {
  const { message, modal } = App.useApp()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const convert = new Converter()

  const handleDelete = async (id: number) => {
    try {
      await deleteCommentAction(id)

      message.success('Xóa thành công.')
      setOpen(false)
      router.refresh()
    } catch (error) {
      throw new Error(String(error))
    }
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          List: {
            emptyTextPadding: 0,
          },
        },
      }}
    >
      <List
        renderItem={(item: any) => (
          <div className="group mb-[8px] rounded-[4px] border border-[#eee] bg-[#fafafa] py-[20px] pl-[16px]">
            <div className="flex items-start gap-[20px]">
              <Avatar
                src={item?.avatar}
                style={{
                  backgroundColor: randomColor(item?.full_name || ''),
                }}
                size={40}
              >
                {String(item?.full_name).charAt(0).toLocaleUpperCase()}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between pr-[8px] text-[16px] font-[500] text-[#267cde]">
                  <span>{item?.full_name}</span>
                  <DeleteOutlined
                    className="visible cursor-pointer text-[#c34343] opacity-0 transition-all group-hover:opacity-100"
                    onClick={() => {
                      setOpen(true)
                      modal.confirm({
                        title: 'Xác nhận xóa bình luận này?',
                        content: 'Xóa bình luận',
                        destroyOnClose: true,
                        open,
                        onOk: () => handleDelete(item?.id),
                        onCancel: () => setOpen(false),
                      })
                    }}
                  />
                </div>
                <div className="text-[13px] text-[#999]">
                  {dayjs(item?.created_at).format('HH:mm MMM DD, YYYY')}
                </div>

                <div
                  className="mt-[8px]"
                  dangerouslySetInnerHTML={{
                    __html: convert.makeHtml(item?.content),
                  }}
                />

                <JobCommentCollapse comment={item} />
              </div>
            </div>
          </div>
        )}
        locale={{
          emptyText: <></>,
        }}
        {...props}
      />
    </ConfigProvider>
  )
}

export default JobCommentList
