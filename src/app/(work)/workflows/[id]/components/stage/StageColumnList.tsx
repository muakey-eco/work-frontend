import { PlusOutlined } from '@ant-design/icons'
import { Col } from 'antd'
import React, { memo } from 'react'
import StageColumnDroppable from './StageColumnDroppable'
import StageModalForm from './StageModalForm'

type StageColumnListProps = {
  items?: any[]
  options?: any
}

const StageColumnList: React.FC<StageColumnListProps> = ({
  items,
  options,
}) => {
  const { user, activeItem } = options

  const filteredStages = items?.filter(
    (stage: any) => ![0, 1].includes(stage?.index),
  )

  return (
    <>
      {filteredStages && filteredStages?.length <= 0 && (
        <Col className="group flex w-[272px] cursor-pointer items-center justify-center overflow-hidden border-r border-[#eee] bg-[#fff] transition-all hover:bg-[#f9f9f9]">
          <StageModalForm>
            <div className="flex flex-col items-center gap-[8px] text-[#aaa] transition-all group-hover:text-[#267cde]">
              <PlusOutlined className="text-[40px] font-[500]" />
              THÊM GIAI ĐOẠN
            </div>
          </StageModalForm>
        </Col>
      )}
      {items?.map((stage: any) => (
        <StageColumnDroppable
          key={stage?.id}
          stage={stage}
          userId={user?.id}
          options={{
            role: user?.role,
            activeItem,
            stages: items,
          }}
        />
      ))}
    </>
  )
}

export default memo(StageColumnList)
