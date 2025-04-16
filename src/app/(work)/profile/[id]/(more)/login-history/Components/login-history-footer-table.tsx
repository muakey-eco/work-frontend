import { Pagination } from 'antd'

type LoginHistoryFooterTableProps = {
  current: number
  pageSize: number
  total: number
  onChange: (pagination: any) => void // Thay đổi kiểu dữ liệu để phù hợp với Table onChange
}

const LoginHistoryFooterTable: React.FC<LoginHistoryFooterTableProps> = ({
  current,
  pageSize,
  total,
  onChange,
}) => {
  return (
    <div className="m-[16px] flex items-center">
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        showSizeChanger // Cho phép thay đổi số lượng item hiển thị
        showQuickJumper
        pageSizeOptions={['10', '20', '50', '100']} // Các tùy chọn số lượng item
        onChange={(page, pageSize) => onChange({ current: page, pageSize })} // Gọi onChange với cả page và pageSize
        showTotal={() => (
          <p className="text-[#000000E0]">Total {total} items</p>
        )}
      />
    </div>
  )
}

export default LoginHistoryFooterTable
