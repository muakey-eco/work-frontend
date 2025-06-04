'use client'

import { getBrandAction } from '@/app/(work)/asset/components/action'
import { useAsyncEffect } from '@/libs/hook'
import { Form, FormItemProps, Input } from 'antd'
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
      <Input placeholder="Nhập tên hãng" />
    </Form.Item>
  )
}

export default BrandFormItems
