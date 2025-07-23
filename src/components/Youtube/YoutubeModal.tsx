'use client'

import { useAsyncEffect } from '@/libs/hook'
import { App, DatePicker, Form, Input, Modal, Select } from 'antd'
import React, { useCallback, useState } from 'react'
import { createVideoAction, getChannelSuggestionsAction } from '../action'
import GameTitleSuggestion from './GameTitleSuggestion'
import NameTitleSuggestion from './NameTitleSuggestion'

const YoutubeModal: React.FC<{ children: React.ReactNode; taskId: number }> = ({
  children,
  taskId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const [playlists, setPlaylists] = useState<any[]>([])

  useAsyncEffect(async () => {
    // Lần đầu load có thể lấy danh sách mặc định nếu muốn, hoặc để trống
    setPlaylists([])
  }, [])
  const handleChange = useCallback(
    async (value: any) => {
      // Gọi API lấy dữ liệu liên quan đến kênh
      const response = await getChannelSuggestionsAction(value)
      const dataPlaylists = response
        .filter((item: any) => item.playlist !== null)
        .map((item: any) => item.playlist)
        .flat()
      const hashtags = response.map((item: any) => item.default_tags).flat()
      const titles = response.map((item: any) => item.default_title)
      // Cập nhật vào form
      form.setFieldsValue({
        title: titles[0] || '',
        playlist: dataPlaylists[0] || '',
        hashtags: hashtags.join(',') || '',
      })
      setPlaylists(dataPlaylists)
    },
    [form],
  )

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = async (formData: any) => {
    setLoading(true)

    const formattedValues = {
      ...formData,
      task_id: taskId,
      youtube_channel_id: 1,
      upload_date: formData.upload_date.format('YYYY-MM-DD HH:mm:ss'),
    }
    try {
      await createVideoAction(formattedValues)
      message.success('Thêm video thành công')
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error('Thêm video thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="cursor-pointer" onClick={showModal}>
        {children}
      </div>
      <Modal
        closable={false}
        open={isModalOpen}
        okText="Thêm"
        cancelText="Hủy"
        onCancel={handleCancel}
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Thêm video</span>
          </div>
        }
        modalRender={(dom) => (
          <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={handleOk}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          label="Tên kênh"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên kênh' }]}
        >
          <NameTitleSuggestion onChange={handleChange} />
        </Form.Item>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề ' }]}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input placeholder="Nhập mô tả" />
        </Form.Item>
        <Form.Item
          label="Danh sách phát"
          name="playlist"
          rules={[{ required: true, message: 'Vui lòng chọn danh sách phát' }]}
        >
          <Select
            options={playlists.map((item: any) => ({
              label: item,
              value: item,
            }))}
            placeholder="Chọn danh sách phát"
          />
        </Form.Item>
        <Form.Item
          label="Thẻ"
          name="hashtags"
          rules={[{ required: true, message: 'Vui lòng chọn thẻ' }]}
        >
          <Input placeholder="Nhập thẻ #hashtag1,#hashtag2" />
        </Form.Item>
        <Form.Item
          label="Video"
          name="video_url"
          rules={[{ required: true, message: 'Vui lòng nhập link video' }]}
        >
          <Input placeholder="Nhập link video" />
        </Form.Item>
        <Form.Item
          label="Tiêu đề trò chơi"
          name="title_game"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề trò chơi' },
          ]}
        >
          <GameTitleSuggestion />
        </Form.Item>
        <Form.Item
          label="Lịch đăng bài"
          name="upload_date"
          rules={[{ required: true, message: 'Vui lòng chọn lịch đăng bài' }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            onChange={(value: any, dateString: any) => {
              console.log('Selected Time: ', value)
              console.log('Formatted Selected Time: ', dateString)
            }}
            className="w-full"
            onOk={() => {
              console.log('onOk')
            }}
          />
        </Form.Item>
      </Modal>
    </>
  )
}

export default YoutubeModal
