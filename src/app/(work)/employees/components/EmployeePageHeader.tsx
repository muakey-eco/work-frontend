'use client'

import { PageHeader } from '@/components'
import { convertToSlug } from '@/libs/utils'
import {
  MenuOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Input, TabsProps, theme } from 'antd'
import { createStyles } from 'antd-style'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
import EmployeeModalForm from './employee-modal-form'
import ViewModalForm from './view-modal-form'
import ViewOption from './view-option'

export type EmployeePageHeaderProps = {
  tabs?: any[]
}

const useStyle = createStyles(({ css }) => ({
  sortable: css`
    .sortable-ghost {
      opacity: 0.4;
      background: #f0f0f0;
    }
    .sortable-chosen {
      background: #e6f7ff;
    }
    .sortable-drag {
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    .drag-handle {
      cursor: grab;
      &:active {
        cursor: grabbing;
      }
    }
  `,
}))

const EmployeePageHeader: React.FC<EmployeePageHeaderProps> = ({ tabs }) => {
  const { useToken } = theme
  const { token } = useToken()
  const { styles } = useStyle()

  const searchParams = useSearchParams()
  const query = new URLSearchParams(searchParams)
  const router = useRouter()
  const [sortableTabs, setSortableTabs] = useState<any[]>([])

  const activeTab = query.get('view') || sortableTabs[0]?.key

  const handleChangeTab = (key: string) => {
    query.set('view', key)
    query.delete('page')
    router.push(`?${query.toString()}`)
  }

  const handleViewClick = (key: string) => {
    query.set('view', key)
    query.delete('page')
    router.push(`?${query.toString()}`)
  }

  useEffect(() => {
    setSortableTabs(
      (tabs || []).map((tab) => ({
        id: tab.id,
        label: tab.name,
        key: convertToSlug(String(tab.name)),
      })),
    )
  }, [tabs])

  const tabItems: TabsProps['items'] = [
    ...sortableTabs.map((tab, index) => ({
      label: (
        <ViewOption
          name={tab.label}
          activeTab={activeTab}
          key={index}
          id={tab.id}
          onDelete={(id) => {
            setSortableTabs((prev) => {
              const newTabs = prev.filter((tab) => tab.id !== id)
              const newFirstSlug = convertToSlug(newTabs[0]?.label || '')
              router.push(`?view=${newFirstSlug}`)
              return newTabs
            })
          }}
        />
      ),
      key: tab.key,
    })),
  ]

  const sortableRef = useRef<HTMLUListElement>(null)
  const sortableInstance = useRef<Sortable | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (dropdownOpen && sortableRef.current && !sortableInstance.current) {
      sortableInstance.current = new Sortable(sortableRef.current, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: function (evt) {
          setSortableTabs((prev) => {
            const newList = [...prev]
            const [removed] = newList.splice(evt.oldIndex!, 1)
            newList.splice(evt.newIndex!, 0, removed)
            return newList
          })
        },
      })
    }
    return () => {
      if (!dropdownOpen && sortableInstance.current) {
        sortableInstance.current.destroy()
        sortableInstance.current = null
      }
    }
  }, [dropdownOpen])

  // useEffect(() => {
  //   const updateOrder = async () => {
  //     const data = sortableTabs.map((tab) => ({
  //       id: tab.id,
  //       name: tab.label,
  //     }))

  //     const res = await updateTabAction(data)
  //     console.log('res', res)
  //   }
  //   updateOrder()
  // }, [sortableTabs])

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  }

  const [filteredTabs, setFilteredTabs] = useState<any[]>([])
  useEffect(() => {
    setFilteredTabs(sortableTabs)
  }, [sortableTabs])

  const handleSearch = (value: string) => {
    if (value) {
      const lower = value.toLowerCase()
      setFilteredTabs(
        sortableTabs.filter((tab) => tab.label.toLowerCase().includes(lower)),
      )
    } else {
      setFilteredTabs(sortableTabs)
    }
  }

  return (
    <PageHeader
      title="Danh sách nhân sự"
      extra={
        <EmployeeModalForm>
          <Button icon={<PlusOutlined />} type="primary">
            Thêm nhân sự
          </Button>
        </EmployeeModalForm>
      }
      tab={{
        items: tabItems,
        onChangeTab: handleChangeTab,
        activeKey: activeTab,
        extra: (
          <div className="flex items-center gap-[32px]">
            <Dropdown
              trigger={['click']}
              onOpenChange={setDropdownOpen}
              dropdownRender={() => (
                <div style={contentStyle}>
                  <div className="px-[4px] pt-[4px]">
                    <Input.Search
                      placeholder="Tìm kiếm"
                      onSearch={handleSearch}
                      allowClear
                    />
                  </div>
                  <ul
                    ref={sortableRef}
                    className={`m-0 list-none p-0 ${styles.sortable}`}
                  >
                    {filteredTabs.map((tab) => (
                      <li
                        key={tab.key}
                        onClick={() => handleViewClick(tab.key)}
                        className="flex items-center gap-[8px] rounded-[4px] px-[12px] leading-[32px] select-none hover:bg-gray-100"
                      >
                        <MenuOutlined className="drag-handle cursor-move" />
                        <span>{tab.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            >
              <div className="flex cursor-pointer items-center gap-[8px]">
                <MenuOutlined className="text-[#00000073]" />
                <span className="text-[14px] leading-[22px] text-nowrap">
                  Tất cả views
                </span>
              </div>
            </Dropdown>
            <ViewModalForm action="create">
              <div className="flex cursor-pointer items-center gap-[8px]">
                <PlusCircleOutlined className="text-[#00000073]" />
                <span className="text-[14px] leading-[22px] text-nowrap">
                  Thêm views
                </span>
              </div>
            </ViewModalForm>
          </div>
        ),
      }}
    />
  )
}

export default EmployeePageHeader
