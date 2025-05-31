'use client'

import { PlusOutlined } from '@/ui/icons'
import { Button } from 'antd'
import React, { useState } from 'react'

import ReportFieldList from './ReportFieldList'
import ReportFieldsModalForm from './ReportFieldsModalForm'

type ReportFieldsProps = {
  stages?: any[]
  workflowId: number
}

const ReportFields: React.FC<ReportFieldsProps> = ({ stages, workflowId }) => {
  const [fields, setFields] = useState([])

  return (
    <div className="h-[calc(100vh-82px)] overflow-auto bg-[#eee] p-[20px]">
      <div className="mx-auto w-[860px] bg-[#fff] p-[24px] shadow-[0_2px_6px_0_#0000000f]">
        <div className="-mx-[24px] flex items-center justify-between gap-[24px] px-[24px] pb-[16px]">
          <div className="text-[18px] font-[600]">
            <div>Trường báo cáo</div>
            <div className="text-[12px] font-[400] text-[#aaa]">
              Kéo thả file Excel để nhập trường dữ liệu báo cáo{' '}
              <span className="font-[600] text-[#267cde]">
                (File Excel mẫu)
              </span>
            </div>
          </div>

          <ReportFieldsModalForm
            options={{
              stages,
            }}
          >
            <Button
              className="!bg-[#42b814] px-[12px]! py-[8px]! text-[13px]! font-[500] text-[#fff]"
              type="primary"
              icon={<PlusOutlined />}
            >
              Thêm
            </Button>
          </ReportFieldsModalForm>
        </div>

        <ReportFieldList
          dataSource={fields}
          options={{
            stages,
          }}
        />
      </div>
    </div>
  )
}

export default ReportFields
