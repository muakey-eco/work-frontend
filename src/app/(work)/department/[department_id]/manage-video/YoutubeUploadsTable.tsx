'use client'

import useStyle from '@/ui/hook/useStyle'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { App, Button, Table, Tag } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { deleteYoutubeUploadAction } from './action'

interface DataType {
  id: number
  title: string
  description: string
  hashtags: string
  video_url: string
  title_game: string
  upload_date: string
  status: string
  created_at: string
  task_id: string
  playlist: string
  youtube_channel: {
    id: number
    name: string
  }
}

const customStatus = (status: string) => {
  if (status === 'pending') return <Tag color="blue">Đang xử lý</Tag>
  if (status === 'success') return <Tag color="green">Đã đăng</Tag>
  if (status === 'failed') return <Tag color="red">Lỗi</Tag>
  return <Tag color="gray">--</Tag>
}

const YoutubeUploadsTable: React.FC<{ data: DataType[] }> = ({ data }) => {
  const { styles } = useStyle()
  const router = useRouter()
  const { modal, message } = App.useApp()

  const handleDeleteYoutubeUpload = async (id: number) => {
    try {
      modal.confirm({
        title: 'Xóa video',
        content: 'Bạn có chắc chắn muốn xóa video này không?',
        onOk: async () => {
          await deleteYoutubeUploadAction(id)
          message.success('Xóa video thành công')
          router.refresh()
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Tên kênh',
      dataIndex: 'youtube_channel.name',
      key: 'youtube_channel.name',
      sorter: (a, b) =>
        a.youtube_channel.name.localeCompare(b.youtube_channel.name),
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <span className="ms-3 line-clamp-2 font-semibold">
          {record.youtube_channel?.name || '--'}
        </span>
      ),
    },
    {
      title: 'Tiêu đề video',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text: string) => (
        <span className="line-clamp-2">{text || '--'}</span>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
      render: (text: string) => <span>{text || '--'}</span>,
    },
    {
      title: 'Hashtags',
      dataIndex: 'hashtags',
      key: 'hashtags',
      sorter: (a, b) => a.hashtags.localeCompare(b.hashtags),
      render: (text: string) => <span>{text || '--'}</span>,
    },
    {
      title: 'Link drive',
      dataIndex: 'video_url',
      key: 'video_url',
      width: 150,
      sorter: (a, b) => a.video_url.localeCompare(b.video_url),
      render: (text: string) => (
        <Link
          href={text || ''}
          target="_blank"
          className="line-clamp-1 text-blue-500 hover:underline"
        >
          {text || '--'}
        </Link>
      ),
    },
    {
      title: 'Tiêu đề trò chơi',
      dataIndex: 'title_game',
      key: 'title_game',
      sorter: (a, b) => a.title_game.localeCompare(b.title_game),
      render: (text: string) => <span>{text || '--'}</span>,
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'upload_date',
      key: 'upload_date',
      sorter: (a, b) => a.upload_date.localeCompare(b.upload_date),
      render: (text: string) => (
        <span>{dayjs(text).format('DD/MM/YYYY HH:mm:ss') || '--'}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (text: string) => customStatus(text),
    },
    {
      title: 'Danh sách video',
      dataIndex: 'playlist',
      key: 'playlist',
      sorter: (a, b) => a.playlist.localeCompare(b.playlist),
      render: (text: string) => <span>{text || '--'}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (text: string) => (
        <span>{dayjs(text).format('DD/MM/YYYY HH:mm:ss') || '--'}</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            variant="outlined"
            icon={<EditOutlined />}
            size="small"
            color="primary"
          />
          <Button
            variant="outlined"
            icon={<DeleteOutlined />}
            size="small"
            color="danger"
            onClick={() => handleDeleteYoutubeUpload(record.id)}
          />
        </div>
      ),
    },
  ]

  return (
    <div
      className={clsx(
        'h-[calc(100vh-89px)] w-full bg-[#F6F6F6] p-[16px]',
        styles.customTable,
      )}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default YoutubeUploadsTable
