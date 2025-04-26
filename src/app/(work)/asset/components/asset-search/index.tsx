'use client'

import ManageModalForm from '@/components/ManageModalForm'
import { FilterOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import AssetDrawer from '../asset-drawer'
import AssetModalForm from '../asset-modal-form'

export type AssetFilterProps = {
  onAdd?: () => void
}

const AssetFilter: React.FC<AssetFilterProps> = ({ onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const router = useRouter()

  const handleAdd = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleModalSuccess = () => {
    setIsModalOpen(false)
    onAdd?.()
  }
  const handleSearch = async (value: string) => {
    if (value === '') {
      router.push(`/asset`)
    } else {
      try {
        router.push(`/asset?search=${value}`)
      } catch (error) {
        console.error('Error searching:', error)
      }
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[16px]">
        <Input.Search
          className="w-[240px]!"
          placeholder="Tìm kiếm tài sản"
          onSearch={handleSearch}
          allowClear
        />
      </div>
      <div className="flex items-center gap-[16px]">
        <AssetDrawer>
          <Button icon={<FilterOutlined />}>Bộ lọc</Button>
        </AssetDrawer>

        <ManageModalForm label="Loại tài sản" title="Quản lý loại tài sản">
          <Button icon={<PlusOutlined />} type="primary">
            Loại tài sản
          </Button>
        </ManageModalForm>

        <AssetModalForm
          title="Thêm mới tài sản"
          open={isModalOpen}
          onCancel={handleModalClose}
          onSuccess={handleModalSuccess}
          action="add"
        >
          <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
            Thêm
          </Button>
        </AssetModalForm>
      </div>
    </div>
  )
}

export default AssetFilter
