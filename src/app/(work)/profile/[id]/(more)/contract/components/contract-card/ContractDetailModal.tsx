import { useAsyncEffect } from '@/libs/hook'
import { randomColor } from '@/libs/utils'
import { PaperClipOutlined } from '@ant-design/icons'
import { Avatar, Modal, ModalProps } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import React, { useState } from 'react'
import { getAccountByIdAction } from '../../../action'
import Detail from '../Detail'
import { genStatus } from '../ultils'

export type ContractDetailModalProps = ModalProps & {
  children?: React.ReactNode
  item?: any
}

const ContractDetailModal: React.FC<ContractDetailModalProps> = ({
  children,
  item,
  ...props
}) => {
  const [open, setOpen] = useState(false)

  const [account, setAccount] = useState<any>(null)

  useAsyncEffect(async () => {
    if (!open) return

    const data = await getAccountByIdAction(item?.account_id)

    setAccount(data)
  }, [open])

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        title="Xem hợp đồng"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={846}
        classNames={{
          body: '!space-y-[16px]',
        }}
        {...props}
      >
        <div className="flex items-start gap-[16px]">
          <Detail
            className="flex-1"
            label="Loại hợp đồng"
            value={item?.category?.name}
          />
          <Detail
            className="flex-1"
            label="Trạng thái"
            value={genStatus(item?.status)}
          />
        </div>

        <div className="flex items-start gap-[16px]">
          <Detail
            className="flex-1"
            label="Ngày bắt đầu"
            value={dayjs(item?.start_date).format('DD/MM/YYYY')}
          />
          <Detail
            className="flex-1"
            label="Ngày kết thúc"
            value={dayjs(item?.end_date).format('DD/MM/YYYY')}
          />
        </div>

        <div className="flex items-start gap-[16px]">
          <Detail
            className="flex-1"
            label="Ngày tạo"
            value={dayjs(item?.created_at).format('DD/MM/YYYY')}
          />
          <Detail
            className="flex-1"
            label="Tạo bởi"
            value={
              <div className="flex items-center gap-[8px]">
                <Avatar
                  src={account?.avatar}
                  alt={account?.full_name}
                  style={{
                    backgroundColor: randomColor(String(account?.full_name)),
                  }}
                  shape="circle"
                >
                  {String(account?.full_name)?.charAt(0).toUpperCase()}
                </Avatar>
                <span>{account?.full_name}</span>
              </div>
            }
          />
        </div>

        {item?.files && (
          <Detail
            label="Tệp đính kèm"
            value={
              <div className="flex flex-col gap-[8px]">
                {item?.files?.map((file: any, index: number) => (
                  <Link
                    href={file?.file_url}
                    className="flex items-center gap-[8px]"
                    key={index}
                    target="_blank"
                  >
                    <PaperClipOutlined className="text-[#00000073]!" />
                    <span className="text-[14px] leading-[22px] font-[400] text-[#1890FF]">
                      {file?.file_name}
                    </span>
                  </Link>
                ))}
              </div>
            }
          />
        )}

        {item?.note && (
          <Detail
            label="Ghi chú"
            value={<div dangerouslySetInnerHTML={{ __html: item?.note }} />}
          />
        )}
      </Modal>
    </>
  )
}

export default ContractDetailModal
