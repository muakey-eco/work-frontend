'use client'

import { Button } from '@/ui'
import { PlusOutlined } from '@ant-design/icons'
import CustomFieldsModalForm from './CustomFieldsModalForm'

const CustomFieldHeader = ({ stages }: { stages: any[] }) => {
  return (
    <div className="-mx-[24px] flex items-center justify-between gap-[24px] px-[24px] pb-[16px]">
      <div className="text-[18px] font-[600]">
        <div>Trường tùy chỉnh</div>
        <div className="text-[12px] font-[400] text-[#aaa]">
          Kéo thả file Excel để nhập trường dữ liệu tùy chỉnh{' '}
          <span className="font-[600] text-[#267cde]">(File Excel mẫu)</span>
        </div>
      </div>

      <CustomFieldsModalForm
        options={{
          stages,
        }}
      >
        <Button
          className="cursor-pointer rounded-md !bg-[#42b814] px-[12px]! py-[8px]! text-[13px]! font-[500] text-[#fff] hover:!bg-[#42b814]/80"
          color="primary"
          icon={<PlusOutlined />}
        >
          Thêm
        </Button>
      </CustomFieldsModalForm>
    </div>
  )
}

export default CustomFieldHeader
