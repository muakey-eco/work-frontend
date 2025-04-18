'use client'

import { AccountModalForm, PageHeader } from '@/components'
import { useAsyncEffect } from '@/libs/hook'
import { convertToSlug } from '@/libs/utils'
import { PlusOutlined } from '@ant-design/icons'
import { Button, TabsProps } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Search from './Search'
import { getAccountsRequest } from './action'

export type AccountPageHeaderProps = {
  options: any
}

const AccountPageHeader: React.FC<AccountPageHeaderProps> = ({ options }) => {
  const { views } = options

  const searchParams = useSearchParams()
  const query = new URLSearchParams(searchParams)
  const router = useRouter()
  const view = query.get('view') || 'all'
  const search = query.get('search') || ''

  const [dataAccount, setDataAccount] = useState<any>()
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchData = async () => {
    query.set('include', 'list')
    query.set('page', '1')
    query.set('per_page', '10')
    query.set('search', search || '')
    query.set('view', view || '')
    query.set('role_id', '')
    query.set('quit_work', '')
    const accounts = await getAccountsRequest(query)
    setDataAccount(accounts)
  }

  useAsyncEffect(async () => {
    await fetchData()
  }, [view, search, refreshKey])

  // Expose refresh function to parent
  useEffect(() => {
    const handleRefresh = () => {
      setRefreshKey((prev) => prev + 1)
    }
    window.addEventListener('accountStatusChanged', handleRefresh)
    return () => {
      window.removeEventListener('accountStatusChanged', handleRefresh)
    }
  }, [])

  let activeKey =
    view === 'all'
      ? 'all'
      : views.find((value: any) => convertToSlug(value.name) === view).id

  const tabItems: TabsProps['items'] = views.map((role: any) => ({
    label: `${role.name} ${dataAccount ? '(' + (role.id === 'all' ? dataAccount.total : dataAccount.count_role_account[role.name]) + ')' : ''}`,
    key: role.id,
  }))

  const handleChangeTab = (key: string) => {
    const { id, name } = views.find((value: any) => value.id === key)
    if (id === 'all') {
      query.delete('view')
      query.delete('quit_work')
    } else if (id === 'disabled') {
      query.set('view', 'vo-hieu-hoa')
      query.set('quit_work', '1')
    } else {
      const view = convertToSlug(name)
      query.set('view', view)
      query.delete('quit_work')
    }
    query.delete('page')
    router.push(`?${query.toString()}`)
  }

  return (
    <PageHeader
      title="Danh sách tài khoản"
      extra={
        <div className="flex h-full items-end">
          <Search />
        </div>
      }
      headerExtra={
        <AccountModalForm>
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm tài khoản
          </Button>
        </AccountModalForm>
      }
      tab={{
        items: tabItems,
        className: '!pt-[8px]',
        onChangeTab: handleChangeTab,
        activeKey: activeKey,
      }}
    />
  )
}

export default AccountPageHeader
