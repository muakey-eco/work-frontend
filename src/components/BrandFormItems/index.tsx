'use client'

import { getBrandAction } from '@/app/(work)/asset/components/action'
import { useAsyncEffect } from '@/libs/hook'
import { Form, FormItemProps, Select } from 'antd'
import { useState } from 'react'

type BrandFormItemsProps = FormItemProps

const BrandFormItems: React.FC<BrandFormItemsProps> = ({ ...props }) => {
  const [brands, setBrands] = useState<any[]>([])

  useAsyncEffect(async () => {
    try {
      const res = await getBrandAction()
      const validBrands = Array.isArray(res)
        ? res.filter((brand) => brand && brand.id)
        : []
      setBrands(validBrands)
    } catch (error) {
      console.error('Error fetching brands:', error)
      setBrands([])
    }
  }, [])

  return (
    <Form.Item {...props}>
      <Select
        placeholder="Chọn hãng"
        options={brands}
        fieldNames={{ label: 'name', value: 'id' }}
      />
    </Form.Item>
  )
}

export default BrandFormItems
