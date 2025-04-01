import { App } from 'antd'
import React from 'react'

const AppProviders: React.FC<
  Readonly<{
    children?: React.ReactNode
  }>
> = ({ children }) => {
  return <App>{children}</App>
}

export default AppProviders
