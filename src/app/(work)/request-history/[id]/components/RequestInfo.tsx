import { Col, Row } from 'antd'
import React from 'react'

import '@/styles/globals.css'

type RequestInfoProps = {
  info?: any[]
}

const RequestInfo: React.FC<RequestInfoProps> = ({ info }) => {
  return (
    <div>
      {info?.map((i, index) =>
        i[0]?.component ? (
          i[0]?.component
        ) : (
          <Row
            key={index}
            gutter={[24, 24]}
            className="custom-scrollbar overflow-y-auto"
          >
            {i?.map((child: any) => (
              <Col key={child?.key} span={12}>
                <div className="text-[14px] leading-[22px] text-[#00000073]">
                  {child?.label}
                </div>
                <div className="mt-[8px] text-[16px] leading-[28px] text-[#000000D9]">
                  {child?.children}
                </div>
              </Col>
            ))}
          </Row>
        ),
      )}
    </div>
  )
}

export default RequestInfo
