import { Tag } from 'antd'

interface StatusTagProps {
  status: 'using' | 'unused' | 'warranty' | 'broken' | 'liquidated'
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const getStatusTag = () => {
    switch (status) {
      case 'using':
        return <Tag color="success">Đang sử dụng</Tag>
      case 'unused':
        return <Tag color="default">Chưa sử dụng</Tag>
      case 'warranty':
        return <Tag color="warning">Đang bảo hành</Tag>
      case 'broken':
        return <Tag color="error">Hỏng</Tag>
      case 'liquidated':
        return <Tag color="purple">Đã thanh lý</Tag>
      default:
        return null
    }
  }

  return getStatusTag()
}

export default StatusTag
