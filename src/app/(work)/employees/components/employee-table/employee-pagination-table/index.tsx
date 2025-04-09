import { Pagination } from 'antd'

type EmployeePaginationTableProps = {
  current: number
  pageSize: number
  total: number
  onChange: (pagination: any) => void
}

const EmployeePaginationTable: React.FC<EmployeePaginationTableProps> = ({
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
        showSizeChanger
        showQuickJumper
        pageSizeOptions={['5', '10', '15', '20', '50', '100']}
        onChange={(page, pageSize) => onChange({ current: page, pageSize })}
        showTotal={() => (
          <p className="text-[#000000E0]">Total {total} items</p>
        )}
      />
    </div>
  )
}

export default EmployeePaginationTable
