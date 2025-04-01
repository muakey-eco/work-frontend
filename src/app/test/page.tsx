import { headers } from 'next/headers'
import React from 'react'
import Ip from './Ip'
import TestForm from './TestForm'

const Page: React.FC = async () => {
  const headersList = await headers()

  const xForwardedFor = headersList.get('x-forwarded-for')

  return (
    <div className="p-[12px]">
      <Ip />
      <p>{xForwardedFor}</p>
      <h1 className="text-2xl font-bold">Test Component Page</h1>
      <TestForm />
    </div>
  )
}

export default Page
