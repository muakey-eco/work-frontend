import { PictureOutlined } from '@ant-design/icons'
import { Editor } from '@tiptap/react'
import { App, Upload, UploadProps } from 'antd'
import { uploadImageAction } from '../action'

type TiptapUploadImageProps = UploadProps & {
  editor: Editor
}

const TiptapUploadImage: React.FC<TiptapUploadImageProps> = ({
  editor,
  ...rest
}) => {
  const { message } = App.useApp()

  const handleUpload = async (info: any) => {
    const { file } = info
    const formData = new FormData()

    formData.append('image', file.originFileObj || '')

    try {
      const { urlImage: url, error } = await uploadImageAction(formData)

      if (error) {
        message.error(error)
        return
      }

      editor.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      throw new Error(String(error))
    }
  }

  return (
    <Upload {...rest} onChange={handleUpload} showUploadList={false}>
      <div className="flex size-[32px] cursor-pointer items-center justify-center rounded-[6px] bg-transparent transition-all hover:bg-[#0000000a]">
        <PictureOutlined className="cursor-pointer" />
      </div>
    </Upload>
  )
}

export default TiptapUploadImage
