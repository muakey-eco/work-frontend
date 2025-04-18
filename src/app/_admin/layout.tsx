import { AdminLayoutUI } from '@/components'
import React from 'react'

const AdminLayout: React.FC<
  Readonly<{
    children?: React.ReactNode
  }>
> = ({ children }) => {
  return <AdminLayoutUI>{children}</AdminLayoutUI>
}

export default AdminLayout
