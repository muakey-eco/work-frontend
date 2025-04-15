'use client'

import React, { useState } from 'react'
import CheckInForm from '../checkin-form'
import CheckInHistoryTable from '../checkin-history-table'
import CheckInTable from '../CheckInTable'

type CheckInContentProps = {
  options?: any
  query?: any
}

const CheckInContent: React.FC<CheckInContentProps> = ({ query, options }) => {
  const [date, setDate] = useState(new Date())

  const { members, day, propose, ...restOptions } = options

  const { type } = query

  const { attendances } = restOptions?.attendances

  console.log('members', members)

  switch (type) {
    case 'form-request':
      return (
        <CheckInForm
          initialValues={{
            date,
            user: options?.user,
            attendances,
          }}
        />
      )

    case 'table-history':
      return <CheckInHistoryTable options={{ propose, user: options?.user }} />

    default:
      return (
        <CheckInTable
          options={{
            ...restOptions,
            members: members?.filter((mem: any) => mem?.type !== 'department'),
            day: Number(day || 0),
          }}
          scroll={{
            x: 'max-content',
            y: 'calc(100vh - 230px)',
          }}
          pagination={false}
          bordered
          onDateSelect={setDate}
        />
      )
  }
}

export default CheckInContent
