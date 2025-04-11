'use client'

import { Button, Space } from 'antd'
import CompareDataFilter from './filter'

const CompareDataAction = () => {
  return (
    <>
      <Space.Compact>
        <Button type="primary"> Nhân sự </Button>
        <Button> Phòng ban </Button>
      </Space.Compact>
      <CompareDataFilter />
    </>
  )
}

export default CompareDataAction
