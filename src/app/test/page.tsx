import React from 'react'
import Ip from './Ip'
import TestForm from './TestForm'

const Page: React.FC = async () => {
  return (
    <div className="p-[12px]">
      <Ip />
      <h1 className="text-2xl font-bold">Test Component Page</h1>
      <TestForm />
    </div>
  )
}

export default Page
