'use client'

import { PageHeader } from '@/components'
import { convertToSlug } from '@/libs/utils'
import {
  MenuOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, TabsProps, theme } from 'antd'
import { createStyles } from 'antd-style'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import EmployeeModalForm from './employee-modal-form'
import ViewModalForm from './view-modal-form'

export type EmployeePageHeaderProps = {
  tabs?: any[]
}

const useStyle = createStyles(({ css }) => ({
  menu: css`
    .ant-dropdown-menu {
      .ant-dropdown-menu-item {
        padding: 0;
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

  const tabItems: TabsProps['items'] = [
    ...(tabs || []).map((tab, index) => ({
      label:
        index === 0 ? (
          <div className="flex items-center gap-[8px]">
            <span>Tổng quan</span>
            <MoreOutlined />
          </div>
        ) : (
          tab.name
        ),
      key: convertToSlug(tab.name),
    })),
  ]

  const menuItems: MenuProps['items'] = (tabs || []).map((tab) => ({
    label: (
      <div
        className="flex items-center gap-[8px] px-[12px] leading-[32px]"
        onClick={() => handleViewClick(convertToSlug(String(tab.name)))}
      >
        <MenuOutlined />
        <span>{tab.name}</span>
      </div>
    ),
    key: convertToSlug(String(tab.name)),
  }))

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  }

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  }

  const handleChangeTab = (key: string) => {
    query.set('view', key)

    router.push(`?${query.toString()}`)
  }

  const handleViewClick = (key: string) => {
    query.set('view', key)

    router.push(`?${query.toString()}`)
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
        extra: (
          <div className="flex items-center gap-[32px]">
            <Dropdown
              trigger={['click']}
              rootClassName={styles.menu}
              menu={{ items: menuItems }}
              dropdownRender={(menu) => (
                <div style={contentStyle}>
                  <div className="px-[4px] pt-[4px]">
                    <Input.Search placeholder="Tìm kiếm" />
                  </div>
                  {React.cloneElement(menu as React.ReactElement, {
                    style: menuStyle,
                  })}
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
            <ViewModalForm>
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
