import { getAssetById } from '@/libs/asset'
import { Col, Row } from 'antd'
import React from 'react'
import AssetDetail from './components/asset-detail'
import AssetTimeline from './components/time-line'

const AssetDeail: React.FC<any> = async ({ params }) => {
  const { id } = await params
  const asset = await getAssetById(Number(id))

  return (
    <>
      <Row className="p-4">
        <Col span={18}>
          <AssetDetail asset={asset} />
        </Col>
        <Col span={6} className="h-fit pl-4">
          <AssetTimeline asset={asset} />
        </Col>
      </Row>
    </>
  )
}

export default AssetDeail
