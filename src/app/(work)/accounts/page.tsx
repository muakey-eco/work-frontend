import React from 'react'
import AccountTable from './components/account-table'
import AccountPageHeader from './components/AccountPageHeader'
import AccountPageProvider from './components/AccountPageProvider'
import { getRolesRequest } from './components/action'

const AccountsPage: React.FC<any> = async () => {
  const roles = await getRolesRequest()
  const views = [
    { name: 'Tất cả', id: 'all' },
    ...roles,
    { name: 'Vô hiệu hoá', id: 'disabled' },
  ]

  return (
    <AccountPageProvider>
      <div className="h-[100vh] bg-[#f5f5f5]">
        <AccountPageHeader options={{ views }} />
        <div className="p-[16px]">
          <AccountTable views={views} />
        </div>
      </div>
    </AccountPageProvider>
  )
}

export default AccountsPage
