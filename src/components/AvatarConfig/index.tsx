'use client'

import { updateProfileAction } from '@/app/(work)/profile/[id]/(more)/action'
import { uploadFiles } from '@/libs/data'
import { UserOutlined } from '@ant-design/icons'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { App, Avatar, Button, Modal, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type AvatarConfigProps = {
  children: React.ReactNode
  className?: string
  user?: any
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const AvatarConfig: React.FC<AvatarConfigProps> = ({
  children,
  className,
  user,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const { message } = App.useApp()

  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleChangeAvatar = async () => {
    setLoading(true)
    const file = fileList[0]?.originFileObj as File
    if (!file) return

    const formData = new FormData()
    formData.append('files', file)

    const res = await uploadFiles(formData)

    const avatar = res?.url
    if (avatar) {
      const { message: msg, errors } = await updateProfileAction(user?.id, {
        avatar: avatar,
      })
      if (errors) {
        message.error(msg)
        return
      }
      router.refresh()
      message.success('Cập nhật avatar thành công')
      setIsModalOpen(false)
    } else {
      message.error('Cập nhật avatar thất bại')
    }
    setLoading(false)
  }

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as FileType)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const onCancel = () => {
    setIsModalOpen(false)
  }
  const recentAvatars = [
    'https://picsum.photos/200',
    'https://picsum.photos/200',
  ]

  const placeholderCount = 5 - recentAvatars.length
  const filledAvatars = [
    ...recentAvatars,
    ...Array.from({ length: placeholderCount }, () => null),
  ]
  return (
    <>
      <span className={className} onClick={showModal}>
        {children}
      </span>
      <Modal
        title="Chọn một hình ảnh"
        open={isModalOpen}
        width={340}
        onCancel={onCancel}
        footer={[
          <Button
            key="ok"
            loading={loading}
            type="primary"
            onClick={handleChangeAvatar}
          >
            Lưu
          </Button>,
        ]}
      >
        <ImgCrop rotationSlider>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            maxCount={1}
          >
            {fileList.length === 0 && '+ Upload'}
          </Upload>
        </ImgCrop>

        <div className="mt-4 flex flex-col gap-2">
          <p className="text-gray-500">Ảnh Đại Diện Gần Đây</p>
          <span className="mb-2 text-gray-500">
            Truy cập 5 ảnh đại diện gần đây nhất của bạn
          </span>
          <div className="flex flex-wrap gap-1">
            {filledAvatars.map((url, idx) => (
              <Avatar
                key={idx}
                src={url}
                size={48}
                className="cursor-pointer"
                icon={!url ? <UserOutlined /> : undefined}
                onClick={() => {
                  if (url) {
                    setFileList([
                      {
                        uid: idx.toString(),
                        name: `avatar-${idx}.png`,
                        status: 'done',
                        url,
                      },
                    ])
                  }
                }}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}

export default AvatarConfig
