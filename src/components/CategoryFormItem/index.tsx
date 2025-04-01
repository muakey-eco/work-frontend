'use client'

import { getAssetCategoriesAction } from '@/app/(work)/asset/components/action'
import { useAsyncEffect } from '@/libs/hook'
import { Form, FormItemProps, Select } from 'antd'
import { useState } from 'react'

type CategoryFormItemsProps = FormItemProps

const CategoryFormItems: React.FC<CategoryFormItemsProps> = ({ ...props }) => {
  const [categories, setCategories] = useState<Array<any>>([])

  useAsyncEffect(async () => {
    try {
      const res = await getAssetCategoriesAction()
      const validCategories = Array.isArray(res)
        ? res.filter((category) => category && category.id)
        : []
      setCategories(validCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }, [])

  return (
    <Form.Item {...props}>
      <Select
        placeholder="Chọn loại tài sản"
        options={categories}
        fieldNames={{ label: 'name', value: 'id' }}
        allowClear
      />
    </Form.Item>
  )
}

export default CategoryFormItems
